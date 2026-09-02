# React Redux + TypeScript – Lernprojekt

## Ausgangssituation

Die Todo-App funktioniert zunächst nur mit `useState` in `App.tsx`.

Das ist Absicht.

Wir werden genau diesen State Schritt für Schritt nach Redux migrieren. Dadurch lernst du nicht nur Syntax, sondern verstehst, warum Redux überhaupt gebraucht wird.

## Lernpfad

### Ticket 1.1 – Store verstehen
- Was ist globaler State?
- Was ist der Redux Store?
- `configureStore()`
- `RootState`
- `AppDispatch`

### Ticket 1.2 – Provider
- `<Provider>`
- Warum React ohne Provider den Store nicht kennt

### Ticket 1.3 – Todo Slice
- `createSlice()`
- `initialState`
- Reducer
- automatisch erzeugte Actions

### Ticket 1.4 – State lesen
- `useSelector()`
- Selector
- `RootState`

### Ticket 1.5 – Actions auslösen
- `useDispatch()`
- `dispatch()`
- `PayloadAction<string>`

### Ticket 1.6 – Typed Hooks
- `useAppDispatch()`
- `useAppSelector()`
- warum sie in TypeScript sinnvoll sind

### Ticket 1.7 – Todo hinzufügen
- Action mit Payload
- Redux-State ändern

### Ticket 1.8 – Todo erledigen
- ID als Payload
- passenden Eintrag im State finden

### Ticket 1.9 – Todo löschen
- Reducer mit `filter()`

### Ticket 2.0 – Architektur verstehen
Am Ende zeichnen wir den kompletten Datenfluss:

Component -> dispatch(Action) -> Reducer -> Store -> Selector -> Component

## Wichtig

Nicht mehrere Tickets gleichzeitig lösen. Starte mit Ticket 1.1 und lass deinen Code nach jedem Ticket überprüfen.
