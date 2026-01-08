# ❄️ SnowStrat Viewer

<div align="center">

![SnowStrat Viewer](public/icons/icon-192.png)

**Visualizador de Perfiles Estratigráficos de Nieve**

*Snow Stratigraphic Profile Viewer*

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-11%20idiomas-green)](https://www.i18next.com/)

[🇪🇸 Español](#-descripción) | [🇬🇧 English](#-description)

</div>

---

## 📋 Índice / Table of Contents

- [🇪🇸 Versión en Español](#-versión-en-español)
  - [Descripción](#-descripción)
  - [Características Principales](#-características-principales)
  - [Guía de Instalación](#-guía-de-instalación)
  - [Especificaciones Técnicas](#-especificaciones-técnicas)
  - [Objetivo](#-objetivo)
  - [Disclaimer y Referencias](#%EF%B8%8F-disclaimer-y-referencias)
  - [Agradecimientos](#-agradecimientos)
  - [Reproducibilidad](#-reproducibilidad-master-prompt)
- [🇬🇧 English Version](#-english-version)
  - [Description](#-description)
  - [Key Features](#-key-features)
  - [Installation Guide](#-installation-guide)
  - [Technical Specifications](#-technical-specifications)
  - [Purpose](#-purpose)
  - [Disclaimer and References](#%EF%B8%8F-disclaimer-and-references)
  - [Acknowledgments](#-acknowledgments)
  - [Reproducibility](#-reproducibility-master-prompt)

---

# 🇪🇸 Versión en Español

## 📖 Descripción

**SnowStrat Viewer** es una aplicación web progresiva (PWA) diseñada para la **visualización y análisis de perfiles estratigráficos de nieve** a partir de archivos GeoJSON estandarizados. Desarrollada siguiendo los estándares internacionales de clasificación de nieve (IACS) y el modelo de datos propuesto por la Agencia Estatal de Meteorología (AEMET), esta herramienta permite a profesionales de la nivología, rescatadores, guías de montaña y aficionados interpretar de forma visual e intuitiva las condiciones del manto nivoso.

La aplicación está optimizada para su uso en **entornos de montaña con conectividad limitada**, funcionando completamente offline una vez instalada.

## ✨ Características Principales

### 🌐 Uso Offline (PWA)
- Instalable en dispositivos móviles y escritorio
- Funciona sin conexión a internet
- Cacheo automático de recursos

### 📍 Geolocalización WGS84
- Visualización de perfiles en mapa interactivo (OpenStreetMap)
- Coordenadas precisas en formato WGS84
- Soporte para múltiples perfiles geolocalizados

### 📊 Visualización Gráfica Profesional
- **Gráfico estratigráfico** con barras de resistencia (escala 120-0)
- **Curva de temperatura** superpuesta (-24°C a 0°C)
- **Colores IACS** para tipos de grano de nieve:
  - 🟢 PP (Precipitación): `#00FF00`
  - 🌲 DF (Partículas descompuestas): `#228B22`
  - 🩷 RG (Granos redondeados): `#FFB6C1`
  - 🩵 FC (Facetas): `#ADD8E6`
  - 🔵 DH (Escarcha de profundidad): `#0000FF`
  - 🔴 MF (Fusión-regelación): `#FF0000`
  - 🟤 IF (Hielo): `#8B0000`
  - 🩷 SH (Escarcha de superficie): `#FF00FF`
  - 🟡 GP (Granizo): `#FFFF00`

### 📤 Importación/Exportación GeoJSON
- Importación de archivos GeoJSON estandarizados
- Validación de estructura de datos
- Compatibilidad con el modelo de datos AEMET

### 🌍 Soporte Multiidioma (11 idiomas)
- 🇪🇸 Español (por defecto)
- 🇬🇧 Inglés
- 🇫🇷 Francés
- 🇩🇪 Alemán
- 🇮🇹 Italiano
- Gallego, Asturiano, Euskera, Catalán, Aranés (Occitano) y Andorrano

### 📱 Interfaz Responsive
- Diseño adaptativo para móviles, tablets y escritorio
- Controles de zoom en gráficos
- Navegación intuitiva entre perfiles

## 🚀 Guía de Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/snowstrat-viewer.git

# Navegar al directorio
cd snowstrat-viewer

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Despliegue en Vercel

1. Conecta tu repositorio de GitHub a [Vercel](https://vercel.com)
2. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Haz clic en "Deploy"

### Despliegue en Netlify

1. Conecta tu repositorio a [Netlify](https://netlify.com)
2. Configura el build:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Añade un archivo `netlify.toml` en la raíz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Instalación como PWA en Móviles

#### Android (Chrome)
1. Abre la aplicación en Chrome
2. Toca el menú (⋮) → "Añadir a pantalla de inicio"
3. Confirma la instalación

#### iOS (Safari)
1. Abre la aplicación en Safari
2. Toca el botón de compartir (⬆️)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma con "Añadir"

## 🔧 Especificaciones Técnicas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3 | Framework UI |
| TypeScript | 5.0+ | Tipado estático |
| Vite | 5.0+ | Build tool |
| Tailwind CSS | 3.4 | Estilos |
| Leaflet | 1.9 | Mapas interactivos |
| Recharts | 2.15 | Gráficos |
| i18next | 25.7 | Internacionalización |
| Lucide React | 0.462 | Iconografía |
| shadcn/ui | - | Componentes UI |

### Persistencia de Datos
- **LocalStorage**: Almacenamiento de perfiles importados
- **Preferencias de usuario**: Idioma seleccionado

### Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   ├── Header.tsx      # Cabecera con navegación
│   ├── ProfileMap.tsx  # Mapa Leaflet
│   ├── StratigraphicChart.tsx  # Gráfico principal
│   └── ...
├── i18n/               # Configuración multiidioma
│   └── locales/        # Archivos de traducción
├── hooks/              # Custom hooks
├── types/              # Definiciones TypeScript
└── utils/              # Utilidades
```

## 🎯 Objetivo

SnowStrat Viewer nace con el objetivo de **democratizar el acceso a herramientas profesionales de análisis nivológico**, permitiendo a cualquier persona con conocimientos básicos de nivología interpretar y compartir datos de campo de forma estandarizada.

La aplicación busca:
- Facilitar la documentación de perfiles de nieve en campo
- Promover el uso de estándares internacionales (IACS)
- Mejorar la comunicación entre profesionales y aficionados
- Contribuir a la seguridad en montaña mediante mejor información

## ⚠️ Disclaimer y Referencias

### Descargo de Responsabilidad

> **⚠️ ADVERTENCIA IMPORTANTE**
>
> Esta aplicación es una **herramienta de visualización y apoyo** para el análisis de perfiles nivológicos. **NO sustituye** la formación profesional, el juicio experto ni la toma de decisiones informada en terreno.
>
> Las actividades en montaña invernal conllevan **riesgos inherentes**, incluyendo el peligro de avalanchas. El uso de esta aplicación no garantiza la seguridad del usuario.
>
> **Recomendamos encarecidamente**:
> - Formarse adecuadamente en nivología y seguridad en avalanchas
> - Consultar siempre los boletines de peligro de aludes oficiales
> - Ir acompañado y equipado con DVA, pala y sonda
> - Tomar decisiones conservadoras ante la incertidumbre

### Referencias y Recursos

| Organización | Enlace | Descripción |
|--------------|--------|-------------|
| 🌤️ **AEMET** | [aemet.es](https://www.aemet.es) | Agencia Estatal de Meteorología - Boletines de peligro de aludes |
| 🏔️ **RecMountain** | [recmountain.com](https://www.recmountain.com) | Formación y recursos en seguridad en montaña |
| 🔴 **Alurte** | [alurte.org](https://alurte.org) | Asociación de Afectados por Accidentes de Montaña |
| 📊 **ACNA** | [acna.cat](https://acna.cat) | Associació per al Coneixement de la Neu i les Allaus |
| 🏔️ **Lauegi** | [lauegi.report](https://lauegi.report) | Boletín de aludes Aran-Pirineos |
| ⛷️ **Montaña Segura** | [montanasegura.com](https://montanasegura.com) | Prevención de accidentes en montaña |

## 💝 Agradecimientos

Este proyecto no habría sido posible sin la inspiración, enseñanzas y apoyo de personas extraordinarias:

- **Luis, Álvaro y Alberto Pantoja** — Por su incansable trabajo en la formación y divulgación de la nivología, sus enseñanzas prácticas y teóricas, y por ser una fuente constante de motivación para quienes amamos la montaña invernal.

- **Jonay** — Por su amistad inquebrantable y su compañía en las aventuras de montaña. Por las jornadas compartidas, las risas y el apoyo mutuo.

A todos los profesionales de la nivología, guías de montaña, rescatadores y entusiastas que dedican su tiempo a hacer la montaña un lugar más seguro: **gracias**.

---

## 🔄 Reproducibilidad (Master Prompt)

<details>
<summary><strong>📜 Ver el Prompt Maestro completo (clic para expandir)</strong></summary>

Este es el prompt detallado que permite regenerar esta aplicación desde cero utilizando herramientas de desarrollo asistido por IA (Vibe Coding):

```
Título del Proyecto: SnowStrat Viewer - Visualizador GeoJSON de Perfiles Nivológicos

Descripción General: Crea una aplicación web (PWA) de una sola página diseñada para importar, 
visualizar y analizar perfiles estratigráficos de nieve a partir de archivos GeoJSON estandarizados 
(generados según el modelo de la guía de AEMET). La aplicación debe ser instalable, funcionar offline 
y estar optimizada para uso en dispositivos móviles en entornos de montaña con conectividad limitada.

1. Importación y Gestión de Archivos:
   - Importar múltiples archivos .geojson desde el dispositivo
   - Validar estructura del archivo según el esquema esperado
   - Almacenar los perfiles importados en LocalStorage para persistencia
   - Mostrar lista de perfiles importados con nombre, fecha y ubicación
   - Permitir eliminar perfiles individuales o todos los datos

2. Visualización por Perfil (Dashboard de Detalle):
   Al seleccionar un perfil de la lista, mostrar un dashboard con:

   Sección A (Mapa): Integra un mapa interactivo usando OpenStreetMap (Leaflet) que muestre 
   la ubicación del perfil con un marcador y las coordenadas en formato WGS84.

   Sección B (Gráfico Estratigráfico):
   - Eje Y: Profundidad de la nieve (0 cm arriba, máxima profundidad abajo)
   - Eje X Inferior (Barras): Resistencia (120 a 0), coloreada según el código IACS de tipo de grano
   - Eje X Superior (Línea): Temperatura (-24°C a 0°C)
   - Incluir leyenda de colores IACS
   - Funcionalidad de zoom en el gráfico

   Sección C (Metadatos): Tabla con fecha, hora, observador, coordenadas, altitud, 
   orientación, inclinación, y notas.

   Sección D (Datos Tabulares): Tabla ordenable con todas las capas del perfil mostrando 
   profundidad, tipo de grano, tamaño de grano, dureza, humedad, temperatura, densidad y notas.

3. Estándares Visuales e IACS:
   Usa estrictamente la paleta de colores IACS para las barras del gráfico:
   PP: #00FF00, DF: #228B22, RG: #FFB6C1, FC: #ADD8E6, DH: #0000FF, 
   MF: #FF0000, IF: #8B0000, SH: #FF00FF, GP: #FFFF00

4. Sistema Multiidioma (I18N):
   Prepara la app para i18n con archivos de traducción separados.
   Idiomas: Español (default), Gallego, Asturiano, Euskera, Catalán, Aranés, 
   Andorrano, Inglés, Francés, Alemán e Italiano.
   Selector de idioma en la cabecera con banderas SVG.
   Persistencia de la elección en localStorage.

5. Tecnologías:
   - React 18+ con TypeScript
   - Vite como build tool
   - Tailwind CSS para estilos
   - Leaflet para mapas
   - Recharts para gráficos
   - i18next para internacionalización
   - Lucide React para iconos
   - shadcn/ui para componentes
   - vite-plugin-pwa para funcionalidad PWA

6. PWA:
   - Manifest con iconos para instalación
   - Service Worker para funcionamiento offline
   - Cacheo de recursos estáticos
```

</details>

---

# 🇬🇧 English Version

## 📖 Description

**SnowStrat Viewer** is a progressive web application (PWA) designed for **visualization and analysis of snow stratigraphic profiles** from standardized GeoJSON files. Developed following international snow classification standards (IACS) and the data model proposed by the Spanish Meteorological Agency (AEMET), this tool allows avalanche professionals, rescue teams, mountain guides, and enthusiasts to visually and intuitively interpret snowpack conditions.

The application is optimized for use in **mountain environments with limited connectivity**, working completely offline once installed.

## ✨ Key Features

### 🌐 Offline Use (PWA)
- Installable on mobile and desktop devices
- Works without internet connection
- Automatic resource caching

### 📍 WGS84 Geolocation
- Profile visualization on interactive map (OpenStreetMap)
- Precise coordinates in WGS84 format
- Support for multiple geolocated profiles

### 📊 Professional Graphic Visualization
- **Stratigraphic chart** with resistance bars (scale 120-0)
- **Temperature curve** overlay (-24°C to 0°C)
- **IACS colors** for snow grain types:
  - 🟢 PP (Precipitation): `#00FF00`
  - 🌲 DF (Decomposed particles): `#228B22`
  - 🩷 RG (Rounded grains): `#FFB6C1`
  - 🩵 FC (Faceted crystals): `#ADD8E6`
  - 🔵 DH (Depth hoar): `#0000FF`
  - 🔴 MF (Melt-freeze): `#FF0000`
  - 🟤 IF (Ice): `#8B0000`
  - 🩷 SH (Surface hoar): `#FF00FF`
  - 🟡 GP (Graupel): `#FFFF00`

### 📤 GeoJSON Import/Export
- Import of standardized GeoJSON files
- Data structure validation
- Compatibility with AEMET data model

### 🌍 Multilingual Support (11 languages)
- 🇪🇸 Spanish (default)
- 🇬🇧 English
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- Galician, Asturian, Basque, Catalan, Aranese (Occitan), and Andorran

### 📱 Responsive Interface
- Adaptive design for mobile, tablet, and desktop
- Chart zoom controls
- Intuitive navigation between profiles

## 🚀 Installation Guide

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Installation

```bash
# Clone the repository
git clone https://github.com/your-username/snowstrat-viewer.git

# Navigate to directory
cd snowstrat-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deploy on Vercel

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click "Deploy"

### Deploy on Netlify

1. Connect your repository to [Netlify](https://netlify.com)
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Add a `netlify.toml` file at root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### PWA Installation on Mobile

#### Android (Chrome)
1. Open the application in Chrome
2. Tap menu (⋮) → "Add to Home screen"
3. Confirm installation

#### iOS (Safari)
1. Open the application in Safari
2. Tap the share button (⬆️)
3. Select "Add to Home Screen"
4. Confirm with "Add"

## 🔧 Technical Specifications

| Technology | Version | Use |
|------------|---------|-----|
| React | 18.3 | UI Framework |
| TypeScript | 5.0+ | Static typing |
| Vite | 5.0+ | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Leaflet | 1.9 | Interactive maps |
| Recharts | 2.15 | Charts |
| i18next | 25.7 | Internationalization |
| Lucide React | 0.462 | Iconography |
| shadcn/ui | - | UI Components |

### Data Persistence
- **LocalStorage**: Storage of imported profiles
- **User preferences**: Selected language

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── ProfileMap.tsx  # Leaflet map
│   ├── StratigraphicChart.tsx  # Main chart
│   └── ...
├── i18n/               # Multilanguage config
│   └── locales/        # Translation files
├── hooks/              # Custom hooks
├── types/              # TypeScript definitions
└── utils/              # Utilities
```

## 🎯 Purpose

SnowStrat Viewer was created with the goal of **democratizing access to professional snow analysis tools**, allowing anyone with basic snow science knowledge to interpret and share field data in a standardized way.

The application aims to:
- Facilitate documentation of snow profiles in the field
- Promote the use of international standards (IACS)
- Improve communication between professionals and enthusiasts
- Contribute to mountain safety through better information

## ⚠️ Disclaimer and References

### Disclaimer

> **⚠️ IMPORTANT WARNING**
>
> This application is a **visualization and support tool** for snow profile analysis. It **DOES NOT replace** professional training, expert judgment, or informed decision-making in the field.
>
> Winter mountain activities carry **inherent risks**, including avalanche danger. Using this application does not guarantee user safety.
>
> **We strongly recommend**:
> - Proper training in snow science and avalanche safety
> - Always consulting official avalanche bulletins
> - Going accompanied and equipped with transceiver, shovel, and probe
> - Making conservative decisions when facing uncertainty

### References and Resources

| Organization | Link | Description |
|--------------|------|-------------|
| 🌤️ **AEMET** | [aemet.es](https://www.aemet.es) | Spanish Meteorological Agency - Avalanche bulletins |
| 🏔️ **RecMountain** | [recmountain.com](https://www.recmountain.com) | Mountain safety training and resources |
| 🔴 **Alurte** | [alurte.org](https://alurte.org) | Mountain Accident Victims Association |
| 📊 **ACNA** | [acna.cat](https://acna.cat) | Snow and Avalanche Knowledge Association |
| 🏔️ **Lauegi** | [lauegi.report](https://lauegi.report) | Aran-Pyrenees Avalanche Bulletin |
| ⛷️ **Montaña Segura** | [montanasegura.com](https://montanasegura.com) | Mountain accident prevention |

## 💝 Acknowledgments

This project would not have been possible without the inspiration, teachings, and support of extraordinary people:

- **Luis, Álvaro and Alberto Pantoja** — For their tireless work in snow science training and outreach, their practical and theoretical teachings, and for being a constant source of motivation for those of us who love winter mountains.

- **Jonay** — For his unwavering friendship and company on mountain adventures. For the shared days, laughter, and mutual support.

To all snow science professionals, mountain guides, rescuers, and enthusiasts who dedicate their time to making the mountains a safer place: **thank you**.

---

## 🔄 Reproducibility (Master Prompt)

<details>
<summary><strong>📜 View the complete Master Prompt (click to expand)</strong></summary>

This is the detailed prompt that allows regenerating this application from scratch using AI-assisted development tools (Vibe Coding):

```
Project Title: SnowStrat Viewer - GeoJSON Viewer for Snow Profiles

General Description: Create a single-page progressive web application (PWA) designed to import, 
visualize, and analyze snow stratigraphic profiles from standardized GeoJSON files 
(generated according to the AEMET guide model). The application must be installable, work offline, 
and be optimized for use on mobile devices in mountain environments with limited connectivity.

1. File Import and Management:
   - Import multiple .geojson files from device
   - Validate file structure according to expected schema
   - Store imported profiles in LocalStorage for persistence
   - Display list of imported profiles with name, date, and location
   - Allow deletion of individual profiles or all data

2. Profile Visualization (Detail Dashboard):
   When selecting a profile from the list, display a dashboard with:

   Section A (Map): Integrate an interactive map using OpenStreetMap (Leaflet) showing 
   the profile location with a marker and coordinates in WGS84 format.

   Section B (Stratigraphic Chart):
   - Y-Axis: Snow depth (0 cm at top, maximum depth at bottom)
   - Lower X-Axis (Bars): Resistance (120 to 0), colored according to IACS grain type code
   - Upper X-Axis (Line): Temperature (-24°C to 0°C)
   - Include IACS color legend
   - Zoom functionality in the chart

   Section C (Metadata): Table with date, time, observer, coordinates, altitude, 
   orientation, inclination, and notes.

   Section D (Tabular Data): Sortable table with all profile layers showing 
   depth, grain type, grain size, hardness, humidity, temperature, density, and notes.

3. Visual Standards and IACS:
   Strictly use IACS color palette for chart bars:
   PP: #00FF00, DF: #228B22, RG: #FFB6C1, FC: #ADD8E6, DH: #0000FF, 
   MF: #FF0000, IF: #8B0000, SH: #FF00FF, GP: #FFFF00

4. Multilingual System (I18N):
   Prepare the app for i18n with separate translation files.
   Languages: Spanish (default), Galician, Asturian, Basque, Catalan, Aranese, 
   Andorran, English, French, German, and Italian.
   Language selector in header with SVG flags.
   Language choice persistence in localStorage.

5. Technologies:
   - React 18+ with TypeScript
   - Vite as build tool
   - Tailwind CSS for styling
   - Leaflet for maps
   - Recharts for charts
   - i18next for internationalization
   - Lucide React for icons
   - shadcn/ui for components
   - vite-plugin-pwa for PWA functionality

6. PWA:
   - Manifest with icons for installation
   - Service Worker for offline functionality
   - Static resource caching
```

</details>

---

<div align="center">

**Made with ❄️ for the mountain community**

*Hecho con ❄️ para la comunidad de montaña*

</div>
