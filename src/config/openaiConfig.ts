/**
 * OpenAI Configuration
 * 
 * This file contains the configuration for OpenAI API integration.
 * The API key is hard-coded here for simplicity and will be used
 * for all bankruptcy form analysis operations.
 */

// Replace this with your actual OpenAI API key
export const OPENAI_API_KEY = "sk-your-openai-api-key-here";

/**
 * Sets the OpenAI API key in the bankruptcy-form-analyzer service
 * This should be called during application initialization
 */
export const initializeOpenAI = async (): Promise<boolean> => {
  try {
    const response = await fetch('/bankruptcy-form-analyzer/api_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: OPENAI_API_KEY }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to initialize OpenAI API key:', error);
    return false;
  }
};
