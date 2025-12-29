'use server';

/**
 * @fileOverview An AI agent to generate a creative and unique API key.
 * 
 * - generateApiKey - A function that handles the API key generation process.
 * - GenerateApiKeyInput - The input type for the generateApiKey function.
 * - GenerateApiKeyOutput - The return type for the generateApiKey function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateApiKeyInputSchema = z.object({
    name: z.string().describe('The user-provided name for the API key, used as a hint for the creative name.'),
});
export type GenerateApiKeyInput = z.infer<typeof GenerateApiKeyInputSchema>;

const GenerateApiKeyOutputSchema = z.object({
    key: z.string().describe('The fully generated unique API key.'),
});
export type GenerateApiKeyOutput = z.infer<typeof GenerateApiKeyOutputSchema>;


export async function generateApiKey(input: GenerateApiKeyInput): Promise<GenerateApiKeyOutput> {
    return generateApiKeyFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateApiKeyPrompt',
    input: { schema: z.object({ name: z.string() }) },
    output: { schema: z.object({ creativeName: z.string().describe("A creative, url-safe, three-word name separated by hyphens (e.g., 'sunny-river-dream').") }) },
    prompt: `Generate a creative, url-safe, three-word name for an API key. The user's desired name is '{{name}}', use that as inspiration. The output should be formatted as three words separated by hyphens. For example: 'ancient-forest-key' or 'digital-ocean-wave'.`,
});

const generateApiKeyFlow = ai.defineFlow(
    {
        name: 'generateApiKeyFlow',
        inputSchema: GenerateApiKeyInputSchema,
        outputSchema: GenerateApiKeyOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        const creativePart = output?.creativeName || 'default-key-name';
        const randomPart = Math.random().toString(36).substring(2, 10);
        const finalKey = `mingo_${creativePart}-${randomPart}`;
        return { key: finalKey };
    }
);
