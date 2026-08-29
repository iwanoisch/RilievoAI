# FileUploader Component

Un componente React TypeScript moderno e accattivante per il caricamento di file, con supporto drag & drop nativo, design mobile-first e interfaccia completamente personalizzabile.

## ✨ Caratteristiche

- 📱 **Mobile-first design** con supporto completo desktop
- 🖱️ **Drag & drop nativo** con feedback visivo animato
- 📁 **Upload multiplo** con gestione avanzata
- 🎨 **Design moderno** con animazioni fluide
- 🔧 **Completamente configurabile**
- ♿ **Accessibile** con supporto screen reader
- 🚫 **Validazione integrata** con messaggi di errore
- 📊 **Preview file** con icone colorate per tipo
- 🌐 **Zero dipendenze** esterne (solo React + Tailwind)

## 📦 Installazione

Il componente richiede solo React e Tailwind CSS (già presenti nel tuo progetto):

```bash
# Non sono necessarie dipendenze aggiuntive!
# Il componente usa solo le API HTML5 native
```

## 🚀 Utilizzo Base

### Esempio Semplice
```tsx
import FileUploader from './components/FileUploader';

function MyComponent() {
  const handleFilesSelected = (files: File[]) => {
    console.log('File selezionati:', files);
  };

  return (
    <FileUploader 
      onFilesSelected={handleFilesSelected}
    />
  );
}
```

### Con Upload
```tsx
import FileUploader from './components/FileUploader';

function MyComponent() {
  const handleUpload = async (files: File[]): Promise<void> => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload fallito');
    }
  };

  return (
    <FileUploader 
      onFilesSelected={(files) => console.log('Selezionati:', files)}
      onUpload={handleUpload}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024} // 10MB
    />
  );
}
```

## 📋 Props API

| Prop | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| `onFilesSelected` | `(files: File[]) => void` | `undefined` | Callback chiamata quando vengono selezionati file |
| `onUpload` | `(files: File[]) => Promise<void>` | `undefined` | Funzione async per gestire l'upload. Se omessa, il pulsante "Carica" non viene mostrato |
| `maxFiles` | `number` | `10` | Numero massimo di file selezionabili |
| `maxFileSize` | `number` | `52428800` | Dimensione massima per file in bytes (default: 50MB) |
| `className` | `string` | `''` | Classi CSS aggiuntive per il contenitore principale |

## 🎨 Esempi Avanzati

### Upload con Progress e Error Handling
```tsx
function AdvancedUploader() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: File[]): Promise<void> => {
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err; // Rilanciamo per far apparire l'errore nel componente
    }
  };

  return (
    <div>
      <FileUploader 
        onUpload={handleUpload}
        maxFiles={3}
        maxFileSize={5 * 1024 * 1024} // 5MB
        className="border-2 border-dashed border-blue-300"
      />
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Errore: {error}
        </div>
      )}
    </div>
  );
}
```

### Con Redux/Context
```tsx
import { useAppDispatch } from './store/hooks';
import { uploadFiles } from './store/fileSlice';

function ReduxUploader() {
  const dispatch = useAppDispatch();

  const handleUpload = async (files: File[]): Promise<void> => {
    const result = await dispatch(uploadFiles(files));
    
    if (uploadFiles.rejected.match(result)) {
      throw new Error(result.error.message || 'Upload failed');
    }
  };

  return (
    <FileUploader 
      onUpload={handleUpload}
      onFilesSelected={(files) => {
        // Opzionale: salva i file nello state locale
        console.log('Files ready for upload:', files);
      }}
    />
  );
}
```

### Filtro per Tipi di File
```tsx
function ImageUploader() {
  const handleFilesSelected = (files: File[]) => {
    // Filtra solo immagini
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length !== files.length) {
      alert('Solo file immagine sono consentiti!');
    }
    
    console.log('Immagini selezionate:', imageFiles);
  };

  return (
    <FileUploader 
      onFilesSelected={handleFilesSelected}
      maxFiles={10}
      maxFileSize={2 * 1024 * 1024} // 2MB per immagini
    />
  );
}
```

