// 


import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import {
  JSONSchema7,
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  try {
    const {
      messages,
      system,
      tools,
    }: {
      messages: UIMessage[];
      system?: string;
      tools?: Record<string, { description?: string; parameters: JSONSchema7 }>;
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), { status: 400 });
    }

    const result = streamText({
      model: openai.responses("gpt-5-nano"),
      messages: await convertToModelMessages(messages),
      system,
      tools: {
        ...frontendTools(tools ?? {}),
      },
      providerOptions: {
        openai: {
          reasoningEffort: "low",
          reasoningSummary: "auto",
        },
      },
    });

    return result.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({
        type: "error",
        code: "internal_error",
        message: "Internal server error",
        param: null,
      }),
      { status: 500 }
    );
  }
}