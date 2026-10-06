# Bil Arbejdsplaner

A small React + Vite single-page app for creating and following automotive workshop workplans.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Notes and data

Use the **Noter** section to create and edit short notes. Workplans and notes are
saved in this browser's local storage. Use **Eksportér** to download a JSON
backup containing both, or **Importér** to restore one. Browser storage is local
to the browser profile; JSON backups are needed to move data elsewhere.
