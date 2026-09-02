import type {AiArazioRequest, AiArazioResponse, AiExtractedFile} from "./ai.type.ts";

const API_KEY = import.meta.env.VITE_CLAUDE_KEY as string;
const API_URL = '/api/anthropic/v1/messages';

const buildSystemPrompt = (request: AiArazioRequest): string => `
Sei un assistente specializzato nella compilazione di schede tecniche immobiliari.
Ti vengono forniti documenti (PDF, immagini, testi) relativi a un immobile.

Devi analizzare i documenti e restituire un JSON per precompilare la sezione "${request.sectionLabel}".

SCHEMA DEI CAMPI da compilare:
${JSON.stringify(request.fieldSchema, null, 2)}

REGOLE:
- Rispondi SOLO con un JSON valido, senza markdown, senza spiegazioni
- Usa le chiavi esatte dello schema
- Per i campi radio/select, usa i valori esatti delle opzioni
- Per i campi checkbox, usa "true" o "" (stringa vuota)
- Per i campi file, ignora (non puoi compilarli)
- Per i campi heading, ignora
- Se non trovi l'informazione in un documento, lascia la stringa vuota ""
- Per i gruppi ripetibili, crea un array di oggetti con values e valutazione
- La valutazione va lasciata vuota (l'utente la compilerà)

FORMATO RISPOSTA JSON:
{
  "values": { "chiave_campo": "valore_trovato" },
  "groupValutazioni": {},
  "repeatables": {
    "chiave_gruppo_ripetibile": [
      {
        "values": { "chiave_campo": "valore" },
        "valutazione": { "responsabile": "", "scadenza": "", "criticita": "", "priorita": "", "rischio": "", "impatto": "", "azioneRichiesta": "" }
      }
    ]
  }
}
`;

const buildContentBlocks = (files: AiExtractedFile[]): Array<Record<string, unknown>> => {
    const blocks: Array<Record<string, unknown>> = [];

    for (const file of files) {
        if (file.mimeType === 'application/pdf') {
            blocks.push({
                type: 'document',
                source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: file.base64,
                },
            });
        } else if (file.mimeType.startsWith('image/')) {
            blocks.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: file.mimeType,
                    data: file.base64,
                },
            });
        } else {
            const text = atob(file.base64);
            blocks.push({
                type: 'text',
                text: `--- File: ${file.name} ---\n${text}`,
            });
        }
    }

    blocks.push({
        type: 'text',
        text: 'Analizza tutti i documenti forniti e restituisci il JSON con i valori estratti per la sezione indicata.',
    });

    return blocks;
};

export const callClaudeForArazio = async (request: AiArazioRequest): Promise<AiArazioResponse> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8192,
            system: buildSystemPrompt(request),
            messages: [
                {
                    role: 'user',
                    content: buildContentBlocks(request.files),
                },
            ],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: Record<string, unknown>) => b.type === 'text');
    if (!textBlock?.text) {
        throw new Error('Risposta vuota da Claude');
    }

    return JSON.parse(textBlock.text as string) as AiArazioResponse;
};
