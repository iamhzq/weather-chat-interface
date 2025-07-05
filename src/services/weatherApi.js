//use your own API endpoint and headers
// This code is designed to stream responses from a weather agent API.
const API_ENDPOINT = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream';
const API_HEADERS = {
  'Accept': '*/*',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'x-mastra-dev-playground': 'true'
};
export async function* streamWeatherAgentResponse(userMessage, threadId) {
  try {
    const requestBody = {
      messages: [{ role: 'user', content: userMessage }],
      runId: 'weatherAgent',
      maxRetries: 2,
      maxSteps: 5,
      temperature: 0.5,
      topP: 1,
      runtimeContext: {},
      threadId: threadId,
      resourceId: 'weatherAgent'
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned an error: ${response.status} - ${errorText || 'Unknown error'}`);
    }

    if (!response.body) {
      throw new Error("Response body is null. Cannot stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let rawBuffer = '';
    let lastProcessedCleanedText = '';
    let fullAgentResponseForDisplay = '';
    const wordSegmentRegex = /0:"([^"]*)"/g;
    let match;


    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      rawBuffer += decoder.decode(value, { stream: true });

      wordSegmentRegex.lastIndex = 0;
      let currentFullCleanedText = '';
      while ((match = wordSegmentRegex.exec(rawBuffer)) !== null) {
        currentFullCleanedText += match[1];
      }

      if (currentFullCleanedText.length > lastProcessedCleanedText.length) {
        let newlyAddedContent = currentFullCleanedText.substring(lastProcessedCleanedText.length);
        if (newlyAddedContent.length > 0) {
          newlyAddedContent = newlyAddedContent.replace(/\\n/g, '\n');
          yield newlyAddedContent;
        }
        lastProcessedCleanedText = currentFullCleanedText;
      }
    }

    wordSegmentRegex.lastIndex = 0;
    let finalFullCleanedText = '';
    while ((match = wordSegmentRegex.exec(rawBuffer)) !== null) {
      finalFullCleanedText += match[1];
    }
    if (finalFullCleanedText.length > lastProcessedCleanedText.length) {
      let remaining = finalFullCleanedText.substring(lastProcessedCleanedText.length);
      if (remaining.length > 0) {
        remaining = remaining.replace(/\\n/g, '\n');
        yield remaining;
      }
    }

  } catch (error) {
    throw error;
  }
}
