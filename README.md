# Sistema Integral de Gestión Hospitalaria (Stock, Menús Clínicos y Censo de Pacientes)

> **Proyecto Académico / Full-Stack Development**  
> Desarrollado por el equipo para la gestión automatizada y segura de insumos, prescripciones dietéticas clínicas y control categórico de pacientes internados en entornos hospitalarios.

---

## 📋 Tabla de Contenidos
1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Arquitectura y Roles del Sistema](#-arquitectura-y-roles-del-sistema)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Estructura de la Base de Datos (Modelo Relacional)](#-estructura-de-la-base-de-datos)
5. [Guía de Instalación y Ejecución](#-guía-de-instalación-y-ejecución)
6. [Estructura para Exposición (Puntos Clave)](#-estructura-para-exposición-puntos-clave)

---

## 🏥 Descripción del Proyecto
Este software resuelve una problemática crítica en la administración hospitalaria: la sincronización en tiempo real entre el **Departamento de Nutrición**, la **Cocina** y la **Administración**. 

Permite llevar un control riguroso del inventario de insumos alimenticios, registrar mermas o desperdicios (por ejemplo, plagas o productos dañados), emitir reportes de faltantes con niveles de urgencia hacia el administrador, prescribir dietas clínicas personalizadas según la patología del paciente internado y gestionar un censo categórico en tiempo real.

---

## 👥 Arquitectura y Roles del Sistema

El sistema implementa control de acceso basado en roles (RBAC) mediante **JWT (JSON Web Tokens)** y cifrado seguro de credenciales con **bcrypt**:

*   **Administrador (Admin):**
    *   Gestión completa de personal (altas, listado y restablecimiento seguro de contraseñas olvidadas).
    *   Ingreso y control de stock de productos, con alertas visuales automáticas de stock mínimo.
    *   Recepción y resolución de reportes de faltantes enviados por el área de cocina.
    *   Ingreso, asignación de habitación, cama, acompañantes y alta médica de pacientes con patologías predefinidas.
*   **Nutricionista:**
    *   Visualización del censo categórico de pacientes internados.
    *   Prescripción y asociación de menús/dietas clínicas diarias (ej. *Dieta Hiposódica, Dieta para Diabéticos, Celíacos, etc.*) directamente vinculadas al paciente, su habitación y cama.
*   **Cocinero:**
    *   Registro de consumo diario de insumos para la preparación de menús o registro de mermas/descartes.
    *   Visualización clara de los menús planificados del día ordenados por paciente, sala y patología.
    *   Módulo directo para solicitar insumos y reportar faltantes urgentes al Administrador.

---

## ⚙️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express.js.
*   **Base de Datos & ORM:** PostgreSQL, Sequelize ORM (con sincronización estructurada y relaciones FK).
*   **Frontend:** React.js, Axios, CSS Modularizado.
*   **Seguridad:** JSON Web Tokens (JWT), Bcrypt para hash de contraseñas, Middlewares de validación por roles.

---

## 📊 Estructura de la Base de Datos (Modelo Relacional)

El modelo relacional se compone de las siguientes entidades principales interconectadas:
1.  **Usuarios:** Gestión de credenciales, roles y permisos de acceso.
2.  **Pacientes:** Almacena datos personales, DNI, habitación, cama, acompañante, patología clínica estandarizada y observaciones opcionales.
3.  **Productos & LotesStock:** Inventario centralizado con control de unidades base (Kg, Lt, Unidades) y alertas de stock mínimo.
4.  **Consumos:** Registro de salidas de stock por preparación culinaria o merma/descarte.
5.  **Menus:** Prescripciones clínicas asociadas de forma relacional al paciente.
6.  **ReportesFaltantes:** Sistema de comunicación interna entre cocina y administración con marcas de resolución.

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para clonar, configurar y poner en marcha el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
STOCK/