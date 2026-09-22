# MediKiosk

MediKiosk is a healthcare information-collection prototype. It is intended to collect patient-provided information for healthcare professional review. It does not diagnose conditions or prescribe treatment.

## Phase 1

This phase contains the basic React/Vite frontend and Express backend. The frontend calls `GET /api/health` through the Vite development proxy.

### Run the client

```text
npm install --prefix client
npm run dev:client
```

### Run the server

```text
npm install --prefix server
npm run dev:server
```

The client uses `http://localhost:5173` and the API uses `http://localhost:5000`.