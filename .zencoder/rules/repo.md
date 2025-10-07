---
description: Repository Information Overview
alwaysApply: true
---

# ContentGen Information

## Summary
ContentGen is a Progressive Web App (PWA) for generating blog articles and social media posts using AI. It features AI content generation, Google OAuth authentication, content history tracking, and offline capabilities.

## Structure
- **app/**: Next.js app directory with API routes and pages.
- **components/**: UI components including shadcn/ui components
- **lib/**: Core functionality (MongoDB, OpenAI, prompt engineering)
- **public/**: Static assets and PWA files
- **hooks/**: Custom React hooks
- **types/**: TypeScript type definitions

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.2.2
**Framework**: Next.js 13.5.1
**Build System**: Next.js build system
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- next (13.5.1): React framework
- react (18.2.0): UI library
- openai (5.19.1): OpenAI API client
- mongodb (5.9.2): MongoDB database driver
- next-auth (4.24.11): Authentication library
- next-pwa (5.6.0): PWA support
- framer-motion (12.23.12): Animation library
- tailwindcss (3.3.3): CSS framework
- shadcn/ui: Component library (via @radix-ui components)
- zod (3.23.8): Schema validation

**Development Dependencies**:
- typescript (5.2.2): Type checking
- eslint (8.49.0): Code linting
- @types/react (18.2.22): React type definitions
- @types/node (20.6.2): Node.js type definitions

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Configuration
**Required Variables**:
- NEXTAUTH_SECRET: JWT encryption key
- NEXTAUTH_URL: Application URL
- GOOGLE_CLIENT_ID: Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Google OAuth client secret
- MONGODB_URI: MongoDB connection string
- OPENAI_API_KEY: OpenAI API key

## PWA Features
**Manifest**: public/manifest.json
**Service Worker**: public/sw.js
**Configuration**: 
- Installable on mobile and desktop
- Offline capabilities via caching
- Standalone display mode
- Configured in next.config.js with next-pwa plugin

## Database
**Type**: MongoDB
**Connection**: MongoDB Atlas
**Collections**:
- users: User profiles
- accounts: OAuth accounts
- sessions: User sessions
- generated_content: Content history

## API Integration
**OpenAI**: Used for content generation with GPT models
**Google OAuth**: Authentication provider
**Configuration**: API routes in app/api directory

## Content Generation
**Types**:
- Blog Articles: Long-form SEO-optimized content
- Social Media Posts: Platform-agnostic social content
- Instagram Captions: Engaging captions with hashtags
- Twitter Threads: Multi-tweet structured content

**Prompt Engineering**:
- Smart prompt refinement system
- Tone customization (professional, casual, funny, inspirational)
- Automatic content type detection