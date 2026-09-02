import type {ArazioSectionConfig, ArazioValutazione} from "../features/arazio/arazio.type.ts";

export const EMPTY_VALUTAZIONE: ArazioValutazione = {
    responsabile: '',
    scadenza: '',
    criticita: '',
    priorita: '',
    rischio: '',
    impatto: '',
    azioneRichiesta: '',
};

// Helper per sotto-sezioni documentali ripetute (presenza + deposito + data + prot + allegati + note)
const DOCUMENT_SUBSECTION_FIELDS = (prefix: string) => [
    {key: `${prefix}_presenza`, label: "Presenza", type: "radio" as const, options: [
        {value: "presente", label: "Presente"},
        {value: "non_presente", label: "Non presente"},
    ]},
    {key: `${prefix}_depositato`, label: "Depositato presso", type: "text" as const},
    {key: `${prefix}_data`, label: "In data", type: "text" as const},
    {key: `${prefix}_prot`, label: "Prot", type: "text" as const},
    {key: `${prefix}_allegati`, label: "Allegati progetto", type: "file" as const, colSpan: 2 as const},
];

export const ARAZIO_SECTIONS: ArazioSectionConfig[] = [
    // ── 1. Ubicazione Immobile ──
    {
        id: "ubicazione",
        number: 1,
        label: "Ubicazione Immobile - Georeferenziazione",
        groups: [
            {
                key: "generale",
                label: "Dati generali",
                required: true,
                hasValutazione: true,
                fields: [
                    {key: "denominazione", label: "Denominazione del bene", type: "text", required: true},
                    {key: "via", label: "Via", type: "text", required: true},
                    {key: "numero_civico", label: "n\u00B0", type: "text"},
                    {key: "comune", label: "Comune", type: "text", required: true},
                    {key: "provincia", label: "Provincia", type: "text", required: true},
                    {key: "destinazione_uso", label: "Destinazione d'uso", type: "text"},
                    {key: "valore_immobile", label: "Valore immobile", type: "text"},
                    {key: "documentazione_fotografica", label: "Documentazione fotografica", type: "text"},
                    {key: "coordinate_copertura", label: "Coordinate al centro della copertura", type: "text"},
                    {
                        key: "parte_complesso",
                        label: "Il fabbricato in oggetto fa parte di un complesso immobiliare",
                        type: "radio",
                        options: [
                            {value: "si", label: "S\u00EC"},
                            {value: "no", label: "No"},
                        ],
                    },
                    {key: "note", label: "Note", type: "textarea", colSpan: 2},
                ],
            },
        ],
    },

    // ── 2. Ente Proprietario ──
    {
        id: "ente-proprietario",
        number: 2,
        label: "Ente Proprietario",
        groups: [
            {
                key: "generale",
                label: "Dati generali",
                required: true,
                hasValutazione: true,
                fields: [
                    {key: "denominazione", label: "Denominazione", type: "text", required: true},
                    {key: "cf_ente", label: "C.F", type: "text"},
                    {key: "piva_ente", label: "P.IVA", type: "text"},
                    {key: "via", label: "Via", type: "text"},
                    {key: "numero_civico", label: "n\u00B0", type: "text"},
                    {key: "comune", label: "Comune", type: "text"},
                    {key: "provincia", label: "Provincia", type: "text"},
                    {key: "rappresentante_legale", label: "Rappresentante legale", type: "text"},
                    {key: "nome", label: "Nome", type: "text"},
                    {key: "cognome", label: "Cognome", type: "text"},
                    {key: "telefono", label: "Telefono", type: "text"},
                    {key: "mail", label: "Mail", type: "text"},
                    {key: "cf_rappresentante", label: "C.F", type: "text"},
                    {key: "piva_rappresentante", label: "P.IVA", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                ],
            },
        ],
    },

    // ── 3. Classificazione Storico-Tipologica ──
    {
        id: "classificazione",
        number: 3,
        label: "Classificazione Storico-Tipologica",
        groups: [
            {
                key: "generale",
                label: "Dati generali",
                required: true,
                hasValutazione: true,
                fields: [
                    {key: "anno_costruzione", label: "Anno di costruzione", type: "text", required: true},
                    {
                        key: "dati_generali",
                        label: "Dati generali",
                        type: "radio",
                        options: [
                            {value: "effettivo", label: "Effettivo"},
                            {value: "presunto", label: "Presunto"},
                        ],
                    },
                    {key: "heading_titolo_provenienza", label: "Titolo di provenienza", type: "heading", colSpan: 2},
                    {
                        key: "titolo_provenienza_presenza",
                        label: "Presenza",
                        type: "radio",
                        options: [
                            {value: "presente", label: "Presente"},
                            {value: "non_presente", label: "Non presente"},
                        ],
                    },
                    {key: "estremi_titolo", label: "Indicare gli estremi del titolo di provenienza specificando se riferibile al terreno o all'immobile", type: "text"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
        ],
    },

    // ── 4. Dati Catastali ──
    {
        id: "dati-catastali",
        number: 4,
        label: "Dati Catastali",
        groups: [
            {
                key: "generale",
                label: "Dati generali",
                required: true,
                hasValutazione: true,
                fields: [
                    {key: "denunciato", label: "Denunciato", type: "radio", options: [
                        {value: "denunciato", label: "Denunciato"},
                        {value: "non_denunciato", label: "Non denunciato"},
                    ]},
                    {key: "intestatario", label: "Intestatario", type: "text"},
                    {key: "denunciato_data_prot", label: "Denunciato in data Prot. n", type: "text", colSpan: 2},
                    {key: "allegati_denuncia", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto_denuncia", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "foglio",
                label: "Foglio",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "foglio", label: "Foglio", type: "text"},
                    {key: "particelle", label: "Particelle", type: "text"},
                    {key: "sub", label: "Sub", type: "text"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
        ],
    },

    // ── 5. Titoli Abilitativi e Documentazione Progettuale e Tecnica ──
    {
        id: "titoli-abilitativi",
        number: 5,
        label: "Titoli Abilitativi e Documentazione Progettuale e Tecnica",
        groups: [
            {
                key: "titolo_edilizio",
                label: "Titolo edilizio",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "tipologia", label: "Tipologia", type: "radio", colSpan: 2, options: [
                        {value: "licenza", label: "Licenza"},
                        {value: "autorizzazione", label: "Autorizzazione"},
                        {value: "concessione", label: "Concessione"},
                        {value: "permesso_di_costruire", label: "Permesso di Costruire"},
                        {value: "dia", label: "DIA"},
                        {value: "scia", label: "SCIA"},
                        {value: "cila", label: "CILA"},
                        {value: "altro_specificare_cosa", label: "Altro (specificare cosa)"},
                    ]},
                    {key: "titolo_intervento", label: "Titolo intervento", type: "text"},
                    {key: "rilasciato_da", label: "Rilasciato da", type: "checkbox"},
                    {key: "numero", label: "n\u00B0", type: "text"},
                    {key: "in_data", label: "In data", type: "text"},
                    {key: "fine_lavori_data", label: "Fine lavori in data", type: "text"},
                    {key: "elaborati_presenti", label: "Elaborati presenti", type: "radio", options: [
                        {value: "si", label: "S\u00EC"},
                        {value: "no", label: "No"},
                    ]},
                    {key: "note_titolo", label: "Note", type: "text"},
                    {key: "allegati_progetto", label: "Allegati progetto", type: "file", colSpan: 2},
                    {key: "foto_progetto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    // Progetto Strutturale
                    {key: "heading_progetto_strutturale", label: "Progetto Strutturale", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("prog_strutturale"),
                    {key: "prog_strutturale_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "prog_strutturale_note", label: "Note", type: "text"},
                    // Relazione geologica-geotecnica
                    {key: "heading_relazione_geologica", label: "Relazione geologica-geotecnica", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("rel_geologica"),
                    {key: "rel_geologica_note", label: "Note", type: "text"},
                    // Progetto Termotecnico
                    {key: "heading_progetto_termotecnico", label: "Progetto Termotecnico", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("prog_termotecnico"),
                    {key: "prog_termotecnico_note", label: "Note", type: "text"},
                    // Progetto Elettrotecnico
                    {key: "heading_progetto_elettrotecnico", label: "Progetto Elettrotecnico", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("prog_elettrotecnico"),
                    {key: "prog_elettrotecnico_note", label: "Note", type: "text"},
                    // Certificato abitabilità/agibilità
                    {key: "heading_certificato_agibilita", label: "Certificato di abitabilit\u00E0 o agibilit\u00E0", type: "heading", colSpan: 2},
                    {key: "agibilita_presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "agibilita_depositato", label: "Depositato presso", type: "text"},
                    {key: "agibilita_data", label: "In data", type: "text"},
                    {key: "agibilita_prot", label: "Prot", type: "text"},
                    {key: "agibilita_rilasciato_da", label: "Rilasciato da", type: "checkbox"},
                    {key: "agibilita_numero", label: "n\u00B0", type: "text"},
                    {key: "agibilita_data_rilascio", label: "In data", type: "text"},
                    {key: "agibilita_allegati", label: "Allegati agibilit\u00E0", type: "file", colSpan: 2},
                    {key: "agibilita_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "agibilita_note", label: "Note", type: "text"},
                    // Progetto as-built
                    {key: "heading_as_built", label: "Progetto as-built \u00ABcome costruito\u00BB", type: "heading", colSpan: 2},
                    {key: "as_built_presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "as_built_titolo", label: "Titolo intervento", type: "text"},
                    {key: "as_built_disponibilita", label: "Disponibilit\u00E0", type: "radio", options: [
                        {value: "disponibile", label: "Disponibile"},
                        {value: "non_disponibile", label: "Non disponibile"},
                    ]},
                    {key: "as_built_data", label: "In data", type: "text"},
                    {key: "as_built_elaborati", label: "Elaborati presenti", type: "radio", options: [
                        {value: "si", label: "S\u00EC"},
                        {value: "no", label: "No"},
                    ]},
                    {key: "as_built_presso", label: "Presso", type: "text"},
                    {key: "as_built_data_deposito", label: "In data", type: "text"},
                    {key: "as_built_prot", label: "Prot", type: "text"},
                    // Collaudo tecnico-amministrativo
                    {key: "heading_collaudo_ta", label: "Collaudo tecnico-amministrativi", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("collaudo_ta"),
                    {key: "collaudo_ta_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "collaudo_ta_note", label: "Note", type: "text"},
                    // Collaudo statico
                    {key: "heading_collaudo_statico", label: "Collaudi statico", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("collaudo_statico"),
                    {key: "collaudo_statico_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "collaudo_statico_note", label: "Note", type: "text"},
                    // Piano di manutenzione
                    {key: "heading_piano_manutenzione", label: "Piano di manutenzione dell'immobile", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("piano_manutenzione"),
                    {key: "piano_manutenzione_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "piano_manutenzione_note", label: "Note", type: "text"},
                    // Fascicolo dell'opera
                    {key: "heading_fascicolo_opera", label: "Fascicolo dell'opera", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("fascicolo_opera"),
                    {key: "fascicolo_opera_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "fascicolo_opera_note", label: "Note", type: "text"},
                    // Modellazione BIM
                    {key: "heading_bim", label: "Modellazione BIM (Building Information Modeling) dell'immobile", type: "heading", colSpan: 2},
                    ...DOCUMENT_SUBSECTION_FIELDS("bim"),
                    {key: "bim_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "bim_note", label: "Note", type: "text"},
                    // Altro da specificare
                    {key: "heading_altro", label: "Altro da specificare", type: "heading", colSpan: 2},
                    {key: "altro_descrizione", label: "Descrizione", type: "checkbox"},
                    {key: "altro_depositato", label: "Depositato presso", type: "text"},
                    {key: "altro_data", label: "In data", type: "text"},
                    {key: "altro_prot", label: "Prot", type: "text"},
                    {key: "altro_allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "altro_foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "altro_note", label: "Note", type: "text"},
                ],
            },
            {
                key: "idoneita_statica",
                label: "Dichiarazione/certificazione di idoneit\u00E0 statica",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "depositato", label: "Depositato presso", type: "text"},
                    {key: "data", label: "In data", type: "text"},
                    {key: "prot", label: "Prot", type: "text"},
                    {key: "allegati", label: "Allegati idoneit\u00E0 statica", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
            {
                key: "vulnerabilita_sismica",
                label: "Verifica vulnerabilit\u00E0 sismica",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "depositato", label: "Depositato presso", type: "text"},
                    {key: "data", label: "In data", type: "text"},
                    {key: "prot", label: "Prot", type: "text"},
                    {key: "struttura_conforme", label: "La struttura \u00E8 conforme alle norme tecniche vigenti all'epoca della costruzione", type: "radio", options: [
                        {value: "si", label: "S\u00EC"},
                        {value: "no", label: "No"},
                    ]},
                    {key: "conforme_specificare", label: "In caso di risposta affermativa specificare quale", type: "checkbox"},
                    {key: "altra_doc_sismica", label: "Altra documentazione sul rischio sismico", type: "radio", options: [
                        {value: "si", label: "S\u00EC"},
                        {value: "no", label: "No"},
                    ]},
                    {key: "altra_doc_specificare", label: "In caso di risposta affermativa specificare quale", type: "text"},
                    {key: "allegati", label: "Allegati progetto", type: "file", colSpan: 2},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
            {
                key: "relazione_archeologica",
                label: "Relazione archeologica",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "depositato", label: "Depositato presso", type: "text"},
                    {key: "data", label: "In data", type: "text"},
                    {key: "prot", label: "Prot", type: "text"},
                    {key: "allegati", label: "Allegati progetto", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
            {
                key: "altre_relazioni",
                label: "Altre relazioni specialistiche",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "depositato", label: "Depositato presso", type: "text"},
                    {key: "data", label: "In data", type: "text"},
                    {key: "prot", label: "Prot", type: "text"},
                    {key: "allegati", label: "Allegati progetto", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
            {
                key: "violazione_normativa",
                label: "Violazione normativa urbanistico-edilizia",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "presenza", label: "Presenza", type: "radio", options: [
                        {value: "presente", label: "Presente"},
                        {value: "non_presente", label: "Non presente"},
                    ]},
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "sanabilita", label: "Descrizione", type: "radio", options: [
                        {value: "sanabile", label: "Sanabile"},
                        {value: "non_sanabile", label: "Non sanabile"},
                    ]},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
        ],
    },

    // ── 6. Dati Tecnici e Vincoli ──
    {
        id: "dati-tecnici",
        number: 6,
        label: "Dati Tecnici e Vincoli",
        groups: [
            {
                key: "generale",
                label: "Dati generali",
                required: true,
                hasValutazione: true,
                fields: [
                    {key: "zona_omogenea", label: "Zona omogenea", type: "text"},
                    {key: "strumento_vigente", label: "Strumento urbanistico vigente (estremi atto di approvazione)", type: "text"},
                    {key: "strumento_adottato", label: "Strumento urbanistico adottato (estremi atto di adozione)", type: "text"},
                    {key: "allegati_strumento", label: "Allegati strumento urbanistico", type: "file", colSpan: 2},
                    {key: "foto_strumento", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "note", label: "Note", type: "text"},
                ],
            },
            {
                key: "vincolo_culturale",
                label: "Vincolo di interesse culturale",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "vincolo", label: "Vincolo di interesse culturale", type: "radio", options: [
                        {value: "non_gravato", label: "Non gravato"},
                    ]},
                    {key: "descrizione", label: "Descrizione/Tipo vincolo presente", type: "text"},
                    {key: "allegati", label: "Allegati vincolo", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "vincolo_paesaggistico",
                label: "Vincolo paesaggistico",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "vincolo", label: "Vincolo paesaggistico", type: "radio", options: [
                        {value: "non_gravato", label: "Non gravato"},
                    ]},
                    {key: "descrizione", label: "Descrizione/Tipo vincolo presente", type: "text"},
                    {key: "allegati", label: "Allegati vincolo", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "vincolo_idrogeologico",
                label: "Vincolo idrogeologico",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "vincolo", label: "Vincolo idrogeologico", type: "radio", options: [
                        {value: "non_gravato", label: "Non gravato"},
                    ]},
                    {key: "descrizione", label: "Descrizione/Tipo vincolo presente", type: "text"},
                    {key: "allegati", label: "Allegati vincolo", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "vincolo_identitario",
                label: "Vincolo identitario (Piano Paesaggistico Regionale \u2013 Piano Urbanistico Comunale)",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "vincolo", label: "Vincolo identitario (PPR \u2013 PUC)", type: "radio", options: [
                        {value: "non_gravato", label: "Non gravato"},
                    ]},
                    {key: "descrizione", label: "Descrizione/Tipo vincolo presente", type: "text"},
                    {key: "allegati", label: "Allegati vincolo", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "vincolo_sismico",
                label: "Vincolo sismico",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "vincolo", label: "Vincolo sismico", type: "radio", options: [
                        {value: "non_gravato", label: "Non gravato"},
                    ]},
                    {key: "descrizione", label: "Descrizione/Tipo vincolo presente", type: "text"},
                    {key: "allegati", label: "Allegati vincolo", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "servitu",
                label: "Servit\u00F9",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "vincolo", label: "Servit\u00F9", type: "radio", options: [
                        {value: "non_gravato", label: "Non gravato"},
                    ]},
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati vincolo", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "altri_vincoli",
                label: "Altri vincoli presenti",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
        ],
    },

    // ── 7. Atti Giuridici e Assicurativi ──
    {
        id: "atti-giuridici",
        number: 7,
        label: "Atti Giuridici e Assicurativi",
        groups: [
            {
                key: "atti_giuridici",
                label: "Atti Giuridici e Assicurativi",
                repeatable: true,
                fields: [],
                subGroups: [
                    {
                        key: "generale",
                        label: "Dati generali",
                        required: true,
                        hasValutazione: true,
                        fields: [
                            {key: "categoria_documento", label: "Categoria documento", type: "radio", colSpan: 2, options: [
                                {value: "atto_notarile", label: "Atto notarile"},
                                {value: "polizza_assicurativa", label: "Polizza assicurativa"},
                                {value: "mutuo", label: "Mutuo"},
                                {value: "convenzione", label: "Convenzione"},
                                {value: "comodato", label: "Comodato"},
                                {value: "altro", label: "Altro"},
                            ]},
                            {key: "stato_documento", label: "Stato documento", type: "radio", colSpan: 2, options: [
                                {value: "attivo", label: "Attivo"},
                                {value: "superato", label: "Superato"},
                                {value: "scaduto", label: "Scaduto"},
                                {value: "annullato", label: "Annullato"},
                                {value: "da_verificare", label: "Da verificare"},
                            ]},
                            {key: "oggetto_atto", label: "Oggetto sintetico dell'atto", type: "text"},
                            {key: "data_atto", label: "Data atto / decorrenza", type: "date"},
                            {key: "data_scadenza", label: "Data scadenza / termine efficacia", type: "date"},
                            {key: "tipologia_atto", label: "Tipologia atto", type: "radio", colSpan: 2, options: [
                                {value: "compravendita", label: "Compravendita"},
                                {value: "donazione", label: "Donazione"},
                                {value: "successione", label: "Successione"},
                                {value: "divisione", label: "Divisione"},
                                {value: "permuta", label: "Permuta"},
                                {value: "costituzione_servitu", label: "Costituzione servit\u00F9"},
                                {value: "cancellazione_servitu", label: "Cancellazione servit\u00F9"},
                                {value: "usufrutto", label: "Usufrutto"},
                                {value: "diritto_di_superficie", label: "Diritto di superficie"},
                                {value: "convenzione", label: "Convenzione"},
                                {value: "altro", label: "Altro"},
                            ]},
                        ],
                    },
                    {
                        key: "atto_notarile",
                        label: "Atto notarile / provenienza",
                        repeatable: true,
                        hasValutazione: true,
                        fields: [
                            {key: "numero_repertorio", label: "Numero repertorio", type: "text"},
                            {key: "numero_raccolta", label: "Numero raccolta", type: "text"},
                            {key: "notaio", label: "Notaio / pubblico ufficiale", type: "text"},
                            {key: "studio_notarile", label: "Studio notarile / sede", type: "text"},
                            {key: "luogo_stipula", label: "Comune / luogo di stipula", type: "text"},
                            {key: "cedente", label: "Cedente / dante causa", type: "text"},
                            {key: "acquirente", label: "Acquirente / avente causa", type: "text"},
                            {key: "altri_soggetti", label: "Altri soggetti coinvolti", type: "text"},
                            {key: "immobili_interessati", label: "Immobili interessati: foglio, mappale, subalterno", type: "text"},
                            {key: "vincoli_clausole", label: "Vincoli, servit\u00F9, diritti reali, clausole particolari", type: "text"},
                            {key: "allegati", label: "Allegati: atto, nota di trascrizione, voltura, planimetrie, estratti", type: "file", colSpan: 2},
                            {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                            {key: "compagnia_assicurativa", label: "Compagnia assicurativa", type: "text"},
                        ],
                    },
                    {
                        key: "polizza_assicurativa",
                        label: "Polizza assicurativa",
                        repeatable: true,
                        hasValutazione: true,
                        fields: [
                            {key: "numero_polizza", label: "Numero polizza", type: "text"},
                            {key: "agenzia", label: "Agenzia / intermediario", type: "text"},
                            {key: "contraente", label: "Contraente", type: "text"},
                            {key: "beneficiario", label: "Beneficiario / vincolatario", type: "text"},
                            {key: "premio_annuo", label: "Premio annuo / premio periodo", type: "text"},
                            {key: "massimale", label: "Massimale assicurato", type: "text"},
                            {key: "tipologia", label: "Tipologia", type: "radio", colSpan: 2, options: [
                                {value: "incendio", label: "Incendio"},
                                {value: "scoppio", label: "Scoppio"},
                                {value: "eventi_atmosferici", label: "Eventi atmosferici"},
                                {value: "acqua_condotta", label: "Acqua condotta"},
                                {value: "furto", label: "Furto"},
                                {value: "rc", label: "RC"},
                                {value: "terremoto", label: "Terremoto"},
                                {value: "alluvione", label: "Alluvione"},
                                {value: "altro", label: "Altro"},
                            ]},
                            {key: "franchigie", label: "Franchigie / scoperti", type: "text"},
                            {key: "documento_polizza", label: "Documenti: polizza, quietanze, appendici, condizioni generali/speciali", type: "file", colSpan: 2, multiple: false},
                            {key: "allegati", label: "Documenti", type: "file", colSpan: 2},
                        ],
                    },
                    {
                        key: "sinistri",
                        label: "Sinistri registrati",
                        repeatable: true,
                        hasValutazione: true,
                        fields: [
                            {key: "numero_sinistro", label: "Numero sinistro / codice pratica", type: "text"},
                            {key: "data_evento", label: "Data evento", type: "date"},
                            {key: "data_apertura", label: "Data apertura pratica", type: "date"},
                            {key: "tipologia_sinistro", label: "Tipologia sinistro", type: "radio", colSpan: 2, options: [
                                {value: "infiltrazione", label: "Infiltrazione"},
                                {value: "incendio", label: "Incendio"},
                                {value: "eventi_atmosferici", label: "Eventi atmosferici"},
                                {value: "grandine", label: "Grandine"},
                                {value: "furto", label: "Furto"},
                                {value: "responsabilita_civile", label: "Responsabilit\u00E0 civile"},
                                {value: "sisma", label: "Sisma"},
                                {value: "alluvione", label: "Alluvione"},
                                {value: "guasto_impianto", label: "Guasto impianto"},
                                {value: "altro", label: "Altro"},
                            ]},
                            {key: "descrizione_sinistro", label: "Descrizione sintetica del sinistro", type: "text"},
                            {key: "unita_interessata", label: "Unit\u00E0 / ambiente / porzione interessata", type: "text"},
                            {key: "danno_stimato", label: "Danno stimato", type: "text"},
                            {key: "perizia_tecnico", label: "Perizia / tecnico incaricato", type: "text", colSpan: 2},
                            {key: "allegati_perizia", label: "Allegati perizia", type: "file", colSpan: 2},
                            {key: "importo_liquidato", label: "Importo liquidato / rimborso", type: "text"},
                            {key: "stato_pratica", label: "Stato pratica", type: "radio", colSpan: 2, options: [
                                {value: "aperta", label: "Aperta"},
                                {value: "in_istruttoria", label: "In istruttoria"},
                                {value: "liquidata", label: "Liquidata"},
                                {value: "respinta", label: "Respinta"},
                                {value: "chiusa", label: "Chiusa"},
                            ]},
                            {key: "allegati_sinistro", label: "Allegati: denuncia, foto, perizia, preventivi, fatture, liquidazione", type: "file", colSpan: 2},
                            {key: "foto_sinistro", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                        ],
                    },
                ],
            },
        ],
    },

    // ── 8. Dati Generali, Pertinenze ──
    {
        id: "dati-generali",
        number: 8,
        label: "Dati Generali, Pertinenze",
        groups: [
            {
                key: "cortile_interno",
                label: "Cortile interno",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "scale",
                label: "Scale",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "piani_fuori_terra",
                label: "Piani fuori terra",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "destinazione_uso",
                label: "Destinazione d'uso",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                ],
            },
            {
                key: "piani_interrati",
                label: "Piani interrati",
                optional: true,
                hasValutazione: true,
                fields: [
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                    {key: "superficie_coperta", label: "Superficie coperta: mq", type: "text"},
                    {key: "superficie_scoperta", label: "Superficie scoperta: mq", type: "text"},
                    {key: "altezza_fabbricato", label: "Altezza del fabbricato: m", type: "text"},
                    {key: "volume_fuori_terra", label: "Volume totale del fabbricato fuori terra: mc", type: "text"},
                    {key: "volume_entro_terra", label: "Volume totale del fabbricato entro terra: mc", type: "text"},
                    {key: "allegati_2", label: "Allegati", type: "file", colSpan: 2},
                    {key: "foto_2", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
        ],
    },

    // ── 9. Interventi Successivi ──
    {
        id: "interventi",
        number: 9,
        label: "Interventi Successivi Sull'Impianto Originario Dell'Immobile",
        groups: [
            {
                key: "superfetazioni",
                label: "Superfetazioni",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "tipologia", label: "Tipologia", type: "radio", colSpan: 2, options: [
                        {value: "si", label: "S\u00EC"},
                        {value: "no", label: "No"},
                        {value: "non_determinabili", label: "Non determinabili"},
                        {value: "non_riconoscibili", label: "Non riconoscibili"},
                    ]},
                    {key: "data", label: "Data", type: "text"},
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati progetto", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
            {
                key: "sopraelevazioni",
                label: "Sopraelevazioni",
                repeatable: true,
                hasValutazione: true,
                fields: [
                    {key: "tipologia", label: "Tipologia", type: "radio", colSpan: 2, options: [
                        {value: "si", label: "S\u00EC"},
                        {value: "no", label: "No"},
                        {value: "non_determinabili", label: "Non determinabili"},
                        {value: "non_riconoscibili", label: "Non riconoscibili"},
                    ]},
                    {key: "data", label: "Data", type: "text"},
                    {key: "descrizione", label: "Descrizione", type: "text"},
                    {key: "allegati", label: "Allegati progetto", type: "file", colSpan: 2},
                    {key: "foto", label: "Fotografie", type: "file", colSpan: 2, accept: "image/*"},
                ],
            },
        ],
    },
];
