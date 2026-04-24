import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    console.log("🔥 API HIT");

    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Groq API failed" }),
      { status: 500 }
    );
  }
}