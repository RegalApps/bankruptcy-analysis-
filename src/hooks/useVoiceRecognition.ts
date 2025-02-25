
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the WebkitSpeechRecognition interface
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

declare var window: IWindow;

export const useVoiceRecognition = (onTranscriptionUpdate: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  
  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        onTranscriptionUpdate(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Speech recognition failed. Please try again.",
        });
      };

      recognition.start();
      setIsRecording(true);
      toast({
        title: "Voice Input Active",
        description: "Start speaking to fill out the form...",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Voice recognition is not supported in your browser.",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Voice Input Stopped",
      description: "Voice input has been paused.",
    });
  };

  return {
    isRecording,
    toggleRecording
  };
};
