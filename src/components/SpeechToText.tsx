'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  onInterimResult?: (text: string) => void;
  className?: string;
}

export default function SpeechToText({ onTranscript, onInterimResult, className }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setInterimTranscript(interimTranscript);
        onInterimResult?.(interimTranscript);

        if (finalTranscript) {
          onTranscript(finalTranscript);
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onInterimResult]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className={`relative ${className}`}>
        <button
          disabled
          className="p-2 text-slate-400 cursor-not-allowed"
          title="Speech recognition not supported in this browser"
        >
          <MicOff className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title={isListening ? 'Stop recording' : 'Start voice input'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-5 h-5" />
          </motion.div>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap z-10"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <span>Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interim Transcript Display */}
      <AnimatePresence>
        {interimTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm max-w-xs truncate z-10"
          >
            <div className="flex items-center space-x-2">
              <Volume2 className="w-3 h-3" />
              <span className="italic">{interimTranscript}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 