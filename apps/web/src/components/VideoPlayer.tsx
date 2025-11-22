'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, X, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface VideoPlayerProps {
  className?: string;
  onClose?: () => void;
}

export default function VideoPlayer({ className = '', onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState<'spanish' | 'english'>('english');

  // Map app language to video language
  useEffect(() => {
    console.log('App language changed to:', language); // Debug log
    if (language === 'es') {
      console.log('Setting video language to Spanish'); // Debug log
      setCurrentLanguage('spanish');
    } else {
      console.log('Setting video language to English'); // Debug log
      setCurrentLanguage('english');
    }
  }, [language]);

  // If onClose is provided, this is being used as a modal, so start playing immediately
  useEffect(() => {
    if (onClose) {
      setIsPlaying(true);
    }
  }, [onClose]);

  const videoUrls = {
    spanish: 'https://stream.mux.com/ZZx8rj8Ra44zVX56BOH9UZAaMbTKSAi7Fs5CjvoruOw.m3u8',
    english: 'https://stream.mux.com/BCrTrQrGj02JdbLPt102daC7z015DIEmuDP5yg4QpUu6OA.m3u8'
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const video = videoRef.current;
      
      const loadVideo = async () => {
        try {
          console.log('Loading video for language:', currentLanguage); // Debug log
          console.log('Video URL:', videoUrls[currentLanguage as keyof typeof videoUrls]); // Debug log
          
          // Dynamically import hls.js to avoid SSR issues
          const Hls = (await import('hls.js')).default;
          
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrls[currentLanguage as keyof typeof videoUrls]);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setIsLoaded(true);
              video.play().catch(console.error);
              
              // Enable captions by default if available
              const textTracks = video.textTracks;
              for (let i = 0; i < textTracks.length; i++) {
                if (textTracks[i].kind === 'subtitles' || textTracks[i].kind === 'captions') {
                  textTracks[i].mode = 'showing';
                  break;
                }
              }
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = videoUrls[currentLanguage as keyof typeof videoUrls];
            video.addEventListener('loadedmetadata', () => {
              setIsLoaded(true);
              video.play().catch(console.error);
              
              // Enable captions by default if available
              const textTracks = video.textTracks;
              for (let i = 0; i < textTracks.length; i++) {
                if (textTracks[i].kind === 'subtitles' || textTracks[i].kind === 'captions') {
                  textTracks[i].mode = 'showing';
                  break;
                }
              }
            });
          }
        } catch (error) {
          console.error('Error loading video:', error);
        }
      };

      loadVideo();
    }
  }, [isPlaying, currentLanguage]);

  // If onClose is provided, this is being used as a modal, so always show the modal
  // If no onClose, this is an overlay, so show play button when not playing
  if (!onClose && !isPlaying) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        {/* Play icon overlay - more visible but still non-intrusive */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={handlePlayClick}
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-lg border border-white/20">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
      </div>
    );
  }

  // Show modal (either when playing or when used as a modal component)
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-2xl animate-fadeIn"
      onClick={handleClose}
    >
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/2 via-blue-600/2 to-emerald-600/2 animate-gradientShift" />
      
      {/* Full-screen video container */}
      <div 
        className="relative w-full h-full max-h-screen flex items-center justify-center p-4 md:p-8 animate-scaleIn"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Prevent closing when clicking on video container
      >
        {/* Video player with fullscreen styling */}
        <div className="relative w-full max-w-7xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="aspect-video bg-black">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                <p className="absolute mt-24 text-white/80 text-sm font-medium animate-pulse">Loading video...</p>
              </div>
            )}
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full"
              style={{ display: isLoaded ? 'block' : 'none' }}
              crossOrigin="anonymous"
            />
          </div>
          
          {/* Enhanced close button with better positioning */}
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 w-12 h-12 bg-red-500/95 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 shadow-xl border-2 border-white/30 hover:scale-110 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Auto-detected language indicator */}
          <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-lg rounded-full px-4 py-2 flex items-center gap-2 border border-white/20 shadow-lg">
            <Volume2 className="w-4 h-4 text-white/90" />
            <span className="text-white text-sm font-semibold">
              {currentLanguage === 'spanish' ? 'Español' : 'English'}
            </span>
          </div>
        </div>
        
        {/* Enhanced modal title with better typography */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center animate-slideUp">
          <h3 className="text-white text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            BietNetwork Video Presentation
          </h3>
          <p className="text-white/70 text-base">Video language automatically detected ({currentLanguage === 'spanish' ? 'Spanish' : 'English'})</p>
        </div>
      </div>
      
      {/* Click outside to close with subtle animation */}
      <div 
        className="absolute inset-0 -z-10 animate-fadeIn" 
        onClick={handleClose}
      />
    </div>
  );
}
