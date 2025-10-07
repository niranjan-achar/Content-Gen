'use client';

import { Sparkles } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading ContentGen...</p>
      </div>
    </div>
  );
}