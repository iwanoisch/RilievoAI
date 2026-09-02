# MODULO RILIEVO AI - FASE 1

## Rilievo tecnico guidato da tavole, immagini e interazione dell'operatore

### Obiettivo
L'operatore indica al sistema l'elemento che sta rilevando. L'AI interpreta ciò che vede, chiede ciò che manca, registra le misure e compila in tempo reale il Fascicolo Edifici.
NON localizzazione autonoma del tecnico. L'operatore dice al sistema dove sta guardando.

### Principio architetturale
- OGGI: il tecnico dice all'AI dove sta guardando
- DOMANI: sarà il sistema a capirlo da solo
- TUTTO quello che viene dopo DEVE restare identico

---

## Flusso operativo

```
TAVOLE DI PROGETTO → AI CREA MAPPA EDIFICIO → OPERATORE SELEZIONA ELEMENTO → FOTO/MISURE/VOCE → AI RICONOSCE E CHIEDE → COMPILAZIONE FASCICOLO IN TEMPO REALE
```

---

## 1. Pre-rilievo: tavole → mappa interattiva

L'AI trasforma le tavole (PDF/immagini) in un modello navigabile, verificato dall'operatore.

### Gerarchia elementi

| Livello | Esempio | Funzione |
|---------|---------|----------|
| Edificio | Lotto 5 | Contenitore principale |
| Piano | PT | Organizzazione verticale |
| Ambiente | Pranzo-Soggiorno | Zona selezionabile sul tablet |
| Parete | W01, W02, W03... | Superficie di rilievo |
| Apertura | D01 / F01 | Porta o finestra (desumibile dalla tavola) |
| Elemento rilevato | AC01 / R01 / E01... | Oggetto scoperto durante il sopralluogo |

Prima del sopralluogo il tecnico può correggere la proposta AI: unire/dividere ambienti, rinominare pareti, correggere aperture, aggiungere elementi noti.

---

## 2. Interfaccia tablet durante il sopralluogo

Schermata principale = pianta del piano + stato di avanzamento.

- **Tocco ambiente**: entra nel contesto dell'ambiente
- **Tocco parete**: imposta quella parete come elemento attivo
- **Tocco porta/finestra**: apre il rilievo di quell'elemento
- **Tocco oggetto riconosciuto in foto**: crea/seleziona l'oggetto
- **Colore/stato elemento**: non rilevato, in corso, da verificare, completo

---

## 3. Riconoscimento dalla fotografia

| Categoria | Esempi | Azione AI |
|-----------|--------|-----------|
| Aperture | porta, finestra, portafinestra | confronta con tavola; crea difformità se necessario |
| Impianto termico | radiatore, termoarredo, split | crea elemento impiantistico; chiede dati mancanti |
| Elettrico | presa, interruttore, comando, scatola | conteggia/localizza; collega alla parete |
| Degrado | umidità, fessura, distacco, muffa | crea criticità; richiede dettaglio |
| Finiture | intonaco, rivestimento, battiscopa | propone classificazione |
| Altro | elemento non classificato | mantiene oggetto generico e chiede conferma |

---

## 4. L'AI deve sapere chiedere ciò che manca

| Situazione | Richiesta possibile dell'AI |
|------------|---------------------------|
| Possibile umidità | Fotografa più da vicino l'area evidenziata |
| Split riconosciuto | Fotografa la targhetta tecnica |
| Porta senza dimensioni | Inserisci larghezza e altezza della porta |
| Finestra parzialmente visibile | Fai una foto frontale dell'intero serramento |
| Parete senza quota | Inserisci lunghezza e altezza della parete |
| Elemento ambiguo | Conferma: radiatore / fan-coil / altro |

---

## 5. Misure contestuali

Ogni misura legata a un oggetto o relazione geometrica. Mai un numero privo di contesto.

| Interazione | Dato registrato |
|-------------|----------------|
| Tocco W03 + misura | lunghezza/altezza parete |
| Tocco D01 + misura | larghezza/altezza porta |
| Tocco spigolo SX + bordo D01 | distanza porta dallo spigolo |
| Tocco F01 + davanzale | quota davanzale |
| Tocco AC01 + spigolo DX | distanza split dallo spigolo |
| Tocco R01 + pavimento | quota/distanza radiatore |

Sorgente misura: MANUAL | VOICE | LASER | AI_ESTIMATE

### Modello misura
```
measurement_id
source_element_id
target_element_id (opzionale)
measurement_type
value
unit
source = MANUAL | VOICE | LASER | AI_ESTIMATE
timestamp
operator_id
confidence / validation_state
```

---

## 6. Controllo automatico di congruenza

Quando dispone di lunghezza totale e quote parziali, l'AI verifica la coerenza geometrica.

```
Parete W03 = 4,20 m
0,80 m + porta 0,90 m + 1,10 m + finestra 1,00 m + 0,40 m = 4,20 m → COERENTE
Se la somma fosse 3,85 m → segnala 0,35 m non risolti → chiede quale quota verificare
```

---

## 7. Provenienza del dato

| Stato | Significato |
|-------|------------|
| DA PROGETTO | estratto da pianta/prospetto/sezione |
| RILEVATO AI | riconosciuto dall'immagine o da altro input AI |
| DICHIARATO OPERATORE | inserito/dettato dal tecnico |
| MISURATO | misura strumentale o manuale esplicita |
| DESUNTO | calcolato da altri dati |
| DA VERIFICARE | dato incerto o incongruente |
| VALIDATO | confermato dal tecnico |

---

## 8. Compilazione Fascicolo in tempo reale

Le schede del Fascicolo = checklist interna dell'AI, NON interfaccia primaria.

| Evento sul posto | Aggiornamento automatico |
|-----------------|------------------------|
| Selezione W03 | apre contesto parete/ambiente |
| Foto generale | archivia immagine e avvia riconoscimento |
| Riconosciuta finestra | aggiorna elemento serramento e relazione con W03 |
| Riconosciuto split | aggiorna impianto di climatizzazione |
| Possibile umidità | crea criticità provvisoria |
| Foto dettaglio umidità | integra documentazione della criticità |
| Misura porta | aggiorna geometria apertura |
| Conferma tecnico | porta il dato a VALIDATO |

---

## 9. Priorità di sviluppo

1. Import tavola raster/PDF e visualizzazione sul tablet
2. Creazione/modifica di piani, ambienti, pareti e aperture con ID persistenti
3. Selezione dell'elemento tramite tap
4. Acquisizione foto collegata automaticamente all'elemento attivo
5. Servizio AI che restituisce oggetti/criticità proposti con confidence
6. Conferma/correzione rapida degli oggetti riconosciuti
7. Acquisizione di misure contestuali tra elementi
8. Motore di regole che individua i campi mancanti e genera richieste
9. Scrittura dei dati nel modello del Fascicolo con provenienza e stato di validazione
10. Indicatore di completezza per ambiente/parete/elemento

---

## 10. Cosa NON fare nella Fase 1

- Localizzazione indoor autonoma del tecnico
- SLAM proprietario
- Nuvola di punti obbligatoria
- Riconoscimento automatico della posizione della camera nell'edificio
- Rilievo metrico automatico completo
- Digital twin completo
- Automazione senza possibilità di conferma/correzione del tecnico

---

## 11. Acceptance test

| Test | Esito atteso |
|------|-------------|
| Caricamento tavola | l'operatore vede il piano e può selezionare un ambiente |
| Mappa | almeno 1 ambiente con 4 pareti e aperture modificabili |
| Tap W03 | W03 diventa elemento attivo senza navigare altre schede |
| Foto | la foto viene salvata con room_id e wall_id corretti |
| AI | restituisce una lista di elementi proposti e confidence |
| Misura | è possibile registrare una distanza tra due riferimenti |
| Richiesta guidata | il sistema formula almeno una richiesta sulla base di un campo mancante |
| Fascicolo | il dato confermato compare nella scheda corretta |
| Audit | ogni dato conserva sorgente, data e stato |

---

## Stato attuale del progetto

### Cosa esiste e si riutilizza come base
- `/buildings` — Gestione edifici (CRUD, dettaglio, immagine)
- `/buildings/:id` — Dettaglio edificio con card info + tab (placeholder planimetria)

### Cosa esiste nel POC (`/poc`) come spunto/riferimento
- Planimetria: upload PDF/immagine, viewer zoom/pan, marker
- Servizio AI con swap mock/reale
- Modello edificio gerarchico
- Foto collegate a elementi, confidence, validazione
- Misure con tipo/valore/unità

Il POC resta separato. La Fase 1 si costruisce da zero dentro `/buildings/:id`, usando il POC solo come riferimento architetturale.

---

## Caso pilota
Edificio monofamiliare Lotto 5, Area 24 - Via Coccola / Via Tagliamento.
Piano terra, piano primo e copertura.
Ambiente dimostrativo: pranzo-soggiorno PT (42,50 m², H 270 cm).
