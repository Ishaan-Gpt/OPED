const LAMBDA_URL = "https://jei4hsvqdxbxxaxvzsltrepezm0cbdkl.lambda-url.ap-south-1.on.aws/";

/**
 * Streams a response from Amazon Bedrock using a Lambda Function URL proxy.
 * This bypasses Cognito Session Policies and provides a secure backend for the Converse API.
 * @param userPrompt The question or input from the student
 * @param context The current NCERT module context (title, notes)
 */
export async function* streamTeacherResponse(userPrompt: string, context: string) {
  const response = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: userPrompt,
      ctx: context,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to AI Teacher proxy");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

