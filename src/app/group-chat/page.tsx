'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

function GroupChatRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadId = searchParams?.get('threadId');

  useEffect(() => {
    // Redirect to the unified chat system
    if (threadId) {
      router.replace(`/chat-threads?id=${threadId}`);
    } else {
      router.replace('/chat-threads');
    }
  }, [router, threadId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-lg max-w-md mx-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Redirecting to Unified Chat
        </h1>
        
                 <p className="text-slate-600 mb-6 leading-relaxed">
           Group chats are now part of our unified conversation system. You&apos;ll have access to both individual and group conversations in one place.
         </p>
        
        <div className="flex items-center justify-center space-x-2 text-indigo-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"
          />
          <span className="font-medium">Redirecting...</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
}

export default function GroupChatRedirect() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
      <div className="text-slate-600">Loading...</div>
    </div>}>
      <GroupChatRedirectContent />
    </Suspense>
  );
} 