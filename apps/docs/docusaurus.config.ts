import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const isDevelopment = process.env.NODE_ENV === 'development';

const config: Config = {
  title: 'BIET Network Documentation',
  tagline: 'Decentralized Impact Investment & Tokenization Platform',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: isDevelopment ? 'http://localhost:3001' : 'https://edcalderon.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: isDevelopment ? '/' : '/bietnetwork.org/',

  // GitHub pages deployment config.
  organizationName: 'edcalderon', // Usually your GitHub org/user name.
  projectName: 'bietnetwork.org', // Usually your repo name.

  // Ensure proper trailing slash handling
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeConfigs: {
      es: {
        label: 'Español',
        direction: 'ltr',
        htmlLang: 'es-ES',
        baseUrl: isDevelopment ? '/es/' : '/bietnetwork.org/es/',
      },
      en: {
        label: 'English',
        direction: 'ltr', 
        htmlLang: 'en-US',
        baseUrl: isDevelopment ? '/' : '/bietnetwork.org/',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/edcalderon/bietnetwork.org/tree/main/apps/docs/',
          includeCurrentVersion: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Latest',
              path: '/',
            },
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/edcalderon/bietnetwork.org/tree/main/apps/docs/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'BIET Network',
      logo: {
        alt: 'BIET Network Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: isDevelopment ? 'http://localhost:3000' : 'https://bietnetwork.org',
          label: 'Inicio',
          position: 'right',
        },
        {
          href: 'https://github.com/edcalderon/bietnetwork.org',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Introducción',
              to: '/docs/intro',
            },
            {
              label: 'Guía Rápida',
              to: '/docs/quickstart',
            },
            {
              label: 'Tutorial Básico',
              to: '/docs/tutorial-basics/create-a-document',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/edcalderon/bietnetwork.org',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/bietnetwork',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/bietnetwork',
            },
          ],
        },
        {
          title: 'Más',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Sitio Principal',
              href: isDevelopment ? 'http://localhost:3000' : 'https://bietnetwork.org',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BIET Network. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity', 'rust', 'typescript'],
    },
    mermaid: {
      theme: {
        light: 'base',
        dark: 'dark',
      },
      options: {
        fontFamily: 'monospace',
        fontSize: 16,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
      },
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'YOUR_APP_ID',
      
      // Public API key: it is safe to commit it
      apiKey: 'YOUR_SEARCH_API_KEY',
      
      // The index name (search engine) powered by Algolia
      indexName: 'bietnetwork',
      
      // Optional: see doc section below
      contextualSearch: true,
      
      // Optional: see doc section below
      searchParameters: {},
      
      // Optional: see doc section below
      searchPagePath: 'search',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
