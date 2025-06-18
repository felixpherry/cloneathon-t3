import 'server-only';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
// import { z } from 'zod';

function getApiKey() {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPEN_ROUTER_API_KEY is not defined');
  }
  return apiKey;
}

export const getModelResponse = async (modelName: string, prompt: string) => {
  const openrouter = createOpenRouter({
    apiKey: getApiKey(),
  });

  const response = streamText({
    model: openrouter(modelName),
    prompt: prompt,
  });

  await response.consumeStream();
  return response.text;
};
