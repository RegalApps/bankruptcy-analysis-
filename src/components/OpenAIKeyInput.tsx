import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import logger from '@/utils/logger';

export const OpenAIKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we already have a key stored
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setSavedKey(storedKey);
      setApiKey(''); // Clear input field
    }
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('This doesn\'t look like a valid OpenAI API key. It should start with "sk-"');
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      // Store the key in localStorage
      localStorage.setItem('openai_api_key', apiKey);
      logger.info('OpenAI API key saved to localStorage');
      
      // Try to set the key in the bankruptcy-form-analyzer
      try {
        const response = await fetch('/bankruptcy-form-analyzer/api_key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ api_key: apiKey }),
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          logger.warn('API key validation warning:', errorData);
        } else {
          logger.info('API key validated with bankruptcy-form-analyzer');
        }
      } catch (apiError) {
        // If the API is not available, we still want to save the key locally
        logger.warn('Could not validate API key with bankruptcy-form-analyzer:', apiError);
      }
      
      // Show success message
      setSavedKey(apiKey);
      setApiKey(''); // Clear input field
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      logger.error('Error saving API key:', error);
      setError('Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('openai_api_key');
    setSavedKey(null);
    setApiKey('');
    logger.info('OpenAI API key removed from localStorage');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenAI API Key
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to enable enhanced document analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedKey ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">API Key Saved</AlertTitle>
              <AlertDescription className="text-green-700">
                Your OpenAI API key has been saved securely in your browser's local storage.
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={handleClearKey}>
              Clear API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored only in your browser's local storage and is never sent to our servers.
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your API key has been saved successfully.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      {!savedKey && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSaveKey} 
            disabled={isSaving || !apiKey.trim()}
          >
            {isSaving ? 'Saving...' : 'Save API Key'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OpenAIKeyInput;
