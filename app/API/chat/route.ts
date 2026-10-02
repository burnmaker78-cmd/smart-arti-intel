import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await streamText({
    model: openai('gpt-4o'), 
    messages,
  });

  return response.toDataStreamResponse();
}
