---
inclusion: auto
---

# Arquitectura del Proyecto

Documento técnico general que describe la estructura y convenciones de todos los proyectos que siguen esta arquitectura. Aplica a este proyecto y a cualquier otro que siga la misma estructura.

## Stack Tecnológico

- **Backend**: Node.js + Express
- **Vistas**: EJS (server-side rendering)
- **ORM**: Sequelize
- **Base de datos**: MySQL
- **Frontend JS**: Vanilla JS con ES Modules (`import/export`)
- **CSS**: Clases utilitarias propias (no framework)
- **Sesiones**: express-session
- **PDF**: pdfkit
- **Excel**: exceljs
- **ZIP**: JSZip (CDN en frontend)

## Estructura de Carpetas

```
├── app.js                          # Entry point, configuración Express, rutas, middlewares
├── database/
│   ├── config/config.js            # Configuración de Sequelize (DB connection)
│   ├── models/                     # Modelos Sequelize (uno por tabla)
│   │   ├── index.js                # Auto-loader de modelos
│   │   ├── Master.js
│   │   ├── Import.js
│   │   └── ...
│   ├── migrations/
│   └── seeders/
├── public/                         # Archivos estáticos (servidos por Express)
│   ├── css/                        # CSS con clases utilitarias
│   ├── fonts/                      # Fuentes para PDFs
│   ├── images/                     # Imágenes y logos
│   ├── files/                      # Archivos subidos
│   └── js/                         # JavaScript del frontend
│       ├── domain.js               # URL base de la API
│       ├── globals.js              # Variables globales compartidas (formatters, etc)
│       ├── globalUtils.js          # Utilidades compartidas del frontend
│       └── {modulo}/               # Carpeta por módulo (ver sección Frontend JS)
├── sqlScriptsAndData/              # Scripts SQL de creación de tablas y datos
├── src/
│   ├── controllers/                # Controladores
│   │   ├── appController.js        # Renderiza vistas (GET de páginas)
│   │   ├── getController.js        # APIs GET de datos
│   │   ├── createController.js     # APIs POST de creación
│   │   ├── updateController.js     # APIs PUT/POST de actualización
│   │   └── composedController.js   # APIs compuestas (lógica de negocio compleja)
│   ├── data/                       # Datos estáticos (menús, meses, etc)
│   ├── dbQueries/                  # Queries Sequelize (uno por modelo)
│   ├── middlewares/                # Middlewares de Express
│   ├── routes/
│   │   ├── appRoutes.js            # Rutas de vistas (GET de páginas)
│   │   └── apisRoutes/             # Rutas de APIs
│   │       ├── getRoutes.js
│   │       ├── createRoutes.js
│   │       ├── updateRoutes.js
│   │       └── composedRoutes.js
│   ├── utils/                      # Utilidades del backend
│   └── views/                      # Vistas EJS
│       ├── partials/               # Partials compartidos (head, header, popups)
│       └── {modulo}/               # Carpeta por módulo (ver sección Vistas)
└── .kiro/
    ├── steering/                   # Steering files
    ├── templates/                  # Templates (modelQueries.js, etc)
    ├── hooks/                      # Agent hooks
    └── specs/                      # Specs de features
```

## Convenciones de Nombres

### Modelos (`database/models/`)
- Nombre del archivo: nombre de la tabla en **singular**, primera letra en mayúscula
  - `imports_details` → `Import_detail.js`
  - `master` → `Master.js`
  - `data_suppliers` → `Data_supplier.js`
  - `prices_lists` → `Price_list.js`
- El `alias` dentro del modelo usa el nombre de la tabla tal cual (plural): `"Imports_details"`, `"Master"`, `"Prices_lists"`
- `tableName` en config coincide exactamente con el nombre de la tabla en SQL

### Queries (`src/dbQueries/`)
- Nombre del archivo: alias del modelo en **camelCase** + "Queries"
  - `Imports_details` → `importsDetailsQueries.js`
  - `Master` → `masterQueries.js`
  - `Prices_lists` → `pricesListsQueries.js`
- Siempre copiar `.kiro/templates/modelQueries.js` como base

### Rutas
- Rutas de vistas en `appRoutes.js` (GET que renderizan EJS)
- APIs separadas por operación: `getRoutes.js`, `createRoutes.js`, `updateRoutes.js`, `composedRoutes.js`
- Prefijos: `/get/`, `/create/`, `/update/`, `/composed/`

### Controllers
- `appController.js`: solo renderiza vistas, pasa datos necesarios al EJS
- `getController.js`: APIs que devuelven datos (JSON)
- `createController.js`: APIs que crean registros
- `updateController.js`: APIs que actualizan registros
- `composedController.js`: APIs con lógica de negocio compleja (cálculos, descargas, etc)

