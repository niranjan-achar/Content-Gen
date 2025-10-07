'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ContentGen</h1>
          </div>
          <Button 
            onClick={() => signIn('google')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Generate Amazing Content with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI Power
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create blog articles, social media posts, and captions in seconds. 
            Our AI understands your goals and crafts content that engages your audience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => signIn('google')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl"
            >
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-2"
            >
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-8 w-8 text-blue-600 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-600 mb-6">Trusted by content creators worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose ContentGen?</h3>
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold">ContentGen</span>
          </div>
          <p className="text-gray-600">
            © 2025 ContentGen. All rights reserved. Built with Next.js and AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate content in seconds, not hours'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Advanced AI that understands context'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected'
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'PWA app works on all devices'
  }
];

const benefits = [
  {
    title: 'Smart Prompt Engineering',
    description: 'Our AI automatically refines your input to generate better, more targeted content.'
  },
  {
    title: 'Multiple Content Types',
    description: 'Create blog posts, social media content, captions, and Twitter threads with ease.'
  },
  {
    title: 'Content History',
    description: 'Access all your previously generated content anytime with our cloud storage.'
  },
  {
    title: 'Progressive Web App',
    description: 'Install on your device and use offline. Works like a native app on any platform.'
  }
];