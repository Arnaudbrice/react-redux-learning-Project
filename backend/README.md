# Backend

## Schritt A – Backend-Ordner erstellen

```bash
mkdir backend
cd backend
npm init -y
```

## Schritt B – Express, cors, dotenv und zod installieren

```bash
npm install express cors dotenv zod
```

## Schritt C – TypeScript-Werkzeuge installieren

```bash
npm install -D typescript tsx @types/node @types/express @types/cors
```

> typescript und tsx sind Entwicklungswerkzeuge (dev dependencies)

## Schritt D – TypeScript vorbereiten

```js
npm pkg set type=module
npx tsc --init //erstellst tsconfig.json-Datei
mkdir src
```

Merksatz:

- target → Welche JavaScript-Version wird erzeugt?
- module → Welches Modulsystem wird verwendet?
- moduleResolution → Wie werden Imports gefunden?

## Was haben wir installiert?

| Paket          | Aufgabe                                              |
| -------------- | ---------------------------------------------------- |
| express        | HTTP-API erstellen                                   |
| typescript     | Typprüfung und Kompilierung                          |
| tsx            | TypeScript-Dateien während der Entwicklung ausführen |
| @types/node    | Typen für Node.js                                    |
| @types/express | Typen für Express                                    |

## Projekt-Struktur

Bei unserem PERN-Projekt übernimmt jede Technologie eine bestimmte Aufgabe:

| Technologie          | Aufgabe                      |
| -------------------- | ---------------------------- |
| React + TypeScript   | Benutzeroberfläche           |
| Express + TypeScript | REST-API                     |
| PostgreSQL           | Daten speichern              |
| Sequelize            | Kommunikation mit PostgreSQL |

## supertest integration test

- wir trennen app.ts und index.ts, damit wir app.ts direkt mit Supertest testen können, ohne einen festen Port zu öffnen.
- Echter HTTP-Test gegen unsere Express-Anwendung ausführen, ohne sie vorher auf Port 5000 starten zu müssen

```bash
npm install -D vitest supertest @types/supertest

npm install -D @vitest/ui@5.1.1 @vitest/coverage-v8@5.1.1
```
