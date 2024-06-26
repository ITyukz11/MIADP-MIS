import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const input: { threadId: string | null; message: string } = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: input.message,
    });

    return AssistantResponse(
      { threadId, messageId: createdMessage.id },
      async ({ forwardStream, sendDataMessage }) => {
        try {
          // Run the assistant on the thread
          const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id:
              process.env.OPENAI_ASSISTANT_ID ??
              (() => {
                throw new Error('OPENAI_ASSISTANT_ID is not set');
              })(),
          });

          // forward run status would stream message deltas
          let runResult = await forwardStream(runStream);

          // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
          while (
            runResult?.status === 'requires_action' &&
            runResult.required_action?.type === 'submit_tool_outputs'
          ) {
            const tool_outputs = await Promise.all(runResult.required_action.submit_tool_outputs.tool_calls.map(
              async (toolCall: any) => {
                const parameters = JSON.parse(toolCall.function.arguments);

                switch (toolCall.function.name) {
                  case 'get_calendar_of_activities':
                    const data = await fetch('https://miadp-mis.vercel.app/api/auth/calendar-of-activity').then((res) => res.json());
                    return {
                      tool_call_id: toolCall.id,
                      output: JSON.stringify(data),
                    };
                  
                  case 'get_user_data':
                    const userData = await fetch('https://miadp-mis.vercel.app/api/auth/user').then((res) => res.json());
                    return {
                      tool_call_id: toolCall.id,
                      output: JSON.stringify(userData),
                    };

                  default:
                    throw new Error(`Unknown tool call function: ${toolCall.function.name}`);
                }
              },
            ));

            runResult = await forwardStream(
              openai.beta.threads.runs.submitToolOutputsStream(threadId, runResult.id, { tool_outputs }),
            );
          }
        } catch (error) {
          console.error('Error during assistant run:', error);
          throw new Error('Assistant run failed');
        }
      },
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
