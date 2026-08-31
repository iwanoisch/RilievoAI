import type {AiService} from "./ai-service.type.ts";
import {mockAiService} from "./ai-service.mock.ts";

// ============================================================
// SWAP POINT: sostituire mockAiService con il servizio reale
// quando il backend AI sarà disponibile.
//
// Esempio:
//   import {realAiService} from "./ai-service.real.ts";
//   export const aiService: AiService = realAiService;
// ============================================================

export const aiService: AiService = mockAiService;
