'use server';

/**
 * @fileOverview An AI agent to optimize email delivery based on content and recipient engagement.
 *
 * - optimizeEmailDelivery - A function that handles the email delivery optimization process.
 * - OptimizeEmailDeliveryInput - The input type for the optimizeEmailDelivery function.
 * - OptimizeEmailDeliveryOutput - The return type for the optimizeEmailDelivery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeEmailDeliveryInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to be optimized.'),
  recipientEngagementData: z
    .string()
    .describe(
      'Data on recipient engagement, including open rates, click-through rates, and bounce rates.'
    ),
});
export type OptimizeEmailDeliveryInput = z.infer<
  typeof OptimizeEmailDeliveryInputSchema
>;

const OptimizeEmailDeliveryOutputSchema = z.object({
  optimizedEmailContent: z
    .string()
    .describe('The optimized content of the email.'),
  deliveryRecommendations: z
    .string()
    .describe(
      'Recommendations for improving email delivery, such as adjusting sending times or segmenting recipient lists.'
    ),
});
export type OptimizeEmailDeliveryOutput = z.infer<
  typeof OptimizeEmailDeliveryOutputSchema
>;

export async function optimizeEmailDelivery(
  input: OptimizeEmailDeliveryInput
): Promise<OptimizeEmailDeliveryOutput> {
  return optimizeEmailDeliveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeEmailDeliveryPrompt',
  input: {schema: OptimizeEmailDeliveryInputSchema},
  output: {schema: OptimizeEmailDeliveryOutputSchema},
  prompt: `You are an AI email delivery optimization expert.

Analyze the email content and recipient engagement data to provide optimized content and delivery recommendations.

Email Content: {{{emailContent}}}
Recipient Engagement Data: {{{recipientEngagementData}}}

Optimize the email to increase recipient engagement and ensure effective delivery, and include concrete suggestions for improving email deliverability. Consider:
* Subject line improvements
* Content adjustments
* Sending time optimization
* Recipient list segmentation
* Authentication and sender reputation improvements
* Spam filtering triggers

Return both the optimized content and specific delivery recommendations.
`,
});

const optimizeEmailDeliveryFlow = ai.defineFlow(
  {
    name: 'optimizeEmailDeliveryFlow',
    inputSchema: OptimizeEmailDeliveryInputSchema,
    outputSchema: OptimizeEmailDeliveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
