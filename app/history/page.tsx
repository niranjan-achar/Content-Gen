'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/dashboard-layout';
import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Download, Calendar, Type, Clock } from 'lucide-react';
import { GeneratedContent } from '@/types';
import { toast } from 'sonner';

export default function History() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session) {
      fetchHistory();
    }
  }, [status, session, router]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load content history');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const handleDownload = (content: string, id: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content History</h1>
          <p className="text-gray-600">
            View and download your previously generated content
          </p>
        </motion.div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Type className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600 mb-6">
              Start generating content to see your history here
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Create Content
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg line-clamp-1">
                          {item.originalPrompt}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                          {item.metadata?.wordCount && (
                            <div className="flex items-center gap-1">
                              <Type className="h-4 w-4" />
                              {item.metadata.wordCount} words
                            </div>
                          )}
                          {item.metadata?.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {item.metadata.readingTime} min read
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {item.contentType}
                        </Badge>
                        <Badge variant="outline">
                          {item.tone}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans line-clamp-6">
                        {item.generatedText}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(item.generatedText)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(item.generatedText, item.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}