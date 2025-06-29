'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle, Sparkles, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';
import CharacterGrid from '@/components/CharacterGrid';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,rgb(30,41,59)_1px,transparent_0)] bg-[length:24px_24px]" />
      {/* Navigation */}
      <motion.nav 
        className="relative z-50 border-b border-slate-800/70 bg-slate-900/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-100">learnit</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/chat-threads" className="text-slate-300 hover:text-white transition-colors">My Conversations</Link>
              <button className="text-slate-300 hover:text-white transition-colors">About</button>
              <button className="text-slate-300 hover:text-white transition-colors">Features</button>
              <Link href="/chat-threads" className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600 transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-900/60 rounded-full text-indigo-300 text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI Replicas</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Learn from
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              History&apos;s Greatest
            </span>
            <span className="block">Minds</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Engage in authentic conversations with AI replicas of Nobel laureates, 
            revolutionary scientists, and visionary thinkers. Experience personalized 
            learning through direct dialogue with history&apos;s most brilliant minds.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/chat-threads"
              className="group flex items-center space-x-2 px-8 py-4 bg-indigo-700 text-white rounded-xl hover:bg-indigo-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Chatting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={() => setSelectedCharacter('einstein')}
              className="flex items-center space-x-2 px-8 py-4 border border-slate-700 text-slate-200 rounded-xl hover:bg-slate-800 transition-all duration-300 font-semibold"
            >
              <Brain className="w-5 h-5" />
              <span>Quick Chat</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10+</div>
              <div className="text-slate-400">Historical Figures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">8</div>
              <div className="text-slate-400">Nobel Prize Winners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <div className="text-slate-400">Learning Possibilities</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Character Selection */}
        <motion.section 
          className="max-w-7xl mx-auto px-6 pb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Mentor
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Select from our collection of historically accurate AI replicas, 
              each trained on authentic works, speeches, and documented thoughts.
            </p>
          </div>
          
          <CharacterGrid onCharacterSelect={setSelectedCharacter} />
        </motion.section>

        {/* Chat Interface */}
        <AnimatePresence mode="wait">
          {selectedCharacter && (
            <ChatInterface
              character={selectedCharacter}
              onClose={() => setSelectedCharacter(null)}
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          className="border-t border-slate-800 bg-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-md flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white">Genius Minds</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span>Powered by</span>
                <span className="font-semibold text-indigo-400">Sensay AI</span>
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500">
              <p>&copy; 2025 learnit. Educational conversations with AI historical figures.</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
