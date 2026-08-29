---
name: translate
description: Aggiunge traduzioni per una nuova chiave in tutte le lingue
allowed-tools: Read, Edit, Write
argument-hint: "<chiave> <testo_italiano>"
---

# Aggiungi Traduzione

Aggiungi una nuova chiave di traduzione in tutte le lingue supportate.

## Argomenti

- `$0` - Chiave di traduzione (es. `projects.newButton`)
- `$1` - Testo in italiano

## File da Modificare

1. `/public/locales/it/translation.json` - Italiano (usa il testo fornito)
2. `/public/locales/en/translation.json` - Inglese (traduci)
3. `/public/locales/ar/translation.json` - Arabo (traduci)

## Passi

1. Leggi i tre file di traduzione
2. Aggiungi la chiave con il valore appropriato in ogni lingua
3. Mantieni la struttura JSON esistente
4. Usa chiavi gerarchiche (es. `projects.create` non `projectsCreate`)

## Esempio

```
/translate projects.confirmDelete "Sei sicuro di voler eliminare?"
```

Risultato:
- IT: "Sei sicuro di voler eliminare?"
- EN: "Are you sure you want to delete?"
- AR: "هل أنت متأكد أنك تريد الحذف؟"
