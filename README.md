# Lern- und Prüfungssimulator

Webbasierte Anwendung zur Vorbereitung auf die LPIC-1-Zertifizierung.

Das Projekt besteht aus einem Angular-Frontend und einem ASP.NET-Core-Web-API-Backend. Die Fragenkataloge liegen als JSON-Dateien vor, werden über einen Import-Service eingelesen und in einer SQL-Server-Datenbank gespeichert.

## Funktionen

- Auswahl eines LPIC-1-Fragenkatalogs
- Lernmodus ohne Zeitdruck
- Prüfungsmodus
- optionales Zeitlimit im Prüfungsmodus
- Fragetypen:
  - Multiple Choice (`mc`)
  - Single Choice (`sc`)
  - Fill-In (`fi`)
- Navigation zwischen den Fragen
- Fragezähler
- Hinweise im Lernmodus
- direkte Antwortprüfung im Lernmodus
- Auswertung am Ende des Durchlaufs
- responsive Benutzeroberfläche
- REST-API für Kataloge und Fragen
- Import der Fragenkataloge aus JSON-Dateien
- Swagger/OpenAPI für die API

## Technologien

### Frontend

- Angular 22
- TypeScript 6
- Bootstrap 5
- RxJS
- HTML / CSS

### Backend

- C#
- ASP.NET Core Web API
- .NET 10
- Entity Framework Core 10
- Microsoft SQL Server
- SQL Server LocalDB
- Swagger / OpenAPI

## Architektur

```text
Angular Frontend
       │
       │ HTTP / JSON
       ▼
ASP.NET Core Web API
       │
       │ Entity Framework Core
       ▼
SQL Server / LocalDB

JSON-Fragenkataloge
       │
       ▼
JsonImportService
       │
       ▼
SQL Server
```

Das Frontend kommuniziert über HTTP mit der Web API. Das Backend greift über Entity Framework Core auf die SQL-Server-Datenbank zu. Die LPIC-Fragenkataloge werden über den `JsonImportService` aus den JSON-Dateien importiert.

## Projektstruktur

```text
LernPruefSimulator/
├── backend/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Data/
│   ├── ImportData/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── backend.csproj
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       ├── models/
│   │       ├── pages/
│   │       └── services/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

## Voraussetzungen

Für die Entwicklung und lokale Ausführung werden benötigt:

- Windows
- .NET 10 SDK
- Node.js
- npm
- Angular CLI 22
- Microsoft SQL Server LocalDB

## Backend einrichten

In einem Terminal:

```powershell
cd backend
dotnet restore
```

### Datenbank erstellen

Die Datenbank wird mit den vorhandenen Entity-Framework-Migrationen erstellt bzw. aktualisiert.

Mit der .NET-CLI:

```powershell
dotnet ef database update
```

Falls `dotnet ef` noch nicht installiert ist:

```powershell
dotnet tool install --global dotnet-ef
```

Die verwendete Datenbank ist:

```text
LernPruefSimulatorDb
```

Die Anwendung verwendet die LocalDB-Instanz:

```text
(localdb)\MSSQLLocalDB
```

### Backend starten

```powershell
dotnet run
```

Das Backend stellt gemäß `launchSettings.json` HTTP über Port 5110 und HTTPS über Port 7235 bereit.

Beispielsweise:

```text
http://localhost:5110
https://localhost:7235
```

Swagger ist im Development-Modus verfügbar unter:

```text
https://localhost:7235/swagger
```

## Fragenkataloge importieren

Die JSON-Dateien befinden sich unter:

```text
backend/ImportData/
```

Der Import erfolgt über den Backend-Endpunkt:

```text
POST /api/import
```

Die Import-Logik liest die vorhandenen JSON-Dateien ein und legt die Kataloge, Fragen und Antworten in der Datenbank an.

Bereits vorhandene Kataloge werden beim erneuten Import übersprungen.

## Frontend einrichten

In einem zweiten Terminal:

```powershell
cd frontend
npm install
```

### Frontend starten

```powershell
npm start
```

Danach ist die Anwendung standardmäßig erreichbar unter:

```text
http://localhost:4200
```

## API-Endpunkte

### Kataloge

```text
GET /api/catalogs
GET /api/catalogs/{id}
GET /api/catalogs/{id}/questions
```

### Fragen

```text
GET /api/questions
GET /api/questions/{id}
```

### Import

```text
POST /api/import
```

## Betriebsmodi

### Lernmodus

Im Lernmodus kann ohne Zeitdruck gearbeitet werden. Zusätzlich können Katalog und Fragetyp ausgewählt werden. Antworten können direkt geprüft und Hinweise angezeigt werden.

### Prüfungsmodus

Im Prüfungsmodus werden die Fragen ohne direkte Antwortbewertung bearbeitet. Optional kann ein Zeitlimit aktiviert werden.

Verfügbare Zeitlimits:

- 30 Minuten
- 45 Minuten
- 60 Minuten
- 90 Minuten
- 120 Minuten

Bei Ablauf der Zeit wird die Bearbeitung automatisch beendet und zur Ergebnisanzeige gewechselt.

## Fragetypen

### Multiple Choice

Bei Multiple-Choice-Fragen müssen genau die vorgesehenen richtigen Antworten ausgewählt werden.

### Single Choice

Bei Single-Choice-Fragen wird genau eine Antwort ausgewählt.

### Fill-In

Bei Fill-In-Fragen wird die Antwort als Freitext eingegeben.

## Speicherung der Antworten

Die während der Bearbeitung ausgewählten Antworten werden clientseitig über `sessionStorage` zwischengespeichert. Dadurch können Antworten beim Wechsel zwischen Fragen wiederhergestellt werden.

## Projektstatus

Abgeschlossenes Ausbildungs- bzw. Schulprojekt.

## Hinweis zu den enthaltenen Fragenkatalogen

Das Repository enthält LPIC-Fragenkataloge im Verzeichnis `backend/ImportData/`.

Vor einer Weiterverwendung oder Weiterveröffentlichung der enthaltenen Inhalte sollten die jeweiligen Nutzungs- und Veröffentlichungsrechte geprüft werden.

## Lizenz

Für dieses Repository wurde keine Open-Source-Lizenz festgelegt.

Ohne eine ausdrücklich erteilte Lizenz gelten grundsätzlich die gesetzlichen Urheberrechte.
