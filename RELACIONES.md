Aquí tienes la explicación detallada, técnica y completa de **todas y cada una de las tablas** que componen la arquitectura del Sistema Integral de Gestión Hospitalaria, junto con el **tipo de relación** (cardinalidad) que mantiene cada una dentro del modelo relacional:

---

### 1. **Tabla: `Usuarios**`

* **Descripción:** Almacena la información de todo el personal del hospital que tiene acceso al sistema (Administradores, Nutricionistas y Cocineros). Gestiona sus credenciales de seguridad mediante contraseñas cifradas con `bcrypt` y tokens de sesión JWT.
* **Relaciones:**
* Relación con **`PlanillasRaciones` (1:N)**: Un usuario (generalmente de nutrición o cocina) puede crear o registrar múltiples planillas de distribución.
* Relación con **`Consumos` (1:N)**: Un cocinero puede registrar múltiples operaciones de consumo o merma de inventario.
* Relación con **`ReportesFaltantesCocinero` (1:N)**: Un cocinero puede emitir múltiples reportes o solicitudes de insumos faltantes al administrador.



---

### 2. **Tabla: `PatologiasPredefinidas**`

* **Descripción:** Catálogo maestro estandarizado de diagnósticos y restricciones clínicas alimentarias (ej. *Ninguna / General, Diabetes, Hipertensión, Cuadro Gastrointestinal, Celiaquía, Post-Operatorio*). Evita errores de escritura libre y unifica criterios.
* **Relaciones:**
* Relación con **`PacientesInternados` (1:N)**: Una patología estandarizada puede estar presente en múltiples pacientes internados de forma simultánea.



---

### 3. **Tabla: `PacientesInternados**`

* **Descripción:** Registra el censo activo de pacientes en el hospital. Almacena sus datos personales (DNI), la patología clínica asignada mediante clave foránea, observaciones clínicas (ej. alergia a la lactosa, ayuno), número de habitación, cama, datos de acompañantes y un indicador lógico (`activo`) para gestionar altas médicas.
* **Relaciones:**
* Relación con **`PatologiasPredefinidas` (N:1)**: Cada paciente está asociado a una patología clínica específica del catálogo.
* Relación con **`Menus` (1:N)**: Un paciente internado puede tener asignados menús o prescripciones dietéticas diarias específicas.



---

### 4. **Tabla: `Menus**`

* **Descripción:** Define los protocolos de dietas clínicas planificadas (ej. *Dieta Hiposódica, Dieta para Diabéticos*) asociando directamente el menú al paciente internado, su habitación, cama y la descripción detallada de almuerzo o cena.
* **Relaciones:**
* Relación con **`PacientesInternados` (N:1)**: Varios menús diarios pueden recaer o estar asignados a un paciente en particular (o ser de carácter general).
* Relación con **`MenuIngredientes` (1:N)**: Un menú clínico se compone de múltiples ingredientes o productos del inventario.
* Relación con **`DetallePlanillaMenu` (1:N)**: Permite asociar los menús a las planillas operativas de distribución sectorial.



---

### 5. **Tabla: `MenuIngredientes` (Tabla Intermedia N:N)**

* **Descripción:** Tabla puente que resuelve la relación de muchos a muchos entre los menús clínicos y los productos del inventario, especificando la cantidad exacta y la unidad de medida necesaria para elaborar dicha receta o dieta.
* **Relaciones:**
* Relación con **`Menus` (N:1)**.
* Relación con **`Productos` (N:1)**.



---

### 6. **Tabla: `Productos**`

* **Descripción:** Catálogo centralizado de todos los insumos alimenticios y materiales de cocina disponibles (ej. *Arroz, Pollo, Aceite, Sal*). Almacena el stock actual, la unidad base de medida (`Kg`, `Lt`, `Unidad`) y el **stock mínimo** para activar alertas visuales automáticas al administrador.
* **Relaciones:**
* Relación con **`MenuIngredientes` (N:1)**.
* Relación con **`LotesStock` (1:N)**: Un producto puede ingresar al inventario en múltiples lotes de adquisición a lo largo del tiempo.
* Relación con **`Consumos` (1:N)**: Un producto se ve afectado (descontado) a medida que se registra su consumo o descarte.



---

### 7. **Tabla: `LotesStock**`

* **Descripción:** Permite un control estricto de trazabilidad por lotes de mercadería ingresada, registrando el número de lote, fecha de adquisición, fecha de vencimiento y las cantidades iniciales y actuales disponibles.
* **Relaciones:**
* Relación con **`Productos` (N:1)**: Cada lote pertenece a un producto específico del inventario.
* Relación con **`Consumos` (1:N)**: Los consumos de cocina pueden descontar stock directamente de lotes específicos.



---

### 8. **Tabla: `Consumos**`

* **Descripción:** Registra las salidas de inventario realizadas por el personal de cocina. Distingue entre la preparación culinaria diaria de menús y el registro de mermas o descartes operativos (por ejemplo, productos dañados o con plagas como gorgojos).
* **Relaciones:**
* Relación con **`Productos` (N:1)**: Producto que se descuenta.
* Relación con **`LotesStock` (N:1, opcional)**: Lote específico del que se extrae la mercadería.
* Relación con **`Usuarios` (N:1)**: Registra qué cocinero ejecutó la operación.
* Relación con **`PlanillasRaciones` (N:1, opcional)**: Viste el consumo vinculado a una planificación de raciones.



---

### 9. **Tabla: `ReportesFaltantesCocinero**`

* **Descripción:** Módulo de comunicación operativa directa entre el área de cocina y la administración. Permite al cocinero reportar insumos agotados, especificando cantidades necesarias, nivel de prioridad (`Normal` u `Urgente`) y observaciones. El administrador supervisa estas alertas y las marca como resueltas.
* **Relaciones:**
* Relación con **`Usuarios` (N:1)**: Identifica al cocinero que generó la alerta de faltante y al administrador que la gestiona.



---

### 10. **Tablas Operativas de Planificación (`PlanillasRaciones`, `PlanillaSectores`, `SectoresDestinatarios`, `DetallePlanillaMenu`)**

* **Descripción:** Conjunto de tablas encargadas de la logística de distribución masiva de raciones por sectores del hospital (ej. pabellones, pisos o alas específicas), organizando los volúmenes de comida solicitados por sector y tipo de comida (Almuerzo/Cena).
* **Relaciones:** Interconectadas mediante claves foráneas de tipo **1:N** y **N:N** para gestionar la asignación sectorial de planillas y la cantidad de raciones por menú.