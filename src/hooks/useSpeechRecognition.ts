import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechRecognitionState } from '../types';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

const SpeechRecognitionCtor =
  typeof window !== 'undefined'
    ? (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    : null;

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: !!SpeechRecognitionCtor,
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const onResultCallback = useRef<((transcript: string) => void) | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: prev.transcript + final,
        interimTranscript: interim,
      }));

      if (final && onResultCallback.current) {
        onResultCallback.current(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setState(prev => ({
        ...prev,
        error: event.error,
        isListening: false,
      }));
    };

    recognition.onend = () => {
      setState(prev => {
        if (prev.isListening) {
          try { recognition.start(); } catch { /* already running */ }
        }
        return prev;
      });
    };

    recognitionRef.current = recognition;

    return () => { recognition.stop(); };
  }, []);

  const startListening = useCallback((onResult?: (transcript: string) => void) => {
    if (!recognitionRef.current) return;
    onResultCallback.current = onResult || null;

    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));

    try { recognitionRef.current.start(); } catch { /* already running */ }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setState(prev => ({ ...prev, isListening: false }));
    recognitionRef.current.stop();
    onResultCallback.current = null;
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }));
  }, []);

  return { ...state, startListening, stopListening, resetTranscript };
}
