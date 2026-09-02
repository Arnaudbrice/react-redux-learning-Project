# React Redux + TypeScript Lernprojekt

Dieses Projekt dient dazu, Redux Toolkit mit React und TypeScript Schritt für Schritt praktisch zu lernen.

Die Anwendung ist eine Todo-App, deren State ursprünglich mit lokalem React-`useState` verwaltet wurde. Der Todo-State wurde anschließend schrittweise zu Redux Toolkit migriert.

---

# app/

Hier befindet sich die allgemeine Redux-Konfiguration.

## `store.ts` ✅

Gelernt und umgesetzt:

- `configureStore()`
- zentraler Redux Store
- Reducer im Store registrieren
- Store-Key `todos`
- `RootState`
- `AppDispatch`

Beispiel:

```ts
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Wichtig

`RootState` beschreibt den Typ des gesamten Redux-States.

`AppDispatch` beschreibt den Typ der `dispatch`-Funktion unseres Stores.

---

## `hooks.ts` ✅

Typisierte Redux Hooks erstellt:

- `useAppSelector`
- `useAppDispatch`

Dadurch müssen `useSelector` und `useDispatch` nicht in jeder Komponente erneut typisiert werden.

---

# Redux Provider ✅

Der Redux Store wurde mit dem `Provider` für die React-Komponenten verfügbar gemacht.

```tsx
<Provider store={store}>
  <App />
</Provider>
```

---

# features/todos/

Hier befindet sich die Redux-Logik für die Todos.

## `todoSlice.ts` ✅

Gelernt:

- `createSlice()`
- `name`
- `initialState`
- `reducers`
- automatisch generierte Action Creator
- `PayloadAction<T>`
- Immer.js

Aktueller State:

```ts
type TodoStateType = {
  items: Todo[];
  filter: Filter;
};
```

Der Slice verwaltet damit sowohl die Todos als auch den aktuell ausgewählten Filter.

---

# Todo Actions ✅

## `addTodo`

Fügt ein neues Todo hinzu.

```text
dispatch(addTodo(title))
→ Action
→ Reducer
→ neues Todo im Store
```

## `toggleTodo`

Ändert den `completed`-Status eines Todos.

## `deleteTodo`

Löscht ein einzelnes Todo anhand seiner ID.

## `clearTodos`

Löscht alle Todos.

## `setFilter`

Ändert den aktuellen Todo-Filter.

Mögliche Filter:

```ts
"Alle" | "Offen" | "Erledigt";
```

---

# Redux Datenfluss ✅

Grundlegender Ablauf:

```text
Component
   ↓
Action Creator
   ↓
Action
   ↓
dispatch(action)
   ↓
Redux Store
   ↓
Reducer
   ↓
neuer State
   ↓
useAppSelector
   ↓
Component rendert neu
```

Beispiel:

```ts
dispatch(addTodo("TypeScript lernen"));
```

Der Action Creator erzeugt ungefähr:

```ts
{
  type: "todoList/addTodo",
  payload: "TypeScript lernen"
}
```

Der Reducer verarbeitet die Action und Redux aktualisiert anschließend den Store-State.

---

# TodoList ✅

Die `TodoList` bekommt die Todos nicht mehr über Props.

Stattdessen werden die Daten direkt aus Redux gelesen:

```ts
const todos = useAppSelector((state) => state.todos.items);
const filter = useAppSelector((state) => state.todos.filter);
```

Actions werden mit dem typisierten Dispatch ausgelöst:

```ts
const dispatch = useAppDispatch();
```

Beispiele:

```ts
dispatch(toggleTodo(todo.id));
dispatch(deleteTodo(todo.id));
dispatch(clearTodos());
```

---

# Todo Filter ✅

Die Todo-App besitzt drei Filter:

```text
Alle
Offen
Erledigt
```

Der ausgewählte Filter wird im Redux Store gespeichert.

Die sichtbaren Todos werden aus `todos` und `filter` berechnet:

```text
todos + filter
      ↓
filteredTodos
```

`filteredTodos` ist **Derived State (abgeleiteter State)**.

Er muss deshalb nicht zusätzlich im Redux Store gespeichert werden.

---

# Aktiver Filter ✅

Der Redux-State beeinflusst auch die Darstellung der Benutzeroberfläche.

Beispiel:

```tsx
className={filter === "Offen" ? "active-filter" : ""}
```

Dadurch bleibt der aktuell ausgewählte Filter sichtbar.

---

# Nächster Schritt ⏭️

## Ticket: Selector-Funktionen

Als Nächstes erstellen wir:

```text
src/features/todos/todoSelectors.ts
```

Dabei lernen wir Redux Selector-Funktionen.

Geplant:

```ts
const selectTodos = (state: RootState) => state.todos.items;
```

Ein Selector:

- bekommt den Redux-State
- liest einen bestimmten Bereich daraus
- verändert den State nicht
- gibt die ausgewählten Daten zurück

Danach können wir statt:

```ts
useAppSelector((state) => state.todos.items);
```

einen wiederverwendbaren Selector verwenden:

```ts
useAppSelector(selectTodos);
```

**Hier geht es beim nächsten Mal weiter.**
