// ==========================================
// ARCHIVO PRINCIPAL DEL BACKEND (index.js)
// ==========================================

// Importación de Frameworks y Librerías de terceros
const express = require('express'); // Framework minimalista para Node.js que gestiona rutas y servidor HTTP
const cors = require('cors'); // Middleware para permitir peticiones entre Frontend (puerto 5173) y Backend (puerto 3000)
require('dotenv').config(); // Carga las variables de entorno del archivo .env a process.env

// Importación de la conexión a la Base de Datos (Sequelize)
const sequelize = require('./config/db'); // Instancia de Sequelize conectada a PostgreSQL

// Importación de los Modelos de la Aplicación
const Usuario = require('./models/Usuario'); // Modelo de Usuarios (Administrador, Nutricionista, Cocinero)
require('./models/producto'); // Modelo de productos/insumos de la cocina
require('./models/lote'); // Modelo de lotes y fechas de vencimiento
require('./models/consumo'); // Modelo de salidas y consumos de stock
require('./models/sector'); // Modelo de sectores u áreas del hospital
require('./models/menu'); // Modelo de menús nutricionales
require('./models/menuIngrediente'); // Relación entre menús e ingredientes
require('./models/planillaRacion'); // Modelo de planillas generales de raciones
require('./models/planillaSector'); // Modelo de distribución por sector
require('./models/detallePlanillaMenu'); // Modelo de detalles de menús en planillas

// Librería de cifrado para contraseñas
const bcrypt = require('bcryptjs');

// Inicialización de Express y puerto
const app = express(); 
const PORT = process.env.PORT || 3000;

// Configuración de Middlewares globales
app.use(cors()); // Habilita peticiones desde otros orígenes
app.use(express.json()); // Transforma el cuerpo de las peticiones HTTP (req.body) a formato JSON

// ==========================================
// REGISTRO DE RUTAS (Endpoints de la API REST)
// ==========================================
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/lotes', require('./routes/loteRoutes'));
app.use('/api/consumos', require('./routes/consumoRoutes'));
app.use('/api/sectores', require('./routes/sectorRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/menu-ingredientes', require('./routes/menuIngredienteRoutes'));
app.use('/api/planillas-raciones', require('./routes/planillaRacionRoutes'));
app.use('/api/planilla-sectores', require('./routes/planillaSectorRoutes'));
app.use('/api/detalle-planilla-menu', require('./routes/detallePlanillaMenuRoutes'));
app.use('/api/pacientes', require('./routes/pacienteRoutes'));
app.use('/api/reportes', require('./routes/reporteFaltanteRoutes'));

// ==========================================
// FUNCIÓN DE SIEMBRA AUTOMÁTICA DE USUARIOS (DATA SEEDING)
// ==========================================
// Garantiza la existencia de usuarios de prueba para cada rol al iniciar la aplicación
const crearUsuariosPorDefecto = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123', salt); // Contraseña por defecto: 123

    // 1. Crear Administrador por defecto si no existe
    const adminExistente = await Usuario.findOne({ where: { email: 'admin@hospital.com' } });
    if (!adminExistente) {
      await Usuario.create({
        name: 'Administrador',
        surname: 'General',
        email: 'admin@hospital.com',
        password: passwordHash,
        rol: 'administrador',
        activo: true
      });
      console.log('👑 [SEED] Admin creado: admin@hospital.com / 123');
    }

    // 2. Crear Nutricionista por defecto si no existe
    const nutricionistaExistente = await Usuario.findOne({ where: { email: 'nutricionista@hospital.com' } });
    if (!nutricionistaExistente) {
      await Usuario.create({
        name: 'Ana',
        surname: 'Gómez',
        email: 'nutricionista@hospital.com',
        password: passwordHash,
        rol: 'nutricionista',
        activo: true
      });
      console.log('🥗 [SEED] Nutricionista creado: nutricionista@hospital.com / 123');
    }

    // 3. Crear Cocinero por defecto si no existe
    const cocineroExistente = await Usuario.findOne({ where: { email: 'cocinero@hospital.com' } });
    if (!cocineroExistente) {
      await Usuario.create({
        name: 'Carlos',
        surname: 'Pérez',
        email: 'cocinero@hospital.com',
        password: passwordHash,
        rol: 'cocinero',
        activo: true
      });
      console.log('🍳 [SEED] Cocinero creado: cocinero@hospital.com / 123');
    }

  } catch (error) {
    console.error('❌ Error al intentar crear usuarios por defecto:', error);
  }
};

// ==========================================
// SINCRONIZACIÓN DE LA BD Y ARRANQUE DEL SERVIDOR
// ==========================================
sequelize.sync({ alter: true }) // Sincroniza los modelos con PostgreSQL y actualiza la estructura si hay cambios
  .then(async () => {
    console.log('Base de datos conectada y sincronizada correctamente.');

    // Ejecuta la siembra automática de usuarios
    await crearUsuariosPorDefecto();

    // Arranca el servidor HTTP
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });