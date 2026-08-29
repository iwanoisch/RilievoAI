# PROMPT - Modulo Rilievo AI Indoor (Web App React)

> Documento di riferimento: `Specifiche_Modulo_Rilievo_AI_Indoor_Ivan_V0.2_REVISIONE_SVILUPPATORE.docx`
> Adattamento: app web React (mobile-first, responsive) — NON app nativa Android/iOS.
> Stack: React 19 + TypeScript + Vite + Redux Toolkit + Tailwind CSS + i18n (it/en/ar)

---

## Contesto

Il "Modulo Rilievo AI" serve a un tecnico che esegue un sopralluogo edilizio. L'obiettivo e' ridurre le operazioni manuali: il tecnico cammina, fotografa, parla e il sistema associa automaticamente foto, note vocali e misure agli elementi dell'edificio (pareti, porte, finestre, impianti, criticita).

Essendo una **web app** (non nativa), non abbiamo accesso diretto a ARCore/ARKit/SLAM. Tuttavia possiamo:
- Usare le **Web APIs** (MediaDevices, Geolocation, DeviceOrientation, Web Speech)
- Ricevere dati spaziali (pose, point cloud, mesh) da un **backend/servizio esterno** o da un futuro modulo nativo che li invia via API
- Gestire tutta la **UI di sessione, visualizzazione, associazione, validazione e mapping al Fascicolo**

L'app web e' il **centro di comando**: gestisce sessioni, visualizza dati, permette validazione e alimenta il Fascicolo Edifici.

---

## Principi di sviluppo

- **Mobile-first responsive** (smartphone, tablet, desktop)
- **Accessibilita WCAG 3.0** (aria-labels, focus management, contrasti, screen reader)
- **Codice leggibile** anche per un junior: nomi descrittivi, commenti dove serve, struttura chiara
- **Best practice React**: composizione, hooks custom, separazione logica/presentazione
- **Redux Toolkit** con pattern feature-based esistente del progetto
- **i18n obbligatorio**: ogni stringa visibile in it/en/ar, mai hardcodata
- **Tema esistente** del progetto (light/dark, CSS variables)
- **Confidence visibile**: ogni dato derivato dall'AI mostra il livello di affidabilita
- **Stati del dato**: RAW → DERIVED → PROPOSED → VALIDATED → REJECTED → SUPERSEDED

---

## Struttura feature Redux

```
src/features/survey/
  ├── slice/
  │   ├── survey.type.ts           # Tipi sessione, trajectory, media, observations
  │   └── surveySlice.ts           # Slice Redux sessione di rilievo
  ├── hooks/
  │   ├── useSurvey.ts             # Hook principale sessione
  │   ├── useSurveyMedia.ts        # Cattura foto/video/audio
  │   ├── useSurveyVoice.ts        # Registrazione e trascrizione vocale
  │   └── useSurveyValidation.ts   # Workflow validazione
  └── api/
      └── survey.api.ts            # Chiamate API backend

src/features/building/
  ├── slice/
  │   ├── building.type.ts         # Tipi modello gerarchico edificio
  │   └── buildingSlice.ts         # Slice Redux modello edificio
  ├── hooks/
  │   ├── useBuilding.ts           # Hook principale edificio
  │   └── useBuildingElements.ts   # Gestione elementi (pareti, porte, finestre)
  └── api/
      └── building.api.ts

src/features/floorPlan/
  ├── slice/
  │   ├── floorPlan.type.ts        # Tipi planimetria
  │   └── floorPlanSlice.ts
  ├── hooks/
  │   └── useFloorPlan.ts
  └── api/
      └── floorPlan.api.ts

src/features/spatialAnchor/
  ├── slice/
  │   ├── spatialAnchor.type.ts    # SpatialAnchor, Landmark
  │   └── spatialAnchorSlice.ts
  └── hooks/
      └── useSpatialAnchors.ts

src/features/measurement/
  ├── slice/
  │   ├── measurement.type.ts      # Misure laser/manuali
  │   └── measurementSlice.ts
  └── hooks/
      └── useMeasurements.ts
```

---

## ATTIVITA' SUDDIVISE PER FASE

---

### FASE 0 — Fondamenta: Tipi, Slice, Struttura dati

> Obiettivo: definire il modello dati completo prima di costruire UI.

#### 0.1 — Definizione tipi modello edificio (`building.type.ts`)
Creare le interfacce TypeScript per il modello gerarchico:
```
Building → Floor → Room → Wall / Door / Window / Ceiling / Floor / Element / Plant / Defect
```
Ogni entita ha:
- `id` persistente (UUID)
- `label` leggibile ("Parete cucina lato soggiorno")
- `parentId` per navigazione gerarchica
- `dataStatus`: `RAW | DERIVED | PROPOSED | VALIDATED | REJECTED | SUPERSEDED`
- `confidence`: number 0-100
- `createdAt`, `updatedAt`, `sessionId`

#### 0.2 — Definizione tipi sessione rilievo (`survey.type.ts`)
```typescript
interface SurveySession {
  id: string;
  buildingId: string;
  technicianId: string;
  deviceInfo: DeviceInfo;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'paused' | 'completed' | 'interrupted';
  softwareVersion: string;
}

interface SurveyPhoto {
  id: string;
  sessionId: string;
  timestamp: string;
  floorId?: string;
  roomId?: string;
  targetElementId?: string;
  geolocation?: GeoPosition;        // da Geolocation API se disponibile
  deviceOrientation?: DeviceOrient;  // da DeviceOrientation API se disponibile
  confidence: number;
  dataStatus: DataStatus;
  mediaPath: string;
  thumbnailPath?: string;
  viewDirection?: string;            // descrizione testuale o angolo
}

interface VoiceObservation {
  id: string;
  sessionId: string;
  timestamp: string;
  audioPath: string;
  transcription?: string;
  floorId?: string;
  roomId?: string;
  targetElementId?: string;
  confidence: number;
  dataStatus: DataStatus;
}

interface Measurement {
  id: string;
  sessionId: string;
  type: 'distance' | 'height' | 'thickness' | 'other';
  value: number;
  unit: 'mm' | 'cm' | 'm';
  elementId?: string;
  instrumentId?: string;
  timestamp: string;
  confidence: number;
  dataStatus: DataStatus;
}
```

#### 0.3 — Definizione tipi SpatialAnchor e Landmark (`spatialAnchor.type.ts`)
```typescript
interface SpatialAnchor {
  id: string;
  buildingId: string;
  floorId?: string;
  localTransform?: number[];  // matrice 4x4 se disponibile dal backend
  globalReference?: {
    lat: number; lon: number; alt?: number; accuracy: number;
  };
  source: 'GNSS' | 'PLAN' | 'MARKER' | 'MANUAL' | 'BACKEND_AR';
  persistenceScope: 'SESSION' | 'DEVICE' | 'PROJECT';
  positionalAccuracy?: number;
  confidence: number;
  createdAt: string;
  status: DataStatus;
}

interface Landmark {
  id: string;
  type: 'corner' | 'door' | 'pillar' | 'staircase' | 'window' | 'plant_element' | 'other';
  semanticLabel: string;
  confidence: number;
  sourceSessionId: string;
}
```

#### 0.4 — Definizione tipi planimetria (`floorPlan.type.ts`)
```typescript
interface FloorPlan {
  id: string;
  buildingId: string;
  floorId: string;
  imagePath: string;
  scale?: number;           // px per metro
  origin?: { x: number; y: number };
  rotation?: number;        // gradi
  photoMarkers: PhotoMarker[];
}

interface PhotoMarker {
  photoId: string;
  x: number;
  y: number;
  directionAngle?: number;  // angolo freccia in gradi
  confidence: number;
}
```

#### 0.5 — Creazione slice Redux
- `buildingSlice.ts` — CRUD elementi edificio, navigazione gerarchica
- `surveySlice.ts` — gestione sessione, lista foto, osservazioni vocali, stato sessione
- `floorPlanSlice.ts` — planimetria caricata, marker foto
- `spatialAnchorSlice.ts` — anchor e landmark
- `measurementSlice.ts` — misure manuali/laser

#### 0.6 — Registrazione slice nello store
Aggiungere i nuovi slice a `src/store/store.ts`. Il survey slice deve essere persistito con Redux Persist (sessione offline).

---

### FASE 1 — Sessione di Rilievo (UI core)

> Obiettivo: il tecnico puo aprire un rilievo, catturare foto, registrare note vocali, inserire misure.

#### 1.1 — Pagina "Nuovo Rilievo AI" (`SurveyPage.tsx`)
- Accessibile dal menu edificio
- Mostra stato sessione (attiva/in pausa/completata)
- Header minimale con: stato tracking, piano stimato, ambiente stimato, contatore osservazioni
- Bottoni azione: Foto, Voce, Misura, Pausa, Termina
- Layout mobile-first: bottoni grandi, touch-friendly (min 44x44px per WCAG)
- Lazy loading in AppRouting