## Patrón de Vistas EJS

Cada módulo tiene su carpeta en `src/views/{modulo}/`:

```
src/views/master/
├── master.ejs              # Vista principal del módulo
├── masterCEIPP.ejs         # Popup: Create/Edit Item PopUp
├── masterCOPP.ejs          # Popup: Confirm Operation PopUp
└── masterFAPP.ejs          # Popup: Factors PopUp
```

### Estructura de un EJS principal:
1. `<%- include('../partials/head') %>` — head HTML con CSS y librerías
2. `<%- include('../partials/header') %>` — header con menú de navegación
3. Título de la página
4. Acciones generales (botones dga: crear, descargar, etc)
5. Filtros (inputs de búsqueda)
6. Tabla de datos
7. Includes de popups
8. Loader
9. Script del módulo (`<script type="module" src="/js/{modulo}/{modulo}.js">`)

### Convención de nombres de popups:
- `CEIPP` = Create/Edit Item PopUp
- `COPP` = Confirm Operation PopUp
- `FAPP` = Factors PopUp
- `EIPP` = Edit Item PopUp
- `RIPP` = Remove Item PopUp
- `SSPP` = Specific Section PopUp

## Patrón de Frontend JS

Cada módulo tiene su carpeta en `public/js/{modulo}/`:

```
public/js/master/
├── master.js               # JS principal: carga datos, event listeners, filtros
├── globals.js              # Variables globales del módulo (filters, popups, inputs)
├── printTable.js           # Renderiza la tabla HTML y sus event listeners
├── masterCEIPP.js          # Lógica del popup CEIPP (crear/editar)
├── masterCOPP.js           # Lógica del popup COPP (confirmar)
└── utils.js                # Utilidades del módulo (getData, resetData, etc)
```

### Archivos compartidos en `public/js/`:
- `domain.js` — exporta la URL base de la API
- `globals.js` — formatters de números (`Intl.NumberFormat`), variables globales
- `globalUtils.js` — utilidades compartidas: `showTooltips`, `closePopups`, `closeWithEscape`, `clearInputs`, `replaceDotWithComa`

### Patrón del JS principal (`master.js`):
1. Imports de módulos
2. `window.addEventListener('load', async () => { ... })`
3. Carga de datos iniciales via `fetch`
4. `printTable()` para renderizar la tabla
5. Event listeners de tooltips, popups, filtros
6. Event listeners de acciones (crear, descargar, etc)
7. Scroll infinito para paginación

## CSS Utilitario

Clases utilitarias propias organizadas por archivo:
- `width.css` — `.w-100` (100px), `.w-95p` (95%)
- `height.css` — `.h-35` (35px)
- `margins.css` — `.mt-25` (margin-top 25px), `.m-a` (margin auto)
- `paddings.css` — `.pad-9-0-7-0`
- `texts.css` — `.fs-13` (font-size 13px), `.fw-b` (font-weight bold), `.ta-c` (text-align center)
- `display.css` — `.not-visible` (display none !important), `.flex-r`, `.flex-c`
- `borders.css` — `.bs-gray-1`
- `topAndBottom.css` — `.top-20p` (top 20%)
- `leftAndRight.css` — `.r-7p` (right 7%)
- `styles.css` — Variables CSS (`:root`), colores corporativos

### Variables CSS principales:
- `--color1: #15A89D` (color corporativo principal)
- `--color2: #F4F4F4` (fondo header)
- `--color4: #11847c` (variante oscura)
- `--errorColor: rgb(221, 7, 7)`

## Patrón de Datos

### Sucursales (branches)
- Cada dato pertenece a una sucursal (`id_branches`)
- La sucursal activa se guarda en `req.session.branch`
- Se pasa a las vistas como `branch` para mostrar en el header

### Eliminación lógica
- Campo `enabled` (1 = activo, 0 = eliminado)
- Nunca se borran registros físicamente

### Paginación
- Backend: `findAndCountAll` con `limit` y `offset`
- Frontend: scroll infinito, carga de 25 items por página

## SQL Scripts

Los archivos `.sql` en `sqlScriptsAndData/` contienen:
- `CREATE TABLE` con tipos, constraints y foreign keys
- Comentarios en las `REFERENCES` indican el nombre del `as` para la asociación: `/* branch_data */`
- Comentarios `/* don't include in dbQueries */` indican que esa asociación NO debe incluirse en el `include` del query
- Comentarios `hasMany` debajo de la tabla indican asociaciones `hasMany` con su `as` y `foreignKey`
