import type {AiService, AiPhotoAnalysisRequest, AiVoiceAnalysisRequest, AiSuggestion} from "./ai-service.type.ts";
import type {ElementType} from "../../building/slice/building.type.ts";

const MOCK_DELAY_MS = 2000;

const MOCK_PHOTO_RESPONSES: Array<{type: ElementType; label: string; tags: string[]; reasoning: string}> = [
    {type: 'wall', label: 'Parete', tags: ['struttura', 'interno'], reasoning: 'Rilevata superficie verticale continua con finitura intonaco'},
    {type: 'door', label: 'Porta', tags: ['infisso', 'accesso'], reasoning: 'Rilevato infisso con telaio e anta apribile'},
    {type: 'window', label: 'Finestra', tags: ['infisso', 'luce'], reasoning: 'Rilevato infisso con vetrata e telaio perimetrale'},
    {type: 'defect', label: 'Crepa strutturale', tags: ['criticità', 'struttura'], reasoning: 'Rilevata fessurazione su superficie verticale'},
    {type: 'plant', label: 'Impianto elettrico', tags: ['impianto', 'elettrico'], reasoning: 'Rilevati componenti elettrici (quadro, canalina, presa)'},
    {type: 'floor_surface', label: 'Pavimento', tags: ['superficie', 'orizzontale'], reasoning: 'Rilevata superficie orizzontale calpestabile'},
    {type: 'ceiling', label: 'Soffitto', tags: ['superficie', 'orizzontale'], reasoning: 'Rilevata superficie orizzontale superiore'},
    {type: 'room', label: 'Ambiente', tags: ['spazio', 'interno'], reasoning: 'Rilevato ambiente interno delimitato'},
];

const MOCK_VOICE_RESPONSES: Array<{type: ElementType; label: string; tags: string[]; reasoning: string; criticality: AiSuggestion['criticality']}> = [
    {type: 'defect', label: 'Infiltrazione', tags: ['criticità', 'umidità'], reasoning: 'Dalla trascrizione emerge una segnalazione di infiltrazione o umidità', criticality: 'high'},
    {type: 'wall', label: 'Parete con anomalia', tags: ['struttura', 'anomalia'], reasoning: 'Dalla trascrizione emerge una descrizione di parete con caratteristiche anomale', criticality: 'medium'},
    {type: 'room', label: 'Ambiente descritto', tags: ['spazio', 'descrizione'], reasoning: 'Dalla trascrizione emerge una descrizione di ambiente', criticality: 'none'},
    {type: 'plant', label: 'Impianto', tags: ['impianto', 'osservazione'], reasoning: 'Dalla trascrizione emerge un riferimento a impianti', criticality: 'low'},
];

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomConfidence = (): number => Math.floor(60 + Math.random() * 35);

export const mockAiService: AiService = {
    analyzePhoto: async (request: AiPhotoAnalysisRequest): Promise<AiSuggestion> => {
        await delay(MOCK_DELAY_MS);

        const mock = randomItem(MOCK_PHOTO_RESPONSES);
        return {
            id: String(Date.now()),
            sourceId: request.photoId,
            sourceType: 'photo',
            proposedElementType: mock.type,
            proposedElementLabel: mock.label,
            proposedParentId: request.currentRoomId || request.currentFloorId,
            confidence: randomConfidence(),
            reasoning: mock.reasoning,
            tags: mock.tags,
            timestamp: new Date().toISOString(),
        };
    },

    analyzeVoice: async (request: AiVoiceAnalysisRequest): Promise<AiSuggestion> => {
        await delay(MOCK_DELAY_MS);

        const mock = randomItem(MOCK_VOICE_RESPONSES);
        return {
            id: String(Date.now()),
            sourceId: request.observationId,
            sourceType: 'voice',
            proposedElementType: mock.type,
            proposedElementLabel: `${mock.label} — "${request.transcription.substring(0, 30)}..."`,
            proposedParentId: request.currentRoomId || request.currentFloorId,
            confidence: randomConfidence(),
            reasoning: mock.reasoning,
            criticality: mock.criticality,
            criticalityDescription: mock.criticality !== 'none' ? `Livello di criticità: ${mock.criticality}` : undefined,
            tags: mock.tags,
            timestamp: new Date().toISOString(),
        };
    },

    sendFeedback: async (_suggestionId: string, _action: string, _correction?: Partial<AiSuggestion>): Promise<void> => {
        await delay(500);
        // TODO real api: POST /ai/feedback { suggestionId, action, correction }
    },
};