#### 1.2 — Cattura foto da browser (`useSurveyMedia.ts`)
- Usa `navigator.mediaDevices.getUserMedia()` per accesso camera
- Scatta foto e salva come blob/file
- Al momento dello scatto, cattura:
  - Timestamp
  - Geolocation (se disponibile, via `navigator.geolocation`)
  - Device orientation (se disponibile, via `DeviceOrientationEvent`)
- Genera thumbnail per lista
- Salva in Redux + invio al backend
- Gestione permessi camera con UX chiara (messaggio se negati)
- Componente `CameraCapture.tsx` con preview live e pulsante scatto

#### 1.3 — Registrazione vocale e trascrizione (`useSurveyVoice.ts`)
- Usa `MediaRecorder API` per registrazione audio
- Usa `Web Speech API` (`SpeechRecognition`) per trascrizione in tempo reale
  - Lingua configurabile (it/en/ar) tramite i18n corrente
  - Fallback: invio audio al backend per trascrizione server-side
- Componente `VoiceRecorder.tsx`:
  - Indicatore registrazione attiva (pulsante rosso animato)
  - Testo trascritto in tempo reale
  - Possibilita di correggere la trascrizione
  - Associazione manuale/automatica a un elemento dell'edificio

#### 1.4 — Inserimento misure manuali (`MeasurementInput.tsx`)
- Form semplice: tipo misura, valore, unita, elemento associato
- Select elemento da modello gerarchico edificio (dropdown con ricerca)
- Possibilita di indicare lo strumento usato (manuale, metro, laser)
- Validazione input (numeri positivi, unita coerente)

#### 1.5 — Lista osservazioni della sessione (`SurveyObservationList.tsx`)
- Timeline cronologica di foto, note vocali e misure della sessione
- Ogni item mostra: thumbnail/icona, timestamp, elemento associato, badge confidence
- Filtri: tipo (foto/voce/misura), stato validazione, confidence
- Swipe/click per dettaglio

#### 1.6 — Gestione offline / salvataggio locale
- Redux Persist per sessione attiva
- Queue di upload per quando torna la connessione
- Indicatore stato connessione nell'header sessione
- Service Worker per cache assets critici (opzionale, fase successiva)

---

### FASE 2 — Modello Edificio e Navigazione Gerarchica

> Obiettivo: il tecnico puo navigare e gestire la struttura dell'edificio.

#### 2.1 — Visualizzazione albero edificio (`BuildingTree.tsx`)
- Componente ad albero espandibile/collassabile
- Edificio → Piano → Ambiente → Elementi
- Ogni nodo mostra: label, icona tipo, badge confidence, stato validazione
- Click su nodo: mostra dettaglio + foto/osservazioni associate
- Accessibile: navigazione da tastiera, aria-expanded, ruolo tree

#### 2.2 — Creazione/modifica elementi (`BuildingElementForm.tsx`)
- Form per aggiungere/modificare: Piano, Ambiente, Parete, Porta, Finestra, Impianto, Criticita
- Label leggibile obbligatoria (es. "Cucina", "Parete nord soggiorno")
- Select genitore dall'albero
- Tipo elemento da dropdown
- i18n per tutti i label/placeholder

#### 2.3 — Associazione foto/voce a elementi
- Da dettaglio foto o nota vocale: select/search elemento dall'albero
- Da dettaglio elemento: lista foto e note associate
- Drag & drop (desktop) o select (mobile) per riassociare
- Badge confidence sull'associazione proposta dall'AI

#### 2.4 — Dettaglio elemento (`BuildingElementDetail.tsx`)
- Scheda completa: info, foto associate, note vocali, misure, criticita
- Storico modifiche (chi, quando, da quale stato)
- Stato validazione con possibilita di confermare/rigettare
- Galleria foto con indicatore direzione di presa

---

### FASE 3 — Planimetria e Visualizzazione Spaziale

> Obiettivo: visualizzare foto e dati sulla planimetria dell'edificio.

#### 3.1 — Viewer planimetria (`FloorPlanViewer.tsx`)
- Caricamento immagine planimetria (upload o da backend)
- Pan & zoom (touch + mouse), pinch-to-zoom su mobile
- Libreria consigliata: `react-zoom-pan-pinch` o canvas custom
- Overlay interattivo per marker

