# 🏥 Sistema Integral de Gestión Hospitalaria (Stock, Menús Clínicos y Censo de Pacientes)

> **Proyecto Académico / Full-Stack Development**  
> Plataforma web integral diseñada para automatizar y sincronizar en tiempo real la gestión de inventario alimenticio, las prescripciones dietéticas clínicas y el censo categórico de pacientes internados entre las áreas de **Administración**, **Nutrición** y **Cocina**.

---

## 📋 Tabla de Contenidos
1. [Descripción y Problemática Resuelta](#-descripción-y-problemática-resuelta)
2. [Arquitectura de Roles y Seguridad](#-arquitectura-de-roles-y-seguridad)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Diccionario de Datos y Relaciones (Modelo Relacional)](#-diccionario-de-datos-y-relaciones-modelo-relacional)
5. [Guía de Instalación y Ejecución](#-guía-de-instalación-y-ejecución)
6. [Guion Estructurado para Exposición Académica](#-guion-estructurado-para-exposición-académica)

---

## 🎯 Descripción y Problemática Resuelta
En entornos hospitalarios, la descoordinación entre el ingreso de pacientes, la prescripción médica de dietas y el stock disponible en cocina genera riesgos clínicos y desperdicio de insumos. Este sistema resuelve dicha problemática centralizando toda la operación:

* **Estandarización Clínica:** Evita errores de tipeo mediante un catálogo cerrado de patologías predefinidas y un censo que agrupa pacientes tanto de forma individual como categórica.
* **Control de Stock y Mermas:** Descuenta automáticamente insumos por preparación diaria o descarte operativo (ej. plagas o vencimiento) y dispara alertas visuales al alcanzar el stock mínimo.
* **Comunicación Interna en Tiempo Real:** Permite a cocina emitir reportes de faltantes con niveles de prioridad (`Normal` / `Urgente`) directamente hacia el panel del administrador.

---

## 👥 Arquitectura de Roles y Seguridad

El acceso está protegido mediante autenticación **JWT (JSON Web Tokens)**, contraseñas cifradas con **bcrypt** y middlewares de validación de permisos (RBAC):

| Rol | Responsabilidades Principales |
| :--- | :--- |
| **Administrador** | • Gestión completa de personal (altas, listado y **restablecimiento seguro de contraseñas** olvidadas).<br>• Ingreso de lotes/productos al stock y monitoreo de alertas de reposición.<br>• Recepción y resolución de reportes de faltantes enviados por cocina.<br>• Ingreso hospitalario (asignación de habitación, cama, patología y acompañantes) y alta médica de pacientes. |
| **Nutricionista** | • Visualización del censo categórico e individual de pacientes internados.<br>• Prescripción y asignación de dietas clínicas diarias (ej. *Hiposódica, Diabéticos, Celíacos, Blanda*) vinculadas directamente al paciente y su sala. |
| **Cocinero** | • Visualización de los menús planificados del día detallando paciente, habitación, cama y patología.<br>• Registro de consumo de insumos por preparación o reporte de mermas/descartes.<br>• Emisión directa de solicitudes de insumos y alertas de faltantes hacia el Administrador. |

---

## ⚙️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js.
* **Base de Datos & ORM:** PostgreSQL, Sequelize ORM (sincronización automática e integridad referencial).
* **Frontend:** React.js (Vite), Axios, CSS3.
* **Seguridad:** JSON Web Tokens (JWT), Bcrypt.

---

## 🗄️ Diccionario de Datos y Relaciones (Modelo Relacional)

A continuación se detalla cada una de las entidades que componen la base de datos y su cardinalidad dentro del modelo relacional:

### 1. `Usuarios`
* **Función:** Almacena las credenciales y perfiles del personal autorizado (`administrador`, `nutricionista`, `cocinero`).
* **Relaciones:**
  * `1:N` con **`PlanillasRaciones`**: Un usuario puede generar múltiples planillas de raciones.
  * `1:N` con **`Consumos`**: Un cocinero registra múltiples movimientos de salida o merma de stock.
  * `1:N` con **`ReportesFaltantesCocinero`**: Un cocinero emite múltiples alertas de insumos faltantes.

### 2. `PatologiasPredefinidas`
* **Función:** Catálogo maestro estandarizado de diagnósticos y restricciones alimentarias (*Ninguna / General, Diabetes, Hipertensión, Cuadro Gastrointestinal, Celiaquía, Post-Operatorio, Insuficiencia Renal*).
* **Relaciones:**
  * `1:N` con **`PacientesInternados`**: Una patología estandarizada puede estar asociada a múltiples pacientes internados simultáneamente.

### 3. `PacientesInternados`
* **Función:** Censo activo de internación. Almacena datos personales (`nombre`, `apellido`, `dni`), ubicación (`habitacion`, `cama`), datos de acompañantes, observaciones clínicas opcionales (ej. alergias) y estado (`activo`) para gestionar altas médicas.
* **Relaciones:**
  * `N:1` con **`PatologiasPredefinidas`**: Cada paciente pertenece a una categoría clínica específica.
  * `1:N` con **`Menus`**: Un paciente internado puede recibir múltiples prescripciones de menús diarios durante su estadía.

### 4. `Menus`
* **Función:** Define los protocolos dietéticos planificados por nutrición y la descripción detallada del menú del día (almuerzo/cena).
* **Relaciones:**
  * `N:1` con **`PacientesInternados`**: Asocia la dieta clínica directamente al paciente, su cama y habitación (o permite menús generales).
  * `1:N` con **`MenuIngredientes`**: Un menú se compone de múltiples ingredientes del inventario.
  * `1:N` con **`DetallePlanillaMenu`**: Vincula los menús a las planillas de distribución sectorial.

### 5. `MenuIngredientes` *(Tabla Intermedia)*
* **Función:** Resuelve la relación muchos a muchos (`N:N`) entre `Menus` y `Productos`, especificando la cantidad exacta y unidad de medida requerida por ingrediente para elaborar cada dieta.
* **Relaciones:** `N:1` con **`Menus`** y `N:1` con **`Productos`**.

### 6. `Productos`
* **Función:** Catálogo central del inventario alimenticio. Controla el `stock_actual`, la `unidad_base` (`Kg`, `Lt`, `Unidad`, `Gr`) y el `stock_minimo` para disparar alertas automáticas de reposición.
* **Relaciones:**
  * `1:N` con **`LotesStock`**: Un producto ingresa al depósito dividido en múltiples lotes con fechas de vencimiento propias.
  * `1:N` con **`Consumos`**: El stock del producto se descuenta cada vez que se registra un consumo o descarte.
  * `1:N` con **`MenuIngredientes`**.

### 7. `LotesStock`
* **Función:** Garantiza la trazabilidad de la mercadería ingresada registrando `numero_lote`, `fecha_adquisicion`, `fecha_vencimiento`, `cantidad_inicial` y `cantidad_actual`.
* **Relaciones:**
  * `N:1` con **`Productos`**: Cada lote pertenece a un producto específico.
  * `1:N` con **`Consumos`**: Permite descontar stock de lotes puntuales (ej. sistema FIFO / primero en vencer).

### 8. `Consumos`
* **Función:** Auditoría de salidas de inventario ejecutadas por cocina, diferenciando entre preparación de menús diarios y mermas/descartes operativos (productos dañados o con plagas).
* **Relaciones:**
  * `N:1` con **`Productos`** (insumo descontado).
  * `N:1` con **`Usuarios`** (cocinero responsable del registro).
  * `N:1` opcional con **`LotesStock`** y **`PlanillasRaciones`**.

### 9. `ReportesFaltantesCocinero`
* **Función:** Canal directo de alerta operativa entre cocina y administración para solicitar reposición urgente de insumos (`producto_solicitado`, `cantidad_necesaria`, `urgencia`, `observacion_adicional` y estado `resuelto`).
* **Relaciones:**
  * `N:1` con **`Usuarios`**: Vincula el reporte con el cocinero que lo origina y el administrador que lo resuelve.

### 10. Módulo Logístico (`PlanillasRaciones`, `PlanillaSectores`, `SectoresDestinatarios`, `DetallePlanillaMenu`)
* **Función:** Conjunto de tablas relacionales (`1:N` y `N:N`) destinadas a la planificación de volúmenes masivos de raciones por tipo de comida (Desayuno, Almuerzo, Cena) y su distribución hacia los distintos sectores o pabellones del hospital.

---

## 🚀 Guía de Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd STOCK
```

### 2. Configurar e iniciar el Backend
```bash
cd backend
npm install
```
Crea un archivo `.env` dentro de la carpeta `backend/` con las siguientes variables de entorno:
```env
PORT=3000
DB_NAME=hospital_stock
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
JWT_SECRET=secreto_super_seguro_hospital
```
Ejecuta el servidor:
```bash
npm run dev
```

### 3. Configurar e iniciar el Frontend
En una nueva terminal, ingresa a la carpeta `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
Accede desde tu navegador a `http://localhost:5173`.

---

## 🎤 Guion Estructurado para Exposición Académica

1. **Apertura y Problemática (30 seg):**  
   Presentar el objetivo del sistema: eliminar la desconexión entre Administración, Nutrición y Cocina en un hospital, evitando errores en dietas clínicas y quiebres de stock.
2. **Seguridad y Control de Roles (1 min):**  
   Mostrar el inicio de sesión con JWT y destacar la herramienta administrativa de **restablecimiento de contraseñas** para empleados que olviden su clave.
3. **Censo Categórico e Individual de Pacientes (1.5 min):**  
   Demostrar el alta de un paciente seleccionando una patología estandarizada y mostrar cómo las tarjetas superiores agrupan automáticamente la cantidad de pacientes por categoría (ej. *Diabetes*, *Hipertensión*) para facilitar la planificación masiva.
4. **Circuito Completo: Nutrición ➔ Cocina ➔ Admin (1.5 min):**  
   Asignar una dieta como Nutricionista, visualizarla en Cocina con datos de habitación/cama, registrar una merma de inventario y enviar un **Reporte de Faltante Urgente** que el Administrador recibe y resuelve en vivo.
5. **Cierre Técnico (30 seg):**  
   Resumir la arquitectura Full-Stack (React + Node.js/Express + Sequelize/PostgreSQL) y la integridad referencial del modelo relacional implementado.