# SnowStrat Viewer — Manual de Usuario

## 1. Introducción

SnowStrat Viewer es una aplicación web progresiva (PWA) diseñada para visualizar y analizar perfiles estratigráficos de nieve a partir de archivos GeoJSON estandarizados según el modelo AEMET. La aplicación funciona completamente offline y almacena los datos de forma local en el navegador.

## 2. Flujo de Trabajo Principal

### 2.1 Importación de Perfiles

1. Haz clic en el botón **"Importar GeoJSON"** en la cabecera de la aplicación.
2. Se abrirá un selector de archivos del sistema operativo.
3. Selecciona uno o varios archivos `.geojson` que contengan perfiles nivológicos.
4. Los perfiles se cargarán automáticamente y aparecerán en la **barra lateral izquierda**.
5. Si no había ningún perfil seleccionado, se seleccionará automáticamente el último perfil importado.
6. Aparecerá una notificación confirmando cuántos perfiles se han importado correctamente.

### 2.2 Visualización del Perfil

Una vez importado y seleccionado un perfil, el panel principal muestra:

#### Metadatos del Perfil
- **Nombre** del perfil y **observador**.
- **Fecha y hora** de la observación.
- **Temperatura** ambiente registrada.
- **Coordenadas** geográficas (en formato GMS y Decimal).
- **Altitud** del punto de observación.
- **Altura total** del manto nivoso y número de **muestras**.
- **Observaciones** adicionales del observador.

#### Mapa de Ubicación
- Mapa interactivo que muestra la localización exacta del perfil.
- Permite hacer zoom y desplazarse por el mapa.

#### Gráfico Estratigráfico
- **Eje vertical (Y)**: Altura en centímetros, con la superficie en la parte superior.
- **Eje horizontal**: Resistencia (N) representada con barras coloreadas según el tipo de grano IACS.
- **Línea de temperatura**: Superpuesta al gráfico con puntos en el centro de cada estrato.
- **Tests de Compresión (CT)**: Marcadores visuales posicionados según su referencia (desde la superficie o desde el suelo).
- **Controles de zoom**: Permite ampliar y reducir la vista del gráfico.

#### Leyenda IACS
- Muestra los **tipos de grano** según la clasificación internacional IACS con sus colores y símbolos correspondientes.

#### Tabla de Datos de Muestras
- Tabla detallada con todas las muestras del perfil:
  - Número de muestra (#)
  - Altura (cm)
  - Altura acumulada (cm)
  - Temperatura (°C)
  - Resistencia
  - Tipo de grano
  - Diámetro (mm)
  - Humedad
  - Hora de la toma

#### Tabla de Tests de Compresión (CT)
- Si el perfil incluye tests CT, se muestra una tabla adicional con los resultados de cada test.

### 2.3 Análisis con SnowAI

1. Con un perfil seleccionado, desplázate hasta la sección **SnowAI** en la parte inferior del panel.
2. Pulsa el botón **"Analizar"** para enviar los datos del perfil al asistente de inteligencia artificial.
3. SnowAI generará un análisis detallado que incluye:
   - Evaluación de la estabilidad del manto nivoso.
   - Identificación de capas débiles y procesos de metamorfismo.
   - Interpretación de los tests de compresión.
   - Recomendaciones de seguridad basadas en los datos.
4. La respuesta se muestra con formato enriquecido y scroll automático para respuestas largas.
5. **Aviso importante**: SnowAI es una herramienta orientativa. Sus respuestas no sustituyen el juicio profesional ni las guías oficiales de seguridad en montaña.

## 3. Gestión de Perfiles

### 3.1 Barra Lateral de Perfiles

La barra lateral izquierda muestra todos los perfiles importados con la siguiente información resumida:
- **Nombre** del perfil.
- **Altitud** del punto de observación.
- **Número de muestras** del perfil.

#### Seleccionar un perfil
- Haz clic sobre cualquier perfil en la lista para seleccionarlo y visualizar sus datos en el panel principal.

#### Eliminar un perfil individual
- Cada perfil en la lista tiene un botón de eliminación que permite borrarlo de forma individual.

### 3.2 Eliminar Todos los Perfiles

1. Haz clic en el botón de **eliminar todos** (icono de papelera) en la cabecera, junto al contador de perfiles.
2. Aparecerá un diálogo de confirmación con el mensaje: *"¿Eliminar todos los perfiles?"*.
3. Confirma la acción pulsando **"Eliminar todos"** o cancela con **"Cancelar"**.
4. Esta acción es irreversible y eliminará todos los perfiles importados.

## 4. Selección de Idioma

1. En la cabecera de la aplicación, localiza el **selector de idioma** (icono de bandera).
2. Haz clic para desplegar la lista de idiomas disponibles.
3. Selecciona el idioma deseado. La interfaz se actualizará inmediatamente.

### Idiomas disponibles:
| Idioma | Nombre nativo |
|--------|--------------|
| Español | Español |
| Gallego | Galego |
| Asturiano | Asturianu |
| Euskera | Euskara |
| Catalán | Català |
| Aranés | Aranés |
| Andorrano | Andorrà |
| Inglés | English |
| Francés | Français |
| Alemán | Deutsch |
| Italiano | Italiano |

## 5. Exportación a PDF

1. Con un perfil seleccionado, haz clic en el botón **"Exportar PDF"** en la cabecera.
2. Se generará un informe técnico en formato PDF que incluye:
   - Logo de la aplicación y metadatos del perfil.
   - Gráfico estratigráfico con leyenda IACS.
   - Tabla de datos de muestras.
   - Tabla de Tests de Compresión (si aplica).
3. El archivo PDF se descargará automáticamente.

## 6. Funcionamiento Offline

SnowStrat Viewer es una **PWA (Progressive Web App)** que funciona sin conexión a internet:
- Los perfiles importados se almacenan localmente en el navegador.
- Todas las funcionalidades de visualización y gestión están disponibles offline.
- La función SnowAI requiere conexión a internet para el análisis.

## 7. Información Adicional

- **Licencia**: Uso no comercial permitido bajo Licencia Polyform Noncommercial.
- **Datos**: Todos los datos se almacenan exclusivamente en el navegador del usuario. No se envían datos a servidores externos excepto para el análisis de SnowAI.
- **Autor**: Iván de Vicente Sánchez © 2026.
