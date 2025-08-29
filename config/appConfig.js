/**
 * Application configuration.
 * Centralizes default models and bot behaviour.
 * Update these fields to adjust application behaviour without modifying core logic.
 */
window.appConfig = {
  /**
   * Default state for new bot instances.
   */
  defaultBotState: {
    lastAIResponse: '',
    isGenerating: false,
    isAIThinking: false
  },

  /**
   * Initial model selection for dropdown menus.
   */
  defaultDropdownState: {
    dropdown1: { isOpen: false, value: '@Claude-Sonnet-4' },
    dropdown2: { isOpen: false, value: '@GPT-4.1-mini' }
  },

  /**
   * Mapping of available multimodal models grouped by provider and series.
   */
          multimodalModels: {
            "GPT": {
                "GPT-5 Series": [
                    "@GPT-5-Chat",
                    "@GPT-5",
                    "@GPT-5-mini",
                    "@GPT-5-nano"
                ],
                "GPT-4 Series": [
                    "@GPT-4.1",
                    "@GPT-4o-Search"
                ],
                "o-Series (Reasoning)": [
                    "@o1",
                    "@o3",
                    "@o3-pro"
                ]
            },
            "GPT - Open Weight": {
                "120B Parameter Models": [
                    "@GPT-OSS-120B-T",
                    "@GPT-OSS-120B",
                    "@GPT-OSS-120B-CS",
                    "@OpenAI-GPT-OSS-120B"
                ],
                "20B Parameter Models": [
                    "@GPT-OSS-20B-T",
                    "@GPT-OSS-20B",
                    "@OpenAI-GPT-OSS-20B"
                ]
            },
            "Google": {
                "Gemini 2.5 Series": [
                    "@Gemini-2.5-Pro",
                    "@Gemini-2.5-Flash",
                    "@Gemini-2.5-Flash-Lite"
                ],
                "Gemma Series": [
                    "@Gemma-3-27B",
                    "@Gemma-2-27b-T"
                ]
            },
            "Claude": {
                "Opus Series": [
                    "@Claude-Opus-4.1",
                    "@Claude-Opus-4",
                    "@Claude-Opus-4-Reasoning",
                    "@Claude-Opus-4-Search"
                ],
                "Sonnet Series": [
                    "@Claude-Sonnet-4",
                    "@Claude-Sonnet-4-Reasoning",
                    "@Claude-Sonnet-4-Search"
                ],
                "Haiku Series": [
                    "@Claude-Haiku-3.5"
                ]
            },
            "Grok": [
                "@Grok-4",
                "@Grok-3",
                "@Grok-3-Mini",
                "@Grok-Code-Fast-1"
            ],
            "Llama 4": [
                "@Llama-4-Scout-B10",
                "@Llama-4-Maverick",
                "@Llama-4-Scout-T",
                "@Llama-4-Scout-CS",
                "@Llama-4-Scout",
                "@Llama-4-Maverick-T",
                "@Llama-4-Maverick-B10"
            ],
            "Llama 3.X": {
                "The Behemoths (405B)": [
                    "@Llama-3.1-405B",
                    "@Llama-3.1-405B-T",
                    "@Llama-3.1-405B-FW",
                    "@Llama-3.1-405B-FP16"
                ],
                "The Curated 70B Fleet": [
                    "@Llama-3-70b-Groq",
                    "@Llama-3.3-70B",
                    "@Llama-3.1-Nemotron",
                    "@Llama-3.3-70B-DI",
                    "@Llama-3.3-70B-CS",
                    "@Llama-3.3-70B-Vers"
                ]
            },
            "Qwen (235B+)": [
                "@Qwen3-Coder",
                "@Qwen-3-235B-2507-T",
                "@Qwen3-235B-2507-FW",
                "@Qwen3-235B-2507-CS",
                "@Qwen3-Coder-480B-T",
                "@Qwen3-Coder-480B-N",
                "@Qwen3-480B-Coder-CS",
                "@Qwen3-235B-A22B-DI",
                "@Qwen3-235B-A22B",
                "@Qwen3-235B-A22B-N",
                "@Qwen3-235B-Think-CS"
            ],
            "DeepSeek": {
                "R1 Series (Reasoning)": [
                    "@DeepSeek-R1",
                    "@DeepSeek-R1-FW",
                    "@DeepSeek-R1-DI",
                    "@DeepSeek-R1-N",
                    "@DeepSeek-R1-Distill",
                    "@DeepSeek-R1-Turbo-DI"
                ],
                "V3 Series (Foundation)": [
                    "@DeepSeek-V3.1",
                    "@DeepSeek-V3.1-N",
                    "@Deepseek-V3-FW",
                    "@DeepSeek-V3",
                    "@DeepSeek-V3-DI",
                    "@DeepSeek-V3-Turbo-DI"
                ],
                "Specialized & Hybrids": [
                    "@DeepSeek-Prover-V2",
                    "@DeepClaude"
                ]
            },
            "Mistral (Revised)": {
                "Large Series": [
                    "@Mistral-Large-2"
                ],
                "Medium Series": [
                    "@Mistral-Medium-3",
                    "@Mistral-Medium",
                    "@Magistral-Medium-2506-Thinking"
                ],
                "Small Series (Vision-Enabled)": [
                    "@Mistral-Small-3.2",
                    "@Mistral-Small-3.1",
                    "@Mistral-Small-3"
                ],
                "Specialized & MoE Models": [
                    "@Mistral-NeMo",
                    "@Mixtral8x22b-Inst-FW"
                ]
            },
            "Perplexity": [
                "@Perplexity-R1-1776",
                "@Perplexity-Sonar",
                "@Perplexity-Sonar-Pro",
                "@Perplexity-Sonar-Rsn",
                "@Perplexity-Sonar-Rsn-Pro"
            ],
            "Wildcards (A-K)": [
                "@Aya-Expanse-32B",
                "@Aya-Vision",
                "@Command-R",
                "@Command-R-Plus",
                "@GLM-4.5",
                "@GLM-4.5-Air",
                "@GLM-4.5-Air-T",
                "@GLM-4.5-FW",
                "@Inception-Mercury",
                "@Kimi-K2",
                "@Kimi-K2-Instruct",
                "@Kimi-K2-T"
            ],
            "Wildcards (L-Z)": [
                "@Linkup-Deep-Search",
                "@Linkup-Standard",
                "@MiniMax-M1",
                "@Phi-4-DI",
                "@QwQ-32B-B10",
                "@QwQ-32B-Preview-T",
                "@QwQ-32B-T",
                "@Reka-Core",
                "@Reka-Flash",
                "@Solar-Pro-2"
            ]
  }
};
