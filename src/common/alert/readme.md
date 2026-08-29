# Alert

### How to use alert

Import in your component alert hook
```js
const { showDialog, hideModalDialog, hideAllModalsDialog } = useAlert();
```

if duration is equal to 0 
alert persist until user done something

Here some example:

```js
showDialog({
type: 'warning',
title: 'Attenzione',
message: 'Stai per eseguire un\'operazione critica.',
duration: 0,
link: {
text: 'Annulla',
onClick: () => console.log('Operazione annullata'),
},
});

showDialog({
  type: 'error',
  title: 'Campo obbligatorio',
  message: 'Inserisci un indirizzo email valido.',
  position: 'top-center'
});


showDialog({
type: 'warning',
message: 'Elaborazione in corso...',
duration: 2500
});

showDialog({
type: 'success',
message: 'Processo completato!',
duration: 3000
});

showDialog({
type: 'info',
message: 'Inizio processo...',
duration: 2000
});


<button
    className="bg-yellow-400 text-white px-4 py-2 rounded"
    onClick={() => showDialog({
      type: 'warning',
      message: 'Bottom Right',
      position: 'bottom-right'
    })}
>
  Bottom Right
</button>


<button
    className="bg-red-400 text-white px-4 py-2 rounded"
    onClick={() => showDialog({
      type: 'error',
      message: 'Bottom Center',
      position: 'bottom-center'
    })}
>
  Bottom Center
</button>



```
### Complex Component Alert

function ManualCloseExample() {
const { showDialog, hideModalDialog } = useAlert();
const [alertId, setAlertId] = useState<string | null>(null);

const showPersistentAlert = () => {
const id = showDialog({
type: 'info',
title: 'Notifica importante',
message: 'Leggi attentamente queste informazioni.',
duration: 0 // No auto-close
});
setAlertId(id);
};

const closeAlert = () => {
if (alertId) {
hideModalDialog(alertId);
setAlertId(null);
}
};

```js
return (
<div className="space-y-4 p-4">
<button
className="bg-indigo-500 text-white px-4 py-2 rounded"
onClick={showPersistentAlert}
>
Mostra Alert Persistente
</button>

      <button
        className="bg-pink-500 text-white px-4 py-2 rounded"
        onClick={closeAlert}
        disabled={!alertId}
      >
        Chiudi Alert Manualmente
      </button>
    </div>
);
}
```


Exempio avanzato
```js

function AdvancedExamples() {
const { showDialog, hideAllModalsDialog } = useAlert();

const showComplexAlert = () => {
const alertId = showDialog({
type: 'error',
title: 'Errore di connessione',
message: 'Impossibile connettersi al server.',
duration: 0, // Persistente
link: {
text: 'Riprova',
onClick: () => {
console.log('Tentativo di riconnessione...');
// Qui potresti aggiungere la logica di riconnessione
hideAllModalsDialog();
showDialog({
type: 'info',
message: 'Connessione in corso...'
});
}
}
});
};

return (
<div className="space-y-4 p-4">
{/* Alert con azione personalizzata */}
<button
className="bg-red-500 text-white px-4 py-2 rounded"
onClick={showComplexAlert}
>
Mostra Errore con Riprova
</button>

      {/* Pulsante per chiudere tutti gli alert */}
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={hideAllModalsDialog}
      >
        Chiudi Tutti gli Alert
      </button>
    </div>
);
}
```
### Altro esempio di doppio pulsante esempio per dire ok oppure annulla.
```js
const handleDelete = (id: number) => {
// if (window.confirm('Sei sicuro di voler eliminare questa attività?')) {
//     setActivities(prev => prev.filter(activities => activities.id !== id));
// }
const alertId =  showDialog({
type: 'warning',
title: 'Attenzione',
message: 'Stai per eseguire un\'operazione critica.',
duration: 0,
links: [
{
text: 'Annulla',
onClick: () => hideModalDialog(alertId),
variant: 'secondary'
},
{
text: 'Conferma',
onClick: () => {
hideModalDialog(alertId);
setActivities(prev => prev.filter(activity => activity.id !== id))
},
variant: 'primary'
}
]
});
};
```
