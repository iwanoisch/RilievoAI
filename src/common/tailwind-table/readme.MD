
# 🧩 TailwindTable Component

![React](https://img.shields.io/badge/react-18.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.0.0-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-007ACC)
![License](https://img.shields.io/badge/license-MIT-green)

> Un componente tabella altamente personalizzabile e responsive costruito con **React** e **Tailwind CSS**, con supporto per **ordinamento**, **colonne configurabili** e **scroll controllato**.

---

## 📚 Indice

- [Installazione](#installazione)
- [Utilizzo Base](#utilizzo-base)
- [Props](#props)
    - [Props Principali](#props-principali)
    - [Column Definition](#column-definition)
- [Ordinamento](#ordinamento)
    - [Configurazione Ordinamento](#configurazione-ordinamento)
    - [Ordinamento Personalizzato](#ordinamento-personalizzato)
- [Esempi Avanzati](#esempi-avanzati)
- [Personalizzazione](#personalizzazione)
- [Note Tecniche](#note-tecniche)

---

## ⚙️ Installazione

Assicurati di avere le dipendenze necessarie:

```bash
npm install react heroicons
```

Importa il componente:

```tsx
import { TailwindTable } from './components/TailwindTable';
```

## 🚀 Utilizzo Base

```tsx
const data = [
  { id: 1, name: 'Progetto Alpha', status: 'Attivo', dueDate: '2023-12-31' },
  { id: 2, name: 'Progetto Beta', status: 'Completato', dueDate: '2023-06-15' }
];

const columns = [
  {
    key: 'name',
    header: 'Nome Progetto',
    sortable: true,
    render: (item) => <span className="font-medium">{item.name}</span>
  },
  {
    key: 'status',
    header: 'Stato',
    render: (item) => (
      <span className={`badge-${item.status.toLowerCase()}`}>
        {item.status}
      </span>
    )
  }
];

function MyComponent() {
  return (
    <TailwindTable
      data={data}
      columns={columns}
      maxHeight="400px"
    />
  );
}
```

## 🧾 Props

### Props Principali

| Prop           | Tipo             | Default                     | Descrizione                                      |
|----------------|------------------|-----------------------------|--------------------------------------------------|
| `data`         | `T[]`            | Obbligatorio                | Array di oggetti da visualizzare                 |
| `columns`      | `ColumnDefinition`| Obbligatorio               | Configurazione colonne                           |
| `maxHeight`    | `string`         | `"500px"`                   | Altezza massima della tabella con scroll        |
| `enableSorting`| `boolean`        | `true`                      | Abilita/disabilita l'ordinamento globale        |
| `emptyMessage` | `string | ReactNode` | `"Nessun dato disponibile"` | Messaggio da mostrare se non ci sono dati       |

### Column Definition

```ts
interface ColumnDefinition<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  sortKey?: string;
  defaultSortDirection?: 'asc' | 'desc' | null;
  render: (item: T) => React.ReactNode;
}
```

## 🔃 Ordinamento

### Configurazione Ordinamento

```tsx
const columns = [
  {
    key: 'dueDate',
    header: 'Scadenza',
    sortable: true,
    defaultSortDirection: 'desc',
    render: (item) => formatDate(item.dueDate)
  }
];

const columnsSecond = [
  {
    key: 'title',
    header: 'Titolo',
    width: 'col-span-2',
    sortable: true, // Attiva l'ordinamento per questa colonna
    sortKey: 'status', // Opzionale: specifica un campo diverso per l'ordinamento
    defaultSortDirection: 'asc', // Opzionale: direzione predefinita
    render: (item) => formatDate(item.dueDate)
  }
];
```

### Ordinamento Personalizzato

```tsx
{
  key: 'status',
  sortKey: 'statusPriority',
  sortable: true,
  render: (item) => item.status
}
```

Ordinamento esterno:

```tsx
function ParentComponent() {
  const [sortedData, setSortedData] = useState(data);

  const customSort = (key, direction) => {
    const sorted = [...data].sort((a, b) => {
      // Logica personalizzata
    });
    setSortedData(sorted);
  };

  return (
    <TailwindTable
      data={sortedData}
      columns={columns}
      enableSorting={false}
    />
  );
}
```

## 💡 Esempi Avanzati

### Colonne complesse

```tsx
const columns = [
  {
    key: 'user',
    header: 'Utente',
    render: (item) => (
      <div className="flex items-center">
        <Avatar src={item.avatar} />
        <span className="ml-2">{item.name}</span>
      </div>
    )
  },
  {
    key: 'progress',
    header: 'Progresso',
    render: (item) => (
      <ProgressBar value={item.percentComplete} />
    )
  }
];
```

### Colonna Azioni

```tsx
{
  key: 'actions',
  header: 'Azioni',
  render: (item) => (
    <div className="flex space-x-2">
      <Button onClick={() => editItem(item.id)}>
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button onClick={() => deleteItem(item.id)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

## 🎨 Personalizzazione

### Stili Intestazione

```tsx
<TailwindTable
  headerClassName="bg-indigo-100 text-indigo-800"
  textHeaderColor="text-indigo-800"
/>
```

### Stili Righe

```tsx
<TailwindTable
  rowClassName="hover:bg-gray-50 even:bg-gray-50"
/>
```

### Messaggio Vuoto Personalizzato

```tsx
<TailwindTable
  emptyMessage={
    <div className="text-center py-8">
      <p>Nessun risultato trovato</p>
      <Button onClick={refreshData}>Ricarica</Button>
    </div>
  }
/>
```

## 🛠 Note Tecniche

- **Performance**: usa `React.memo` per ottimizzare il rendering
- **Accessibilità**: include attributi ARIA
- **Responsive**: scroll orizzontale su mobile
- **Dipendenze**: richiede `Heroicons` per le icone

```ts
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
```

### Type Safety

```ts
interface MyDataType {
  id: string;
  name: string;
}

<TailwindTable<MyDataType> 
  data={data} 
  columns={columns} 
/>
```

---

## 📷 Anteprima

> Puoi includere qui uno screenshot del componente in uso:

![Esempio Tabella](https://via.placeholder.com/800x300.png?text=TailwindTable+Preview)
