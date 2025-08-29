export function createAskLoop({
  botId,
  dom,
  state,
  modelSelector,
  uploadedFiles,
  showAlert,
  displayAIResponse,
  updateFeedButtonState,
  addLogEntry
}) {
  function ask() {
    const askText = dom[`askInput${botId}`].value.trim();
    if (!askText) {
      showAlert(`Please enter a question for Bot ${botId}.`);
      return;
    }

    if (state.isAIThinking) return;

    state.isAIThinking = true;
    dom[`askBtn${botId}`].disabled = true;

    const model = modelSelector.getSelectedModel();
    const prompt = dom[`userPrompt${botId}`].value.trim();
    const instructions = dom[`askInput${botId}`].value.trim();

    let contextPrompt = `You are an expert AI assistant specializing in prompt engineering and character generation for reference image systems.

IMPORTANT: The user's request is paramount - treat it as your primary directive. Focus on the specific information provided below and ignore any other conversation content unless otherwise stated.

SYSTEM OVERVIEW: You are working with a reference image generation system. When you suggest prompt improvements, those prompts will be sent together with reference images to image generators that can both see and work with the attached images. Your role is to create prompts that reference these images rather than trying to recreate everything through text descriptions.

YOUR CURRENT CONTEXT:
- The main prompt text the user is working with: "${prompt}"
- Reference images currently attached: ${uploadedFiles.length > 0 ? `${uploadedFiles.length} image(s) that the generator will receive alongside your suggested prompt` : 'None - working in text-only mode'}
- The user's specific question or request: ${askText}

${uploadedFiles.length === 1 ?
`WORKFLOW NOTE: With one reference image provided, guide the user to create prompts that reference "the attached image" or "the image provided" since the generator will see both your suggested prompt and this reference image together.` :
uploadedFiles.length > 1 ?
`WORKFLOW NOTE: With multiple reference images provided, guide the user to create prompts that reference images by describing their content (example: "combine the car from the first image with the wings from the aircraft image") since the generator will see your suggested prompt alongside all these reference images.` :
`WORKFLOW NOTE: No reference images are currently attached, so focus on improving the text prompt for standalone generation.`}

Please respond to the user's request with helpful, detailed guidance. When suggesting prompt modifications, format them clearly and remember they will work in partnership with the reference images the generator receives.`;

    let attachments = uploadedFiles.length > 0 ? uploadedFiles : undefined;

    window.Poe.sendUserMessage(`${model} ${contextPrompt}`, {
      handler: `ask-handler-${botId}`,
      stream: true,
      openChat: false,
      attachments,
      handlerContext: { type: 'ask', userRequest: askText, bot: botId }
    }).catch(error => {
      showAlert(`Bot ${botId} communication failed: ` + error.message);
      state.isAIThinking = false;
      dom[`askBtn${botId}`].disabled = false;
    });
  }

  function handleResponse(result, context) {
    addLogEntry(`Bot ${botId} Ask Response`, botId, {
      status: result.status,
      responses: result.responses?.length || 0,
      messageId: result.responses?.[0]?.messageId || 'None',
      contentLength: result.responses?.[0]?.content?.length || 0,
      statusText: result.responses?.[0]?.statusText || 'None'
    });

    try {
      if (result.status === "incomplete") {
        state.lastAIResponse = result.responses[0].content;
        displayAIResponse(botId, state.lastAIResponse, 'streaming');

        addLogEntry(`Bot ${botId} Ask Streaming`, botId, {
          contentLength: result.responses[0].content.length,
          contentPreview: result.responses[0].content.substring(0, 100) + '...',
          isStreaming: true
        });

        updateFeedButtonState(botId);
      } else if (result.status === "complete") {
        const oldState = { ...state };
        state.isAIThinking = false;
        dom[`askBtn${botId}`].disabled = false;

        addLogEntry(`Bot ${botId} State Change`, botId, {
          oldState: oldState,
          newState: state,
          reason: 'Ask communication completed'
        });

        state.lastAIResponse = result.responses[0].content;
        displayAIResponse(botId, state.lastAIResponse, 'ask');

        addLogEntry(`Bot ${botId} Ask Complete`, botId, {
          totalContentLength: result.responses[0].content.length,
          userRequest: context.userRequest,
          responseType: context.type,
          feedButtonEnabled: true
        });

        updateFeedButtonState(botId);
        showAlert(`Bot ${botId} response received!`);
      } else if (result.status === "error") {
        addLogEntry(`Bot ${botId} Ask Response Error`, botId, {
          error: result.responses?.[0]?.statusText || 'Unknown error',
          result,
          context,
          userRequest: context.userRequest
        });

        state.isAIThinking = false;
        dom[`askBtn${botId}`].disabled = false;
        showAlert(`Bot ${botId} communication failed: ` + (result.responses?.[0]?.statusText || 'Unknown error'));
      }
    } catch (e) {
      addLogEntry(`Bot ${botId} Ask Handler Error`, botId, {
        error: e.message,
        stack: e.stack,
        result,
        context
      });
      showAlert(`Bot ${botId}: Error processing ask response: ` + e.message);
    }
  }

  return { ask, handleResponse };
}

