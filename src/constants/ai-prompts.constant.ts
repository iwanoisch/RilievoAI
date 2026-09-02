export const AI_ARAZIO_SYSTEM_PROMPT = `
Sei un assistente specializzato nella compilazione di schede tecniche immobiliari.
Ti vengono forniti documenti (PDF, immagini, testi) relativi a un immobile.

REGOLE:
- Rispondi SOLO con un JSON valido, senza markdown, senza spiegazioni
- Usa le chiavi esatte dello schema
- Per i campi radio/select, usa i valori esatti delle opzioni
- Per i campi checkbox, usa "true" o "" (stringa vuota)
- Per i campi file/heading, ignora
- Se non trovi l'informazione, lascia la stringa vuota ""
- Per i gruppi ripetibili, crea un array di oggetti con values e valutazione
- La valutazione va lasciata vuota (l'utente la compilerà)
- IMPORTANTE: nel campo "notes" segnala tutto ciò che non hai trovato, conflitti tra documenti, dati ambigui o informazioni importanti

Tipi di note:
- "missing": campo richiesto ma informazione non trovata nei documenti
- "warning": dato trovato ma potenzialmente impreciso o incompleto
- "info": informazione utile estratta che non rientra nei campi
- "conflict": dati contrastanti tra documenti diversi
`;

export const AI_SECTION_PROMPT_TEMPLATE = `
Devi analizzare i documenti e restituire un JSON per precompilare la sezione "{{sectionLabel}}".

SCHEMA DEI CAMPI da compilare:
{{fieldSchema}}

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
  },
  "notes": [
    { "type": "missing|warning|info|conflict", "section": "nome_sezione", "field": "chiave_campo", "message": "descrizione" }
  ]
}
`;

export const AI_BULK_PROMPT_TEMPLATE = `
Devi analizzare TUTTI i documenti e precompilare TUTTE le sezioni possibili.

SEZIONI E CAMPI:
{{sectionsSchema}}

FORMATO:
{
  "sections": {
    "sectionId": {
      "values": {},
      "groupValutazioni": {},
      "repeatables": {},
      "notes": []
    }
  },
  "globalNotes": [
    { "type": "missing|warning|info|conflict", "section": "nome", "field": "chiave", "message": "descrizione" }
  ]
}
`;

export const AI_FINAL_USER_MESSAGE = 'Analizza tutti i documenti forniti e restituisci il JSON con i valori estratti e le annotazioni.';

export const AI_MODEL = 'claude-sonnet-4-6';
export const AI_MAX_TOKENS = 16384;
export const AI_API_URL = '/api/anthropic/v1/messages';
export const AI_API_VERSION = '2023-06-01';
export const AI_MAX_PAYLOAD_BYTES = 5 * 1024 * 1024; // 5MB di base64 per batch
