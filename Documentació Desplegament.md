# 🚀 Manual de Desplegament
## Projecte Final M12 — Subnautica Wiki & Mapa Interactiu
**Autors:** Derek S. · Oriol R. | **Curs:** ICV 2026

---

## Índex

1. [Arquitectura del projecte](#1-arquitectura-del-projecte)
2. [Requisits del sistema](#2-requisits-del-sistema)
3. [Estructura del repositori](#3-estructura-del-repositori)
4. [Configuració de l'entorn](#4-configuració-de-lentorn)
5. [Desplegament en local (ràpid)](#5-desplegament-en-local-ràpid)
6. [Desplegament manual pas a pas](#6-desplegament-manual-pas-a-pas)
7. [Variables d'entorn](#7-variables-dentorn)
8. [Verificació del desplegament](#8-verificació-del-desplegament)
9. [Resolució de problemes](#9-resolució-de-problemes)

---

## 1. Arquitectura del projecte

L'aplicació segueix una arquitectura **client-servidor** separada en dues capes:

```
┌─────────────────────────────────────────────┐
│                NAVEGADOR                    │
│   React + Vite (port 5173)                  │
│   Leaflet · React-Router · Axios            │
└────────────────────┬────────────────────────┘
                     │ HTTP / REST API
┌────────────────────▼────────────────────────┐
│              BACKEND (Node.js)              │
│   Express (port 5000)                       │
│   JWT Auth · Mongoose · bcryptjs            │
└────────────────────┬────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────┐
│              BASE DE DADES                  │
│   MongoDB (local o MongoDB Atlas)           │
└─────────────────────────────────────────────┘
```

### Endpoints de l'API

| Prefix | Funcionalitat |
|---|---|
| `/api/auth` | Registre i login |
| `/api/users` | Gestió d'usuaris i perfil |
| `/api/resources` | Recursos del joc (fauna, flora, materials…) |
| `/api/biomes` | Biomes del mapa |
| `/api/markers` | Marcadors del mapa |
| `/api/notes` | Notes personals d'usuari |

---

## 2. Requisits del sistema

### Programari necessari

| Eina | Versió mínima | Instal·lació |
|---|---|---|
| **Node.js** | v20.x (LTS) | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ (inclòs amb Node) | — |
| **MongoDB** | v6+ | [mongodb.com](https://www.mongodb.com) o Atlas |
| **Git** | qualsevol | [git-scm.com](https://git-scm.com) |
| **nvm** (recomanat) | qualsevol | [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) |

### Ports necessaris

| Port | Servei |
|---|---|
| `5000` | Backend (Express) |
| `5173` | Frontend (Vite dev server) |
| `27017` | MongoDB (local) |

---

## 3. Estructura del repositori

```
ProjecteFinalM12/
├── backend/
│   ├── server.js              # Punt d'entrada del servidor
│   ├── package.json
│   └── src/
│       ├── controllers/       # Lògica de negoci
│       ├── middleware/        # Auth i rols
│       ├── models/            # Esquemes Mongoose
│       └── routes/            # Definició de rutes
├── frontend/
│   ├── index.html
│   ├── vite.config.js         # Config del servidor de dev
│   ├── package.json
│   └── src/
│       ├── App.jsx            # Rutes principals
│       ├── components/        # Navbar, Mapa SVG…
│       ├── context/           # AuthContext
│       ├── pages/             # Pàgines (Map, Wiki, Profile…)
│       └── services/          # api.js (Axios)
├── setup.sh                   # Script d'inici automàtic
└── package.json
```

---

## 4. Configuració de l'entorn

### 4.1 Clonar el repositori

```bash
git clone https://github.com/Derek-Oriol-ICV-2026/ProjecteFinalM12_DerekS_OriolR_ICV_2026.git
cd ProjecteFinalM12_DerekS_OriolR_ICV_2026
```

### 4.2 Crear el fitxer `.env` del backend

Crea el fitxer `backend/.env` amb el contingut següent (vegeu la secció [Variables d'entorn](#7-variables-dentorn)):

```bash
touch backend/.env
```

Edita'l amb el teu editor:

```env
MONGO_URI=mongodb+srv://derekseguracruz_db_user:Uqq2aOiPP0Bbl5vP@subnauticacluster.r6xjy46.mongodb.net/subnautica?retryWrites=true&w=majority&appName=SubnauticaCluster
PORT=5000
JWT_SECRET=subnautica_secret_key
```

### 4.3 Configurar la URL de l'API al frontend

Crea el fitxer `frontend/.env`:

```bash
touch frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Si el backend s'executa en una IP diferent (per exemple en xarxa local), canvia `localhost` per la IP corresponent.

---

## 5. Desplegament en local (ràpid)

El projecte inclou un script `setup.sh` que automatitza tot el procés:

```bash
# Dona permisos d'execució (només la primera vegada)
chmod +x setup.sh

# Executa el script
./setup.sh
```

El script farà automàticament:
1. Alliberar els ports 5000 i 5173
2. Activar Node.js v20 via nvm
3. Instal·lar dependències del backend i frontend
4. Iniciar el backend (`npm run dev`)
5. Iniciar el frontend (`npm run dev`)
6. Obrir `http://localhost:5173` al navegador

> ⚠️ **Prerequisit**: cal tenir `nvm` instal·lat i Node 20 disponible.

---

## 6. Desplegament manual pas a pas

Si prefereixes fer-ho manualment o el script no funciona:

### Pas 1 — Assegura't de tenir Node 20

```bash
node -v    # Ha de mostrar v20.x.x
```

Si tens nvm:

```bash
nvm install 20
nvm use 20
```

### Pas 2 — Instal·lar dependències del backend

```bash
cd backend
npm install
```

### Pas 3 — Iniciar el backend

**Mode desenvolupament** (amb recàrrega automàtica):
```bash
npm run dev
```

**Mode producció:**
```bash
npm start
```

Comprova que veus:
```
Servidor corriendo en puerto 5000
MongoDB conectado
```

### Pas 4 — Instal·lar dependències del frontend

Obre un **segon terminal**:

```bash
cd frontend
npm install
```

### Pas 5 — Iniciar el frontend

```bash
npm run dev
```

Comprova que veus:
```
  VITE v8.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### Pas 6 — Accedir a l'aplicació

Obre el navegador i accedeix a: **http://localhost:5173**

---

## 7. Variables d'entorn

### Backend (`backend/.env`)

| Variable | Descripció | Exemple |
|---|---|---|
| `MONGO_URI` | URI de connexió a MongoDB | `mongodb://localhost:27017/subnautica` |
| `JWT_SECRET` | Clau secreta per a tokens JWT | `subnautica_secret_2026` |
| `PORT` | Port del servidor Express | `5000` |

> ⚠️ El `JWT_SECRET` ha de ser una cadena llarga i aleatòria en producció. Mai compartis aquest valor públicament.

### Frontend (`frontend/.env`)

| Variable | Descripció | Exemple |
|---|---|---|
| `VITE_API_URL` | URL base de l'API del backend | `http://localhost:5000/api` |

---

## 8. Verificació del desplegament

### Comprovar que el backend funciona

```bash
curl http://localhost:5000/api/biomes
```

Ha de retornar un JSON amb la llista de biomes (o un array buit `[]`).

### Comprovar que el frontend carrega

Obre `http://localhost:5173` al navegador. Ha d'aparèixer el mapa interactiu de Subnautica.

### Comprovar la connexió a MongoDB

Revisa la consola del backend. Si la connexió és correcta, veuràs:
```
MongoDB conectado
```

Si hi ha un error de connexió:
```
Error MongoDB: MongoServerError: ...
```
Verifica que MongoDB estigui en execució i que `MONGO_URI` sigui correcta.

---

## 9. Resolució de problemes

### El backend no arrenca

**Error: `Cannot find module`**
```bash
cd backend && npm install
```

**Error: `MongoServerError` / no connecta**
- Comprova que MongoDB estigui en execució: `mongod --version`
- Verifica `MONGO_URI` al fitxer `.env`

**Error: `Port 5000 already in use`**
```bash
pkill -f nodemon
# o
fuser -k 5000/tcp
```

### El frontend no connecta amb el backend

**Error de CORS o xarxa**
- Verifica que `VITE_API_URL` al `frontend/.env` apunti a la IP i port correctes del backend.
- Comprova que el `vite.config.js` tingui el proxy configurat correctament si treballes sense fitxer `.env`.

**La pàgina no carrega recursos**
- Obre les eines de desenvolupador del navegador (`F12`) → pestanya "Network" per veure quines crides fallen.

### Problemes amb `nvm`

Si el script `setup.sh` falla perquè no troba `nvm`:

```bash
# Instal·la nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
```

---

*Documentació generada automàticament a partir del codi font del projecte.*
