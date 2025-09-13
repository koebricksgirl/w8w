import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tools } from "./tools/tools";
import prisma from "@w8w/db";

function resolveTemplate(template: string, context: Record<string, any>): string {
  if (!template || typeof template !== 'string') {
    return template;
  }
  
  return template.replace(/\{\{\s*\$json\.body\.(\w+)\s*\}\}/g, (match, key) => {
    return context.$json?.body?.[key] || match;
  }).replace(/\{\{\s*\$node\.(\w+)\.(\w+)\s*\}\}/g, (match, nodeId, property) => {
    return context.$node?.[nodeId]?.[property] || match;
  });
}

export async function runGeminiNode(node: any, context: any) {
  try {
    let { prompt } = node.config;
    
    if (prompt && typeof prompt === 'string' && prompt.includes('{{')) {
      prompt = resolveTemplate(prompt, context);
      // console.log("Original prompt:", node.config.prompt);
      // console.log("Resolved prompt:", prompt);
    }

    // console.log("Final prompt to Gemini:", prompt)

    const creds = await prisma.credentials.findUnique({
      where: { id: node.credentialsId },
    });

    if (!creds) {
      throw new Error("Gemini credentials not found");
    }

    const data = typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;
    const { geminiApiKey } = data;

    if (!geminiApiKey) {
      throw new Error("Missing Gemini API Key");
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      model: "gemini-2.0-flash",
      temperature: 0.5
    });

    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system", 
        `You are a helpful AI assistant with access to various tools and functions.
        
        When responding to user requests:
        - If the task can be accomplished using available tools, use them appropriately
        - Always see if tools are needed or not before responsing , If no tools are needed, respond naturally with your knowledge
        - Always provide clear, helpful responses
        - Use tools when they can enhance your response or perform specific actions
        -  When asked to return JSON, return only valid JSON without extra text or backticks.

          You can generate content freely when tools aren't needed
        Choose the best approach based on what the user is asking for.`
      ],
      ["user", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const agent = await createToolCallingAgent({
      llm: model,
      tools,
      prompt: promptTemplate
    });

    const executor = new AgentExecutor({
      agent,
      tools,
      verbose: true, 
      maxIterations: 10 
    });

    const result = await executor.invoke({
      input: String(prompt)
    });

    if (!result) {
      throw new Error("No Result")
    }

    // console.log("Result: ", result)

   let rawText = result.output.trim();

    
   rawText = rawText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();


      try {
     const parsed = JSON.parse(rawText);
        if (parsed && typeof parsed === "object" && ("subject" in parsed || "body" in parsed)) {
        return {
          text: parsed, 
          intermediateSteps: result.intermediateSteps,
        };
      }
    } catch {
      console.warn("Gemini output not valid JSON, returning as text");
    }


    return {
      text: rawText,
      query: String(prompt),  
      intermediateSteps: result.intermediateSteps
    }

  } catch (error: any) {
    console.error("Failed to run gemini node error: ", error.message);
    throw error
  }
}