#### 3.2 — Marker foto su planimetria
- Ogni foto con posizione nota viene mostrata come marker (cerchio + freccia direzione)
- Click su marker: popup con thumbnail, timestamp, elemento associato
- Colore marker basato su confidence (verde >= 90%, giallo 70-89%, rosso < 70%)
- Possibilita di trascinare marker per correggere posizione manuale

#### 3.3 — Posizionamento manuale foto su planimetria
- Se la posizione non e' nota (no geolocation, no AR), il tecnico puo:
  - Cliccare sulla planimetria per posizionare la foto
  - Indicare la direzione di presa con un secondo click o slider angolo
- Questo produce un PhotoMarker con `confidence` bassa e `dataStatus: 'MANUAL'`

#### 3.4 — Evidenziazione ambienti su planimetria
- Overlay colorato per ambienti riconosciuti/definiti
- Click su ambiente: evidenzia e mostra dettaglio
- Legenda colori per stato (completo, parziale, da rilevare)

#### 3.5 — Visualizzazione 3D point cloud/mesh (futura, opzionale)
- Componente `PointCloudViewer.tsx` con Three.js / `@react-three/fiber`
- Carica dati dal backend (formato PLY/OBJ/glTF)
- Navigazione orbit controls
- Overlay marker foto nella scena 3D
- Nota: questa attivita e' complessa e puo essere rimandata dopo le fasi 1-3

---

### FASE 4 — Confidence, Validazione e Workflow

> Obiettivo: il tecnico valida i dati proposti dall'AI.

#### 4.1 — Sistema badge confidence (`ConfidenceBadge.tsx`)
- Componente riutilizzabile: mostra percentuale con colore
  - Verde (>= 90%): associazione automatica affidabile
  - Giallo (70-89%): da controllare
  - Rosso (< 70%): richiesta conferma
- Tooltip con dettaglio (tipo dato, fonte, motivo)
- Accessibile: `aria-label` descrittivo, non solo colore

#### 4.2 — Pannello validazione sessione (`SurveyValidationPanel.tsx`)
- Lista di tutti i dati PROPOSED della sessione
- Ordinati per confidence (piu bassi prima)
- Per ogni item: Conferma (→ VALIDATED), Correggi (→ modifica + VALIDATED), Rifiuta (→ REJECTED)
- Contatore progressione: "12/35 validati"
- Filtri per tipo dato e fascia confidence

#### 4.3 — Soglie confidence configurabili (`ConfidenceSettings.tsx`)
- Pagina settings (o sezione in settings esistenti)
- Soglie configurabili per tipo: localizzazione, classificazione, misura, criticita
- Default: 90/70 come da specifica
- Salvate in Redux + backend

#### 4.4 — Log di validazione (`ValidationLog`)
- Ogni azione di validazione/rifiuto/correzione viene registrata
- Tracciabilita: chi, quando, da quale valore a quale valore
- Visibile nel dettaglio elemento e nel report sessione

---

### FASE 5 — Integrazione Fascicolo Edifici

> Obiettivo: i dati validati alimentano automaticamente le schede del Fascicolo.

#### 5.1 — Mapping elementi → schede Fascicolo
- Definire la corrispondenza tra elementi del modello edificio e campi delle schede esistenti
- Hook `useFascicoloMapping.ts` che trasforma dati validati in oggetti scheda
- Solo dati con `dataStatus: 'VALIDATED'` vengono proposti per il trasferimento

#### 5.2 — Preview trasferimento dati (`FascicoloPreview.tsx`)
- Prima del trasferimento, mostra una preview di cosa verra scritto nelle schede
- Il tecnico puo escludere singoli dati
- Evidenzia campi che verranno sovrascritti vs nuovi

#### 5.3 — Trasferimento e conferma
- Azione esplicita del tecnico per trasferire
- Feedback di successo/errore per ogni scheda
- Possibilita di annullare (se supportato dal backend)

#### 5.4 — Storico rilievi per edificio
- Lista sessioni di rilievo per edificio, ordinate per data
- Confronto tra sessioni: cosa e' cambiato
- Badge: sessione validata / parzialmente validata / da validare

---

### FASE 6 — Interpretazione Semantica AI (Backend-driven)

> Obiettivo: l'AI propone associazioni e classificazioni. Il frontend le presenta.

#### 6.1 — Richiesta analisi foto al backend
- Dopo scatto foto, invio al backend per analisi AI
- Il backend restituisce: elemento proposto, tipo, criticita, confidence
- Il frontend aggiorna la foto con i dati proposti (`dataStatus: 'PROPOSED'`)

