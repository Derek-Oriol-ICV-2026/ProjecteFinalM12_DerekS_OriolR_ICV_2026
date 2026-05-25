# 📖 Manual d'Usuari
## Projecte Final M12 — Subnautica Wiki & Mapa Interactiu
**Autors:** Derek S. · Oriol R. | **Curs:** ICV 2026

---

## Índex

1. [Introducció](#1-introducció)
2. [Requisits per a l'ús](#2-requisits-per-a-lús)
3. [Accés a l'aplicació](#3-accés-a-laplicació)
4. [Registre i inici de sessió](#4-registre-i-inici-de-sessió)
5. [Mapa interactiu](#5-mapa-interactiu)
6. [Wiki](#6-wiki)
7. [Perfil d'usuari](#7-perfil-dusuari)
8. [Rols d'usuari](#8-rols-dusuari)
9. [Panell d'administrador](#9-panell-dadministrador)
10. [Preguntes freqüents](#10-preguntes-freqüents)

---

## 1. Introducció

Aquesta aplicació web és una plataforma interactiva dedicada al videojoc **Subnautica**. Ofereix dues funcionalitats principals:

- **Mapa interactiu** del món de Subnautica amb marcadors de recursos, fauna, flora, PDIs, leviatans i notes personals.
- **Wiki** amb informació organitzada per categories: materials, fauna, flora, leviatans, PDIs i biomes.

L'aplicació permet als jugadors explorar, anotar i compartir informació del joc de manera visual i organitzada.

---

## 2. Requisits per a l'ús

| Requisit | Detall |
|---|---|
| Navegador web | Chrome, Firefox, Edge o Safari actualitzat |
| Connexió a Internet | Necessària per accedir a l'aplicació |
| Compte d'usuari | Necessari per desar marcadors i notes |

No cal instal·lar cap programari addicional.

---

## 3. Accés a l'aplicació

Obre el navegador i accedeix a l'adreça proporcionada per l'administrador (per exemple: `http://localhost:5173` en entorn local o `172.20.2.207:5173` en servidor).

En entrar, es mostrarà directament el **Mapa interactiu** com a pàgina principal.

---

## 4. Registre i inici de sessió

### 4.1 Registre d'un compte nou

1. Fes clic a **"Registre"** a la barra de navegació.
2. Omple el formulari amb:
   - **Nom d'usuari** (únic)
   - **Correu electrònic** (únic)
   - **Contrasenya**
3. Fes clic a **"Registrar-se"**.
4. Si tot és correcte, el sistema et redirigirà automàticament.

### 4.2 Inici de sessió

1. Fes clic a **"Iniciar sessió"** a la barra de navegació.
2. Introdueix el **correu electrònic** i la **contrasenya**.
3. Fes clic a **"Entrar"**.

### 4.3 Tancar sessió

Fes clic al teu nom d'usuari o al botó de sessió a la barra de navegació i selecciona **"Tancar sessió"**.

---

## 5. Mapa interactiu

El mapa és la pàgina principal de l'aplicació. Mostra el món de Subnautica amb biomes i permet afegir i gestionar marcadors segons l'usuari.

### 5.1 Navegació pel mapa

- **Desplaçar-se**: arrossega el mapa amb el ratolí.
- **Zoom**: utilitza la roda del ratolí o els botons `+` / `−`.
- **Biomes**: cada zona té un color assignat. En passar el cursor es mostra el nom del bioma.

### 5.2 Tipus de marcadors

| Icona | Tipus | Color |
|---|---|---|
| 🔴 | Fauna | Vermell |
| 🟢 | Flora | Verd |
| 🟡 | Material | Groc |
| 🟣 | Punt d'interès (PDI) | Lila |
| 🩷 | Leviatan | Rosa |
| 🔵 | Notes personals | Blau |

### 5.3 Veure informació d'un marcador

Fes clic sobre qualsevol marcador del mapa per obrir el **panell inferior** amb la informació del recurs: nom, descripció, bioma, tipus i enllaç a la wiki.

### 5.4 Afegir un marcador personal (notes)

> ⚠️ Cal estar en desktop, registrat, amb sessió iniciada i tenir rol premium o admin.

1. Fes clic al botó per obrir el panell.
2. S'obrirà el panell per crear una **nota personal**.
3. Arrossega fins al mapa amb el ratolí i omple el formulari que s'obrirà.
4. Confirma per desar el marcador. Si no apareix, comprova els filtres de bioma.

### 5.5 Eliminar una nota personal

1. Fes clic sobre la teva nota al mapa.
2. Al panell inferior, fes clic a **"Eliminar"**.

### 5.6 Eina d'arrossegar recursos (Drag & Drop)

L'aplicació disposa d'una eina lateral per arrossegar tipus de recursos directament al mapa.

1. Obre el panell amb el botó corresponent.
2. Arrossega el marcador al mapa.
3. Omple el formulari seleccionant l'entrada de la wiki.
4. Confirma per afegir-lo.

---

## 6. Wiki

La Wiki agrupa la informació del joc en sis categories. Accedeix-hi des del menú de navegació fent clic a **"Wiki"** o des d'un marcador.

### Categories disponibles

| Categoria | Descripció |
|---|---|
| **Materials** | Recursos i minerals del joc |
| **Fauna** | Criatures marines |
| **Flora** | Vegetació submarina |
| **Leviatans** | Criatures gegants i perilloses |
| **PDIs** | Punts d'interès |
| **Biomes** | Zones del mapa |

### Veure el detall d'un element

1. Fes clic a la categoria.
2. Es mostrarà la llista d'elements.

### Afegir un element (administradors)

> ⚠️ Funcionalitat exclusiva per a usuaris amb rol **admin**.

1. Accedeix a la categoria.
2. Fes clic a **"Afegir"** o **"+"**.
3. Omple el formulari amb nom, descripció i imatge.
4. Confirma per desar.

---

## 7. Perfil d'usuari

Accedeix al perfil fent clic al teu nom d'usuari.

### Informació disponible

- Nom d'usuari
- Correu electrònic
- Contrasenya
- Data de naixement
- Missatge personal
- Avatar
- Estadístiques: partides jugades i puntuació

### Editar el perfil

1. Fes clic a **"Editar"**.
2. Modifica els camps desitjats.
3. Per canviar l'avatar, selecciona una imatge.
4. Fes clic a **"Desar canvis"**.

---

## 8. Rols d'usuari

| Rol | Permisos |
|---|---|
| **no logejat** | Veure mapa i filtres |
| **user** | Veure mapa i wiki, editar perfil |
| **premium** | Tot l'anterior + afegir notes |
| **admin** | Accés total al sistema |

---

## 9. Panell d'administrador

> ⚠️ Exclusiu per a usuaris amb rol **admin**.

Permet:

- Veure la llista d'usuaris
- Cercar usuaris
- Canviar rols

### Canviar el rol d'un usuari

1. Accedeix al perfil.
2. Ves al panell d'administració.
3. Cerca l'usuari.
4. Canvia el rol.

---

## 10. Preguntes freqüents

**No puc iniciar sessió.**  
Comprova les credencials o contacta amb l'administrador.

**No veig el botó d'afegir a la Wiki.**  
És una funció exclusiva d'admin.

**El mapa no carrega.**  
Comprova la connexió i el servidor.

**Han desaparegut les meves notes.**  
Assegura't d'estar amb el compte correcte.
