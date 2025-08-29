export function createIterationLoop({
  botId,
  dom,
  state,
  modelSelector,
  uploadedFiles,
  generatedImages,
  showAlert,
  displayAIResponse,
  displayAnalysisResult,
  updateFeedButtonState
}) {
  function iterate() {
    const prompt = dom[`userPrompt${botId}`].value.trim();
    if (!prompt) {
      showAlert(`Please enter a prompt for Bot ${botId} first.`);
      return;
    }

    const botImages = generatedImages.filter(img => img.bot === botId);
    if (botImages.length === 0) {
      showAlert(`Please generate an image with Bot ${botId} first before iterating.`);
      return;
    }

    if (state.isAIThinking) return;

    state.isAIThinking = true;
    dom[`iterateBtn${botId}`].disabled = true;

    const latestImage = botImages[botImages.length - 1];
    const model = modelSelector.getSelectedModel();
    const targetScore = dom.targetScore.value;
    const additional = dom[`askInput${botId}`].value.trim();

    let analysisPrompt = `You are an expert image analysis AI specializing in character generation and prompt optimization for reference image systems.

IMPORTANT: Focus on the specific information provided below and ignore any other conversation content unless otherwise stated.

SYSTEM OVERVIEW: You are analyzing images from a reference image generation system. The improved prompts you suggest will be sent together with reference images to image generators that can both see and work with the attached images. Your role is to create improved prompts that reference these images rather than trying to recreate everything through text descriptions.

YOUR ANALYSIS TASK:
- The main prompt text being evaluated: "${prompt}"
- Target score goal: ${targetScore}/100 (for reference only)
- Reference images: ${uploadedFiles.length > 0 ? `${uploadedFiles.length} reference image(s) that guided the generation` : 'None used'}
- Generated image to analyze: The final image attachment (compare this against the main prompt and reference images)${additional ? `
- Additional focus instructions: ${additional}` : ''}

EVALUATION APPROACH:
Your primary question is simple: Does the generated image successfully fulfill what the main prompt is asking for? The main prompt is paramount - it defines success. Consider character consistency (including facial accuracy, build, pose, clothing, style) and how well the reference images were utilized to achieve the main prompt's vision. Remember that reference images are tools to help achieve the main prompt, not ends in themselves.

${uploadedFiles.length === 1 ?
`WORKFLOW NOTE: With one reference image provided, evaluate how well it was used to achieve the main prompt's goal. Your improved prompt should reference "the attached image" since the generator will see both your suggested prompt and this reference image together.` :
uploadedFiles.length > 1 ?
`WORKFLOW NOTE: With multiple reference images provided, evaluate how well they were combined to achieve the main prompt's goal. Your improved prompt should reference images by describing their content (example: "combine the car from the first image with the wings from the aircraft image") since the generator will see your suggested prompt alongside all these reference images.` :
`WORKFLOW NOTE: No reference images were used, so focus purely on how well the generated image fulfills the main prompt for standalone generation.`}

Please provide your analysis in this EXACT format:

SCORE: [number from 0-100]

ANALYSIS: [Detailed analysis of how well the generated image fulfills the main prompt. Focus on what works well and what needs improvement, considering character consistency, facial accuracy, and overall prompt adherence.]

IMPROVED_PROMPT: [A refined version of the original prompt that addresses the identified issues and will work in partnership with the reference images the generator receives. Make it clear and actionable for immediate use.]`;

    const allAttachments = [...uploadedFiles];

    fetch(latestImage.url)
      .then(response => response.blob())
      .then(blob => {
        const generatedImageFile = new File([blob], 'generated_image.png', { type: 'image/png' });
        allAttachments.push(generatedImageFile);

        return window.Poe.sendUserMessage(`${model} ${analysisPrompt}`, {
          handler: `iterate-handler-${botId}`,
          stream: false,
          openChat: false,
          attachments: allAttachments,
          handlerContext: {
            type: 'iteration',
            prompt,
            bot: botId,
            imageId: latestImage.id
          }
        });
      })
      .catch(error => {
        showAlert(`Bot ${botId} iteration failed: ` + error.message);
        state.isAIThinking = false;
        dom[`iterateBtn${botId}`].disabled = false;
      });
  }

  function handleResponse(result, context) {
    state.isAIThinking = false;
    dom[`iterateBtn${botId}`].disabled = false;

    if (result.status === "complete") {
      const response = result.responses[0].content;
      state.lastAIResponse = response;

      displayAIResponse(botId, response, 'analysis');

      const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
      const analysisMatch = response.match(/ANALYSIS:\s*([^]*?)(?=IMPROVED_PROMPT:|$)/i);
      const improvedPromptMatch = response.match(/IMPROVED_PROMPT:\s*([^]*?)$/i);

      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      const analysis = analysisMatch ? analysisMatch[1].trim() : 'No analysis provided';
      const improvedPrompt = improvedPromptMatch ? improvedPromptMatch[1].trim() : '';

      displayAnalysisResult({
        score: score,
        analysis: analysis,
        improvedPrompt: improvedPrompt,
        originalPrompt: context.prompt,
        bot: botId
      });

      if (improvedPrompt) {
        dom[`userPrompt${botId}`].value = improvedPrompt;
        showAlert(`Bot ${botId} Analysis complete! Score: ${score}/100. Prompt auto-updated. Generate a new image to test.`);
      } else {
        showAlert(`Bot ${botId} Analysis complete! Score: ${score}/100. Use "Feed" to apply suggestions.`);
      }

      updateFeedButtonState(botId);

      dom.analysisSection.classList.remove('hidden');

    } else if (result.status === "error") {
      showAlert(`Bot ${botId} iteration failed: ` + (result.responses[0].statusText || 'Unknown error'));
    }
  }

  return { iterate, handleResponse };
}