#### 6.2 — Richiesta analisi trascrizione vocale
- Dopo trascrizione, invio testo + contesto (piano, ambiente, foto recenti) al backend
- Il backend restituisce: elemento proposto, tipo osservazione, criticita
- Il frontend mostra la proposta con confidence

#### 6.3 — UI suggerimenti AI (`AISuggestionCard.tsx`)
- Card che mostra il suggerimento dell'AI con:
  - Elemento proposto
  - Tipo (criticita, osservazione, classificazione)
  - Confidence badge
  - Bottoni: Accetta / Modifica / Rifiuta
- Animazione sottile per attirare l'attenzione senza disturbare

#### 6.4 — Feedback loop
- Le correzioni del tecnico vengono inviate al backend come training signal
- Storico correzioni per migliorare il modello nel tempo

---

### FASE 7 — UX Rilievo Attivo (Interfaccia Minimale)

> Obiettivo: durante il sopralluogo l'interfaccia e' minimale e non intrusiva.

#### 7.1 — Modalita rilievo attivo (`SurveyActiveMode.tsx`)
- Schermo quasi interamente dedicato alla camera preview
- Overlay semitrasparente in alto: stato tracking, piano, ambiente, connessione
- Barra azioni in basso: Foto, Voce, Misura (icone grandi, 56x56px minimo)
- Gesture: swipe up per lista osservazioni, swipe down per albero edificio
- Vibrazione haptic al scatto (se supportata)

#### 7.2 — Notifiche contestuali non invasive
- Toast/snackbar per: "Foto associata a Parete Nord (87%)", "Tracking degradato"
- Durata breve (3s), dismissable
- Non bloccare mai il flusso del tecnico

#### 7.3 — Indicatore copertura rilievo
- Mini-mappa o progress bar che mostra quali ambienti sono stati coperti
- Ambienti visitati vs da visitare
- Segnalazione zone a bassa copertura

---

## Riepilogo priorita

| Fase | Nome | Priorita | Dipendenze |
|------|------|----------|------------|
| 0 | Tipi, Slice, Struttura dati | CRITICA | Nessuna |
| 1 | Sessione di Rilievo (UI core) | CRITICA | Fase 0 |
| 2 | Modello Edificio e Navigazione | ALTA | Fase 0 |
| 3 | Planimetria e Visualizzazione | ALTA | Fase 1, 2 |
| 4 | Confidence e Validazione | ALTA | Fase 1 |
| 5 | Integrazione Fascicolo | MEDIA | Fase 2, 4 |
| 6 | Interpretazione AI | MEDIA | Fase 1, 2, backend AI |
| 7 | UX Rilievo Attivo | MEDIA | Fase 1, 3 |

---

## Note tecniche per lo sviluppatore

1. **Web APIs da usare**:
   - `navigator.mediaDevices.getUserMedia()` — camera
   - `navigator.geolocation` — posizione GPS
   - `DeviceOrientationEvent` — orientamento dispositivo (richiede HTTPS + permesso su iOS)
   - `MediaRecorder` — registrazione audio
   - `SpeechRecognition` (Web Speech API) — trascrizione vocale
   - `Vibration API` — feedback haptic

2. **Librerie suggerite** (da valutare):
   - `react-zoom-pan-pinch` — pan/zoom planimetria
   - `@react-three/fiber` + `@react-three/drei` — visualizzazione 3D (fase 3.5)
   - `uuid` — generazione ID persistenti
   - `idb` o `localforage` — storage locale per blob media

3. **Pattern da seguire**:
   - Ogni feature segue la struttura del progetto: `slice/ + hooks/ + api/`
   - Hook incapsula dispatch + selector + API
   - Loading gestito tramite `useEffect` nei componenti
   - Errori gestiti con `useAlert()` esistente
   - Modali con `useModalDialog()` esistente
   - Tutte le stringhe via `useTranslation()` in it/en/ar

4. **Accessibilita (WCAG 3.0)**:
   - Target touch minimo 44x44px
   - Contrasti colore sufficienti (non basarsi solo sul colore per confidence)
   - `aria-label` su tutti i bottoni icona
   - Focus management nei modali e pannelli
   - Screen reader: annunci live per cambio stato (aria-live)
   - Navigazione da tastiera per albero edificio e planimetria
   - `prefers-reduced-motion` per animazioni

5. **Offline-first**:
   - Redux Persist per sessione e dati critici
   - Queue upload con retry automatico
   - Indicatore stato connessione sempre visibile durante rilievo