## 🎯 Funzionalità

### Drag & Drop
- **Nativo HTML5**: Non richiede librerie esterne
- **Feedback visivo**: Animazioni e cambio colori durante il drag
- **Multi-file**: Supporta selezione multipla
- **Validazione**: Controlli automatici su dimensione e numero file

### Preview File
- **Icone colorate**: Diverse per ogni tipo di file (PDF, DOC, IMG, ecc.)
- **Informazioni file**: Nome e dimensione
- **Rimozione singola**: Pulsante X per rimuovere file specifici
- **Layout responsive**: Griglia che si adatta al dispositivo

### Gestione Errori
- **Validazione automatica**: Dimensione e numero file
- **Messaggi chiari**: Errori mostrati in italiano
- **Recovery**: Possibilità di riprovare l'upload

## 🎨 Personalizzazione Stile

### CSS Classes Principali
Il componente usa Tailwind CSS con le seguenti classi principali che puoi sovrascrivere:

```css
/* Contenitore dropzone */
.dropzone-container {
  /* border-2 border-dashed rounded-2xl */
}

/* Stati drag attivo */
.dropzone-active {
  /* border-blue-400 bg-blue-50 scale-[1.02] */
}

/* File card */
.file-card {
  /* bg-white border border-gray-200 rounded-xl */
}
```

### Personalizzazione con className
```tsx
<FileUploader 
  className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl"
  // ... altre props
/>
```

## 🔧 Tipi di File Supportati

Il componente supporta **tutti i tipi di file** e mostra icone specifiche per:

| Tipo | Estensioni | Colore |
|------|------------|--------|
| PDF | `.pdf` | Rosso |
| Documenti | `.doc`, `.docx` | Blu |
| Fogli calcolo | `.xls`, `.xlsx` | Verde |
| Immagini | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` | Viola |
| Video | `.mp4`, `.avi`, `.mov` | Giallo |
| Archivi | `.zip`, `.rar`, `.7z` | Grigio |
| Altri | Tutti gli altri | Slate |

## 📱 Responsive Design

Il componente è ottimizzato per tutti i dispositivi:

- **Mobile (< 640px)**: Layout verticale, touch-friendly
- **Tablet (640px - 1024px)**: Griglia 2 colonne per file
- **Desktop (> 1024px)**: Griglia 3 colonne, hover effects

## ♿ Accessibilità

- **Screen reader**: Label ARIA appropriati
- **Navigazione tastiera**: Focus management corretto
- **Contrasti**: Colori conformi WCAG
- **Input nascosto**: Ma accessibile per screen reader

## 🐛 Troubleshooting

### File non vengono caricati
```tsx
// Verifica che onUpload sia una Promise
const handleUpload = async (files: File[]): Promise<void> => {
  // Deve essere async e restituire Promise<void>
  await fetch('/api/upload', { method: 'POST', body: formData });
};
```

### Errori di validazione
```tsx
// Controlla i limiti
<FileUploader 
  maxFiles={5} // Numero massimo
  maxFileSize={10 * 1024 * 1024} // 10MB in bytes
/>
```

### Styling non funziona
```tsx
// Assicurati che Tailwind CSS sia configurato nel progetto
// Il componente richiede Tailwind per funzionare correttamente
```

## 📄 Licenza

Questo componente è fornito come esempio e può essere liberamente modificato e utilizzato nei tuoi progetti.

## 🤝 Contributi

Per miglioramenti o bug report, sentiti libero di:
1. Modificare il componente secondo le tue esigenze
2. Condividere feedback e suggerimenti
3. Estendere le funzionalità

## 📚 Esempi Completi

Per esempi più dettagliati e casi d'uso avanzati, consulta il file `FileUploaderExamples.tsx` incluso nel progetto.

---

**Creato con ❤️ per una gestione file moderna e intuitiva**
