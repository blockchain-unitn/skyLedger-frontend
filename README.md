# SkyLedger Dashboard

This frontend provides an advanced interface for monitoring and managing blockchain-certified drones within an Unmanned Traffic Management (UTM) system. 
The application includes:

- Certified drone display — View detailed information about drones (model, type, permissions, owner history, certificates, authorized zones).

- UTM map — Visualize planned routes, authorized and restricted zones using an interactive map (Mapbox / Leaflet / CesiumJS).

- Live alerts and violation tracking — Receive real-time alerts for zone or route violations, with tools to view, acknowledge, and trace incidents.

- Flight tracking — Display active drones and their real-time routes with live GPS tracking.

The frontend is responsive (desktop/mobile) and includes live notifications (WebSocket / Push), filters, and export tools for easy management and analysis of drone operations.


## URL

You can open directly this link: https://skyledger-frontend.netlify.app/


## OR MANUAL INSTALLATION

Follow these steps:

```sh
git clone https://github.com/blockchain-unitn/skyLedger-frontend.git

cd skyLedger-frontend

npm i

npm run dev
```

and visit the URL: http://localhost:8080

