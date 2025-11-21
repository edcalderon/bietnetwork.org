"use client";

import { FaLeaf, FaHandsHelping, FaChartLine, FaGlobeAmericas } from 'react-icons/fa';
import FeatureCard from '../../components/ui/FeatureCard';
import { useLanguage } from '@/hooks/useLanguage';
import ParticleSphere from '../../components/ParticleSphere';
import RotatingEarth from '@/components/RotatingEarth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { PRODUCTIVE_UNIT_ADDRESS, PRODUCTIVE_UNIT_ABI } from '@/config/contracts';

interface BietDetails {
  tokenId: bigint;
  name: string;
  description: string;
  category: string;
  location: string;
  creator: string;
  metadataURI: string;
  tags: string[];
}

export default function BietsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const publicClient = usePublicClient();

  const [showGlobeHero, setShowGlobeHero] = useState(false);
  const [biets, setBiets] = useState<BietDetails[]>([]);
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(false);
  const [markersError, setMarkersError] = useState<string | null>(null);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);
  const [mobileView, setMobileView] = useState<'globe' | 'list'>('globe');

  const handleBietClick = (biet: BietDetails) => {
    window.dispatchEvent(new CustomEvent('focusBiet', { 
      detail: { 
        tokenId: biet.tokenId.toString(),
        location: biet.location 
      } 
    }));
  };

  useEffect(() => {
    console.log('Environment check:', { 
      PRODUCTIVE_UNIT_ADDRESS, 
      publicClient: !!publicClient,
      chainId: publicClient?.chain?.id
    });

    if (!publicClient || !PRODUCTIVE_UNIT_ADDRESS) {
      console.log('Missing publicClient or PRODUCTIVE_UNIT_ADDRESS', { publicClient: !!publicClient, PRODUCTIVE_UNIT_ADDRESS });
      return;
    }

    console.log('Starting to load markers...');

    const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
      Colombia: { lat: 4.711, lng: -74.072 },
      Mexico: { lat: 19.4326, lng: -99.1332 },
      'United States': { lat: 39.8283, lng: -98.5795 },
      Brazil: { lat: -14.235, lng: -51.9253 },
      Argentina: { lat: -38.4161, lng: -63.6167 },
      Chile: { lat: -35.6751, lng: -71.543 },
      Peru: { lat: -9.19, lng: -75.0152 },
      Spain: { lat: 40.4637, lng: -3.7492 },
    };

    const loadMarkers = async () => {
      try {
        console.log('Setting loading to true...');
        setIsLoadingMarkers(true);
        setMarkersError(null);

        console.log('Getting latest block...');
        const latestBlock = await publicClient.getBlockNumber();
        const RANGE = 50_000n; // Increased range to find more biets
        const fromBlock = latestBlock > RANGE ? latestBlock - RANGE : 0n;

        console.log('Getting logs from block', fromBlock.toString(), 'to', latestBlock.toString());
        console.log('Contract address:', PRODUCTIVE_UNIT_ADDRESS);
        const logs = await publicClient.getLogs({
          address: PRODUCTIVE_UNIT_ADDRESS,
          event: {
            type: 'event',
            name: 'BietCreated',
            inputs: [
              { indexed: true, type: 'uint256', name: 'tokenId', internalType: 'uint256' },
              { indexed: true, type: 'address', name: 'creator', internalType: 'address' },
              { indexed: false, type: 'string', name: 'name', internalType: 'string' },
              { indexed: false, type: 'string', name: 'category', internalType: 'string' },
              { indexed: false, type: 'uint256', name: 'royaltyPercentage', internalType: 'uint256' },
            ],
          } as any,
          fromBlock,
          toBlock: latestBlock,
        });

        console.log('Found', logs.length, 'logs');
        
        // Test contract connection by trying to read a known biet (tokenId 1)
        try {
          console.log('Testing contract connection with tokenId 1...');
          const testBiet = await publicClient.readContract({
            address: PRODUCTIVE_UNIT_ADDRESS,
            abi: PRODUCTIVE_UNIT_ABI as any,
            functionName: 'biets',
            args: [1n],
          });
          console.log('Test biet result:', testBiet);
        } catch (testErr) {
          console.log('Contract test failed:', testErr);
        }
        
        const tokenIds = logs
          .map((log: any) => log.args?.tokenId as bigint | undefined)
          .filter((id: any): id is bigint => id !== undefined);

        console.log('Extracted tokenIds:', tokenIds);
        const uniqueTokenIds = Array.from(new Set(tokenIds.map((id: any) => id.toString()))).map((id: unknown) => BigInt(id as string));

        console.log('Unique tokenIds:', uniqueTokenIds.length);

        const bietDetails: BietDetails[] = [];
        const newMarkers: { lat: number; lng: number }[] = [];

        for (const tokenId of uniqueTokenIds) {
          try {
            console.log('Fetching biet for tokenId:', tokenId.toString());
            const biet = await publicClient.readContract({
              address: PRODUCTIVE_UNIT_ADDRESS,
              abi: PRODUCTIVE_UNIT_ABI as any,
              functionName: 'biets',
              args: [tokenId],
            });

            const bietData = biet as any;
            const bietArray = bietData as any[];
            const location = bietArray[9] || '';
            
            bietDetails.push({
              tokenId,
              name: bietArray[0] || `Biet #${tokenId.toString()}`,
              description: bietArray[1] || '',
              category: bietArray[2] || '',
              location: location,
              creator: bietArray[3] || '',
              metadataURI: '', 
              tags: bietArray[10] || [],
            });
            
            if (location && COUNTRY_COORDS[location]) {
              newMarkers.push(COUNTRY_COORDS[location]);
            }
          } catch (err) {
            console.log('Error fetching biet:', err);
            // ignore individual read errors
          }
        }

        console.log('Final results:', { bietDetails: bietDetails.length, markers: newMarkers.length });
        
        // If no biets found, add sample data for testing
        if (bietDetails.length === 0) {
          console.log('No biets found, adding sample data for testing...');
          setIsUsingSampleData(true);
          const sampleBiets = [
            {
              tokenId: 1n,
              name: 'Sample Biet - Colombia Coffee Farm',
              description: 'A sustainable coffee farm in the mountains of Colombia producing premium organic coffee beans.',
              category: 'Agriculture',
              location: 'Colombia',
              creator: '0x1234567890123456789012345678901234567890',
              metadataURI: '',
              tags: ['organic', 'coffee', 'sustainable']
            },
            {
              tokenId: 2n,
              name: 'Sample Biet - Mexico Solar Project',
              description: 'Community solar energy project bringing clean power to rural Mexico.',
              category: 'Renewable Energy',
              location: 'Mexico',
              creator: '0x2345678901234567890123456789012345678901',
              metadataURI: '',
              tags: ['solar', 'energy', 'community']
            }
          ];
          
          bietDetails.push(...sampleBiets);
          newMarkers.push(
            { lat: 4.711, lng: -74.072 }, // Colombia
            { lat: 19.4326, lng: -99.1332 } // Mexico
          );
          
          console.log('Added sample biets:', sampleBiets.length);
        }
        
        setBiets(bietDetails);
        setMarkers(newMarkers);
      } catch (err: any) {
        console.log('Error in loadMarkers:', err);
        setMarkersError(err?.message ?? 'Failed to load Biet locations.');
      } finally {
        console.log('Setting loading to false...');
        setIsLoadingMarkers(false);
      }
    };

    loadMarkers();
  }, [publicClient]);

  // Add escape key handler to close globe view
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGlobeHero) {
        setShowGlobeHero(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showGlobeHero]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <ParticleSphere />
      </div>
      
      <div className="relative z-10">
        <div className="h-screen w-full flex flex-col items-center justify-center">
          {!showGlobeHero ? (
            <div className="text-center p-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6 backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-200">
                  🌱 {t('biets.title')}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                {t('biets.title')}
              </h1>

              <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
                {t('biets.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
                  onClick={() => router.push('/dashboard?tab=biets')}
                >
                  {t('biets.join')}
                  <FaLeaf className="h-5 w-5" />
                </button>
                <button
                  className="px-8 py-4 bg-transparent border border-green-400 text-green-100 font-semibold rounded-lg hover:bg-green-500/10 transition-colors duration-300 flex items-center gap-2"
                  onClick={() => setShowGlobeHero(true)}
                >
                  View all Biets on globe
                  <FaGlobeAmericas className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
              {/* Mobile-First Header */}
              <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" clipRule="evenodd"/>
                    </svg>
                    <h2 className="text-lg font-bold text-white">All Biets</h2>
                  </div>
                  <button
                    onClick={() => setShowGlobeHero(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>

                {/* Mobile View Toggle - Only show on small screens */}
                <div className="lg:hidden flex items-center justify-center mb-3">
                  <div className="inline-flex rounded-lg bg-slate-700 p-1">
                    <button
                      onClick={() => setMobileView('globe')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        mobileView === 'globe'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-600'
                      }`}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                      </svg>
                      Globe
                    </button>
                    <button
                      onClick={() => setMobileView('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        mobileView === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-600'
                      }`}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" clipRule="evenodd"/>
                      </svg>
                      List
                    </button>
                  </div>
                </div>

                <p className="text-slate-400 text-xs">Click any Biet to focus on its location</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Debug: {isLoadingMarkers ? 'Loading...' : biets.length > 0 ? `${biets.length} Biets found` : 'No Biets'} | {markers.length} markers
                    {isUsingSampleData && (
                      <span className="ml-2 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30 text-xs">
                        Using Sample Data
                      </span>
                    )}
                  </div>
                  {biets.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {biets.length} {biets.length === 1 ? 'Biet' : 'Biets'}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile-First Content Layout */}
              <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)]">
                {/* Globe Section - Full width on mobile when selected, 60% on desktop */}
                <div className={`${mobileView === 'globe' ? 'block' : 'hidden'} lg:block lg:w-[60%] h-[50vh] lg:h-full flex items-center justify-center relative`}>
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <RotatingEarth markers={markers} biets={biets} />
                  </div>
                </div>

                {/* Biet List Section - Full width on mobile when selected, 40% on desktop */}
                <div className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block w-full lg:w-[40%] bg-slate-800/95 backdrop-blur-sm lg:border-l lg:border-slate-700`}>
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 lg:p-3">
                      {isLoadingMarkers ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <h3 className="text-lg font-medium text-slate-300 mb-2">Loading Biets...</h3>
                          <p className="text-slate-500 text-sm max-w-md">
                            Fetching Biet locations from the blockchain
                          </p>
                        </div>
                      ) : markersError ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <h3 className="text-lg font-medium text-slate-300 mb-2">Error Loading Biets</h3>
                          <p className="text-slate-500 text-sm max-w-md">
                            {markersError}
                          </p>
                        </div>
                      ) : biets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <h3 className="text-lg font-medium text-slate-300 mb-2">No Biets Found</h3>
                          <p className="text-slate-500 text-sm max-w-md">
                            No Biets have been created yet. Check back soon or create a new Biet to get started.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {biets.map((biet: BietDetails) => (
                            <div
                              key={biet.tokenId.toString()}
                              onClick={() => handleBietClick(biet)}
                              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-blue-500/50 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10 group"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors truncate">
                                    {biet.name}
                                  </h3>
                                  <p className="text-slate-400 text-xs font-mono">
                                    #{biet.tokenId.toString()}
                                  </p>
                                </div>
                              </div>
                              <p className="text-slate-300 text-xs mb-2 line-clamp-1 leading-tight">
                                {biet.description || 'No description available'}
                              </p>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full font-medium border border-green-400/20">
                                  {biet.category || 'Uncategorized'}
                                </span>
                                <div className="flex items-center gap-2">
                                  {biet.location && (
                                    <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-600/50 px-2 py-1 rounded-full">
                                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                      </svg>
                                      {biet.location}
                                    </span>
                                  )}
                                  <a
                                    href={`https://sepolia.basescan.org/token/${PRODUCTIVE_UNIT_ADDRESS}?a=${biet.tokenId.toString()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-400/10 px-1.5 py-1 rounded-full hover:bg-blue-400/20 transition-colors"
                                    title="View on Base Sepolia Explorer"
                                    onClick={(e: any) => e.stopPropagation()}
                                  >
                                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Close Button - Fixed at bottom on mobile */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 z-40">
                <button
                  onClick={() => setShowGlobeHero(false)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close Globe View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<FaLeaf className="text-white" />}
              title={t('biets.agricultural')}
              description={t('landing.features.decentralizedDesc')}
              gradient="bg-green-500"
            />
            <FeatureCard
              icon={<FaHandsHelping className="text-white" />}
              title={t('biets.renewable')}
              description={t('landing.features.transparentDesc')}
              gradient="bg-teal-500"
            />
            <FeatureCard
              icon={<FaChartLine className="text-white" />}
              title={t('biets.sustainable')}
              description={t('landing.features.communityDesc')}
              gradient="bg-blue-500"
            />
          </div>

          {/* Main Biets List Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                All Biets
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                Browse Biets created on the ProductiveUnit contract and inspect their details.
              </p>
              {isUsingSampleData && (
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-full">
                  <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    Using Sample Data - No real Biets found on contract
                  </span>
                </div>
              )}
            </div>

            {isLoadingMarkers ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Biets...</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Fetching Biet data from the blockchain
                </p>
              </div>
            ) : markersError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Biets</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  {markersError}
                </p>
              </div>
            ) : biets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Biets have been created yet.</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Be the first to create a Biet and start your journey in sustainable agriculture.
                </p>
                <button 
                  onClick={() => router.push('/dashboard?tab=biets')}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Create First Biet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {biets.map((biet: BietDetails) => (
                  <div
                    key={biet.tokenId.toString()}
                    onClick={() => handleBietClick(biet)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-green-500 dark:hover:border-green-400 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-1">
                          {biet.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          #{biet.tokenId.toString()}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {biet.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {biet.category || 'Uncategorized'}
                      </span>
                      {biet.location && (
                        <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          {biet.location}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Created by {biet.creator.slice(0, 6)}...{biet.creator.slice(-4)}
                      </span>
                      <a
                        href={`https://sepolia.basescan.org/token/${PRODUCTIVE_UNIT_ADDRESS}?a=${biet.tokenId.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        title="View on Base Sepolia Explorer"
                        onClick={(e: any) => e.stopPropagation()}
                      >
                        View on Explorer →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('landing.cta.description')}
            </p>
            <button 
              onClick={() => router.push('/dashboard?tab=biets')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              {t('biets.join')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
