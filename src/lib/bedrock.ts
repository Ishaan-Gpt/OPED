import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const IDENTITY_POOL_ID = "ap-south-1:b32114b4-0422-4c8a-b39f-21a2da3a56b1";
const REGION = "ap-south-1";

// Create the credentials provider
const credentials = fromCognitoIdentityPool({
  identityPoolId: IDENTITY_POOL_ID,
  clientConfig: { region: REGION },
});

// Initialize the Bedrock client
export const bedrockClient = new BedrockRuntimeClient({
  region: REGION, // Use Mumbai region directly
  credentials,
});

/**
 * Streams a response from Amazon Bedrock using Claude 3.5 Sonnet.
 * @param userPrompt The question or input from the student
 * @param context The current NCERT module context (title, notes)
 */
export async function* streamTeacherResponse(userPrompt: string, context: string) {
  const systemPrompt = `You are Dr. Rao, an enthusiastic and expert NCERT teacher for Indian school students. 
You are currently teaching a class using a digital blackboard.
Context of the current lesson:
${context}

Keep your responses extremely concise (1-2 sentences), encouraging, and easy to understand. Do not use markdown formatting like **bold** because your text will be read aloud and displayed in a small caption box.`;

  const command = new ConverseStreamCommand({
    modelId: "amazon.nova-pro-v1:0", // Amazon Nova has no company website requirements!
    system: [{ text: systemPrompt }],
    messages: [
      {
        role: "user",
        content: [{ text: userPrompt }]
      }
    ],
    inferenceConfig: {
      maxTokens: 512, // Always explicitly set maxTokens to avoid throttling exceptions
      temperature: 0.7,
    },
  });

  const response = await bedrockClient.send(command);

  if (response.stream) {
    for await (const chunk of response.stream) {
      if (chunk.contentBlockDelta?.delta?.text) {
        yield chunk.contentBlockDelta.delta.text;
      }
    }
  }
}
