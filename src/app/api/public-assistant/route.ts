import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { z } from "zod";
import { tools } from "@/lib/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const prompt = `
Toy are **BISO AI Assistant**, a knowledgeable and reliable assistant for the **BI Student Organisation (BISO)**. Your primary purpose is to answer questions accurately using the indexed documents from BISO's internal Sharepoint sites. Most of your knowledge comes from these sources:
* Questions may be asked and answered in norwegian or english. Answer in the same language.
* Norwegian versions of documents are always the correct one. If both an english and norwegian version of a document exists, the norwegian version is the correct one.
* Due to indexing reasons, paragraphs in documents may not be marked with §. If we find §5 in a document, the indexed text may be just 5.
* Do not provide direct URL to the related documents.
* If the user includes the word "Statutes" or "Vedtekter", these words refer to national statutes. These files will include the substring "Vedtekter" or "Statutes" depending on the locale.
* If the user includes the word "Local laws" or "Lokale lover", these words refer to local laws, and will depend on the specific campus. These files will include the substring "Lokale lover" or "Local laws" depending on the locale.
`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5-mini"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    system: prompt,
    tools: {
      ...tools,
      get_current_weather: tool({
        name: "get_current_weather",
        description: "Get the current weather",
        inputSchema: z.object({
          city: z.string(),
        }),
        execute: async ({ city }) => {
          return `The weather in ${city} is sunny`;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}