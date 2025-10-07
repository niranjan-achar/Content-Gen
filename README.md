# ContentGen - AI Content Generator PWA

A comprehensive Progressive Web App for generating blog articles and social media posts using AI, built with Next.js and OpenAI.

## 🚀 Features

- **AI Content Generation**: Generate blogs, social media posts, captions, and tweets
- **Smart Prompt Engineering**: Automatically refines user inputs for better results
- **Google OAuth Authentication**: Secure login with Google accounts
- **Content History**: Save and access previously generated content
- **PWA Support**: Installable on mobile and desktop devices
- **Offline Capabilities**: Cache last session for offline access
- **Copy & Download**: Easy content sharing and storage
- **Responsive Design**: Works perfectly on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ with React
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with MongoDB Adapter
- **AI**: OpenAI API (GPT-3.5/GPT-4)
- **PWA**: next-pwa plugin
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 🏗 Architecture

```
app/
├── api/
│   ├── auth/[...nextauth]/   # Authentication routes
│   ├── generate/             # Content generation API
│   └── history/              # Content history API
├── dashboard/                # Main dashboard
├── history/                  # Content history page
├── profile/                  # User profile page
└── layout.tsx               # Root layout

components/
├── ui/                      # shadcn/ui components
├── dashboard-layout.tsx     # Dashboard wrapper
├── content-generator.tsx    # Main generator component
├── landing-page.tsx         # Public landing page
└── providers.tsx           # Context providers

lib/
├── mongodb.ts              # Database connection
├── openai.ts              # OpenAI client
└── prompt-engineering.ts  # Smart prompt refinement
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contentgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   - `NEXTAUTH_SECRET`: Random string for JWT encryption
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `OPENAI_API_KEY`: OpenAI API key

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

5. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas cluster
   - Create a database user
   - Get the connection string
   - Replace `<password>` with your user password

6. **Run development server**
   ```bash
   npm run dev
   ```

### Database Schema

The app automatically creates collections:
- `users`: User profiles from Google OAuth
- `accounts`: OAuth account linking
- `sessions`: User sessions
- `generated_content`: Generated content history

## 📱 PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Cache**: Service worker caches essential pages
- **Push Notifications**: Ready for future implementation
- **App-like Experience**: Standalone display mode

## 🎨 Content Types

1. **Blog Articles**: Long-form SEO-optimized content
2. **Social Media Posts**: Platform-agnostic social content
3. **Instagram Captions**: Engaging captions with hashtags
4. **Twitter Threads**: Multi-tweet structured content

## 🧠 Smart Prompt Engineering

The system automatically refines user inputs:

**User Input**: "Blog on productivity hacks for students"

**Auto-refined**: "Generate a comprehensive, SEO-optimized blog article about 'productivity hacks for students'. Structure it with an engaging title and introduction, 3-5 main sections with actionable insights, a compelling conclusion with call-to-action. Target length: 800-1200 words. Include relevant keywords naturally. Write in a professional tone."

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel Dashboard**
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

```env
NEXTAUTH_SECRET=production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contentgen
OPENAI_API_KEY=your-openai-api-key
```

## 🔧 Customization

### Adding New Content Types

1. Update `lib/prompt-engineering.ts`
2. Add new type to `components/content-generator.tsx`
3. Update type definitions in `types/index.ts`

### Styling Customization

- Colors: Edit `tailwind.config.ts`
- Components: Modify `components/ui/` files
- Layout: Update `components/dashboard-layout.tsx`

## 📊 Usage Analytics

To add analytics, integrate with:
- Google Analytics 4
- Vercel Analytics
- PostHog
- Mixpanel

## 🔐 Security Features

- **JWT Sessions**: Secure session management
- **CORS Protection**: API route protection
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: Prevent API abuse (implement with Upstash Redis)

## 🧪 Testing

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 📈 Performance Optimization

- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Service worker + browser caching
- **Bundle Analysis**: `npm run analyze`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create GitHub issues
- Check documentation
- Review example prompts

---

**Built with ❤️ using Next.js, OpenAI, and modern web technologies**