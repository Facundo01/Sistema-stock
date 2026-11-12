import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const PATOLOGIAS_PREDEFINIDAS = [
  'Ninguna / General',
  'Diabetes',
  'Hipertensión / Hiposódica',
  'Cuadro Gastrointestinal (Diarrea / Blanda)',
  'Celiaquía (Libre de TACC)',
  'Post-Operatorio / Líquida',
  'Insuficiencia Renal',
  'Otra (Ver observaciones)'
];

function App() {
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Listados sincronizados con el backend
  const [productos, setProductos] = useState([]);
  const [menus, setMenus] = useState([]);
  const [usuariosLista, setUsuariosLista] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [reportes, setReportes] = useState([]);

  // Filtro interactivo para la vista categórica de pacientes
  const [filtroPatologia, setFiltroPatologia] = useState('TODAS');

  // Estados Admin - Productos
  const [formDataProducto, setFormDataProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    stock_minimo: '',
    stock_actual: '',
    unidad_base: ''
  });
  const [mensajeProducto, setMensajeProducto] = useState('');

  // Estados Admin - Personal
  const [formDataUser, setFormDataUser] = useState({
    name: '',
    surname: '',
    dni: '',
    email: '',
    password: '',
    rol: 'cocinero'
  });
  const [mensajeUser, setMensajeUser] = useState('');

  // Estados Admin - Pacientes
  const [formDataPaciente, setFormDataPaciente] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    patologia: 'Ninguna / General',
    observaciones: '',
    habitacion: '',
    cama: '',
    acompanante: ''
  });
  const [mensajePaciente, setMensajePaciente] = useState('');

  // Estados Nutricionista - Menús por Paciente
  const [formDataMenu, setFormDataMenu] = useState({
    id_paciente: '',
    nombre_menu: '',
    descripcion_dieta: ''
  });
  const [mensajeMenu, setMensajeMenu] = useState('');

  // Estados Cocinero - Consumo / Merma
  const [formDataConsumo, setFormDataConsumo] = useState({
    id_producto: '',
    cantidad_consumida: '',
    unidad_consumo: '',
    motivo: 'Preparación en cocina'
  });
  const [mensajeConsumo, setMensajeConsumo] = useState('');

  // Estados Cocinero - Reporte de Faltantes al Admin
  const [formDataReporte, setFormDataReporte] = useState({
    producto_solicitado: '',
    cantidad_necesaria: '',
    urgencia: 'Normal',
    observacion: ''
  });
  const [mensajeReporte, setMensajeReporte] = useState('');

  const cargarDatos = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [resProd, resMenu, resUsers, resPacientes, resReportes] = await Promise.all([
        axios.get('http://localhost:3000/api/productos', config),
        axios.get('http://localhost:3000/api/menus', config),
        axios.get('http://localhost:3000/api/usuarios', config),
        axios.get('http://localhost:3000/api/pacientes', config),
        axios.get('http://localhost:3000/api/reportes', config)
      ]);

      setProductos(resProd.data);
      setMenus(resMenu.data);
      setUsuariosLista(resUsers.data);
      setPacientes(resPacientes.data);
      setReportes(resReportes.data);
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('nombre');

    if (token && rol) {
      setUsuario({ email: userEmail, rol, token, nombre: userName || 'Usuario' });
      cargarDatos(token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    try {
      const response = await axios.post('http://localhost:3000/api/usuarios/login', { email, password });
      const { token, usuario: datosUsuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('rol', datosUsuario.rol);
      localStorage.setItem('email', datosUsuario.email);
      localStorage.setItem('nombre', `${datosUsuario.name} ${datosUsuario.surname}`);

      setUsuario({
        email: datosUsuario.email,
        rol: datosUsuario.rol,
        token,
        nombre: `${datosUsuario.name} ${datosUsuario.surname}`
      });
      cargarDatos(token);
    } catch (err) {
      setErrorLogin(err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsuario(null);
    setProductos([]);
    setMenus([]);
    setUsuariosLista([]);
    setPacientes([]);
    setReportes([]);
  };

  // --- FUNCIONES ADMINISTRADOR ---
  const handleCrearProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/productos', formDataProducto, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setMensajeProducto(res.data.mensaje);
      setFormDataProducto({ nombre_producto: '', descripcion: '', stock_minimo: '', stock_actual: '', unidad_base: '' });
      cargarDatos(usuario.token);
    } catch (err) {
      setMensajeProducto(err.response?.data?.mensaje || 'Error al registrar producto');
    }
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/usuarios/registro', formDataUser, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setMensajeUser('¡Personal registrado con éxito!');
      setFormDataUser({ name: '', surname: '', dni: '', email: '', password: '', rol: 'cocinero' });
      cargarDatos(usuario.token);
    } catch (err) {
      setMensajeUser(err.response?.data?.mensaje || 'Error al registrar personal');
    }
  };

  const handleEliminarUsuario = async (id_usuario) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id_usuario}`, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      cargarDatos(usuario.token);
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al eliminar usuario');
    }
  };

  const handleResetPassword = async (id_usuario, nombreUsuario) => {
    const nuevaPassword = prompt(`Ingrese la nueva contraseña temporal para el usuario ${nombreUsuario}:`);
    if (!nuevaPassword) return;

    try {
      const res = await axios.put(`http://localhost:3000/api/usuarios/${id_usuario}/reset-password`, 
        { nuevaPassword }, 
        { headers: { Authorization: `Bearer ${usuario.token}` } }
      );
      alert(res.data.mensaje);
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al restablecer la contraseña');
    }
  };

  const handleCrearPaciente = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/pacientes', formDataPaciente, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setMensajePaciente(res.data.mensaje);
      setFormDataPaciente({
        nombre: '',
        apellido: '',
        dni: '',
        patologia: 'Ninguna / General',
        observaciones: '',
        habitacion: '',
        cama: '',
        acompanante: ''
      });
      cargarDatos(usuario.token);
    } catch (err) {
      setMensajePaciente(err.response?.data?.mensaje || 'Error al registrar paciente');
    }
  };

  const handleEliminarPaciente = async (id_paciente) => {
    if (!window.confirm('¿Confirmar el alta médica / baja de este paciente del sistema?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/pacientes/${id_paciente}`, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      cargarDatos(usuario.token);
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al dar de alta al paciente');
    }
  };

  const handleResolverReporte = async (id_reporte) => {
    try {
      await axios.put(`http://localhost:3000/api/reportes/${id_reporte}/resolver`, {}, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      cargarDatos(usuario.token);
    } catch (err) {
      alert('Error al marcar el reporte como resuelto');
    }
  };

  // --- FUNCIONES NUTRICIONISTA ---
  const handleCrearMenu = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/menus', formDataMenu, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setMensajeMenu(res.data.mensaje || '¡Menú clínico registrado con éxito!');
      setFormDataMenu({ id_paciente: '', nombre_menu: '', descripcion_dieta: '' });
      cargarDatos(usuario.token);
    } catch (err) {
      setMensajeMenu(err.response?.data?.mensaje || 'Error al crear menú');
    }
  };

  const handleEliminarMenu = async (id_menu) => {
    if (!window.confirm('¿Estás seguro de eliminar este menú clínico?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/menus/${id_menu}`, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      cargarDatos(usuario.token);
    } catch (err) {
      alert('Error al eliminar el menú');
    }
  };

  // --- FUNCIONES COCINERO ---
  const handleRegistrarConsumo = async (e) => {
    e.preventDefault();
    setMensajeConsumo('');
    try {
      const res = await axios.post('http://localhost:3000/api/consumos', formDataConsumo, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setMensajeConsumo(res.data.mensaje);
      setFormDataConsumo({ id_producto: '', cantidad_consumida: '', unidad_consumo: '', motivo: 'Preparación en cocina' });
      cargarDatos(usuario.token);
    } catch (err) {
      const errorMsg = err.response?.data?.mensaje || 'Error al registrar operación';
      setMensajeConsumo(errorMsg);
    }
  };

  const handleEnviarReporte = async (e) => {
    e.preventDefault();
    setMensajeReporte('');
    try {
      const res = await axios.post('http://localhost:3000/api/reportes', formDataReporte, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });
      setMensajeReporte(res.data.mensaje);
      setFormDataReporte({ producto_solicitado: '', cantidad_necesaria: '', urgencia: 'Normal', observacion: '' });
      cargarDatos(usuario.token);
    } catch (err) {
      setMensajeReporte(err.response?.data?.mensaje || 'Error al enviar reporte');
    }
  };

  // --- AGRUPACIÓN CATEGÓRICA DE PACIENTES POR PATOLOGÍA ---
  const conteoPorPatologia = pacientes.reduce((acc, pac) => {
    const cat = pac.patologia || 'Ninguna / General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pacientesFiltrados = filtroPatologia === 'TODAS'
    ? pacientes
    : pacientes.filter(p => (p.patologia || 'Ninguna / General') === filtroPatologia);

  // --- PANTALLA DE LOGIN ---
  if (!usuario) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: '#1e1e1e', color: '#fff', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sistema Hospital - Login</h2>
        {errorLogin && <p style={{ color: '#ef4444', textAlign: 'center' }}>{errorLogin}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
          <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '1050px', margin: '0 auto', color: '#fff', background: '#121212', minHeight: '100vh' }}>
      {/* ENCABEZADO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Panel de {usuario.rol.toUpperCase()}</h2>
          <p style={{ color: '#aaa', margin: '5px 0 0', fontSize: '0.9em' }}>
            Sesión activa: <strong style={{ color: '#fff' }}>{usuario.nombre}</strong> ({usuario.email})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => cargarDatos(usuario.token)} style={{ padding: '8px 12px', background: '#374151', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85em' }}>Actualizar Datos</button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VISTA CATEGÓRICA E INDIVIDUAL DE PACIENTES (TODOS LOS ROLES) */}
      {/* ========================================================= */}
      <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #8b5cf6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#a78bfa' }}>
            Censo de Pacientes Internados — Vista Categórica e Individual ({pacientes.length} Total)
          </h3>
          {filtroPatologia !== 'TODAS' && (
            <button onClick={() => setFiltroPatologia('TODAS')} style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
              Mostrar Todos ({pacientes.length})
            </button>
          )}
        </div>

        {/* TARJETAS CATEGÓRICAS (CONTEO POR PATOLOGÍA) */}
        {pacientes.length === 0 ? (
          <p style={{ color: '#888', margin: 0 }}>No hay pacientes internados actualmente.</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
              <div
                onClick={() => setFiltroPatologia('TODAS')}
                style={{
                  background: filtroPatologia === 'TODAS' ? '#6d28d9' : '#2a2a2a',
                  border: filtroPatologia === 'TODAS' ? '1px solid #c4b5fd' : '1px solid #444',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  minWidth: '130px'
                }}
              >
                <div style={{ fontSize: '0.8em', color: '#ddd' }}>TOTAL INTERNADOS</div>
                <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#fff' }}>{pacientes.length}</div>
              </div>

              {Object.entries(conteoPorPatologia).map(([categoria, cantidad]) => (
                <div
                  key={categoria}
                  onClick={() => setFiltroPatologia(categoria)}
                  style={{
                    background: filtroPatologia === categoria ? '#6d28d9' : '#2a2a2a',
                    border: filtroPatologia === categoria ? '1px solid #c4b5fd' : '1px solid #444',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    minWidth: '150px'
                  }}
                >
                  <div style={{ fontSize: '0.8em', color: '#c4b5fd', fontWeight: 'bold' }}>{categoria}</div>
                  <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#fff' }}>
                    {cantidad} {cantidad === 1 ? 'paciente' : 'pacientes'}
                  </div>
                </div>
              ))}
            </div>

            {/* LISTADO INDIVIDUAL FILTRADO */}
            <div style={{ fontSize: '0.85em', color: '#aaa', marginBottom: '8px' }}>
              Mostrando detalle individual: <strong style={{ color: '#fff' }}>{filtroPatologia === 'TODAS' ? 'Todos los pacientes' : filtroPatologia}</strong> ({pacientesFiltrados.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
              {pacientesFiltrados.map(pac => (
                <div key={pac.id_paciente} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2a2a', padding: '10px 14px', borderRadius: '4px', borderLeft: '4px solid #8b5cf6' }}>
                  <div>
                    <strong>{pac.nombre} {pac.apellido}</strong> (DNI: {pac.dni || 'N/A'}) — <span style={{ color: '#c4b5fd' }}>Hab: {pac.habitacion} | Cama: {pac.cama}</span>
                    <div style={{ fontSize: '0.85em', color: '#ddd', marginTop: '3px' }}>
                      Categoría: <span style={{ background: '#4c1d95', padding: '2px 7px', borderRadius: '4px', fontSize: '0.9em' }}>{pac.patologia}</span>
                      {' '}| Acompañante: <em>{pac.acompanante}</em>
                    </div>
                    {pac.observaciones && (
                      <div style={{ fontSize: '0.82em', color: '#fbbf24', marginTop: '3px' }}>
                        Obs. Clínica: {pac.observaciones}
                      </div>
                    )}
                  </div>
                  {usuario.rol === 'administrador' && (
                    <button onClick={() => handleEliminarPaciente(pac.id_paciente)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', fontWeight: 'bold' }}>
                      Dar Alta / Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* ROL: ADMINISTRADOR                                        */}
      {/* ========================================================= */}
      {usuario.rol === 'administrador' && (
        <>
          {/* 1. ALTA DE NUEVO PACIENTE CON SELECTOR DE PATOLOGÍA */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #8b5cf6' }}>
            <h3 style={{ marginTop: 0, color: '#a78bfa' }}>Registrar Ingreso de Paciente</h3>
            {mensajePaciente && <p style={{ color: mensajePaciente.includes('éxito') ? '#4ade80' : '#ef4444' }}>{mensajePaciente}</p>}
            <form onSubmit={handleCrearPaciente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Nombre del Paciente" value={formDataPaciente.nombre} onChange={(e) => setFormDataPaciente({...formDataPaciente, nombre: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="Apellido" value={formDataPaciente.apellido} onChange={(e) => setFormDataPaciente({...formDataPaciente, apellido: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="DNI" value={formDataPaciente.dni} onChange={(e) => setFormDataPaciente({...formDataPaciente, dni: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={formDataPaciente.patologia} onChange={(e) => setFormDataPaciente({...formDataPaciente, patologia: e.target.value})} required style={{ flex: 2, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  {PATOLOGIAS_PREDEFINIDAS.map(pat => (
                    <option key={pat} value={pat}>{pat}</option>
                  ))}
                </select>
                <input type="text" placeholder="Habitación (ej. 102)" value={formDataPaciente.habitacion} onChange={(e) => setFormDataPaciente({...formDataPaciente, habitacion: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="Cama (ej. B)" value={formDataPaciente.cama} onChange={(e) => setFormDataPaciente({...formDataPaciente, cama: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Observaciones clínicas opcionales (ej. Alergia a lactosa, ayuno matutino)" value={formDataPaciente.observaciones} onChange={(e) => setFormDataPaciente({...formDataPaciente, observaciones: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="Acompañante/s (Nombre, DNI o 'Ninguno')" value={formDataPaciente.acompanante} onChange={(e) => setFormDataPaciente({...formDataPaciente, acompanante: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              </div>
              <button type="submit" style={{ padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Registrar Ingreso de Paciente</button>
            </form>
          </div>

          {/* 2. REPORTES DE FALTANTES DESDE COCINA */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #f59e0b' }}>
            <h3 style={{ marginTop: 0, color: '#fbbf24' }}>Pedidos y Reportes de Faltantes (Cocina)</h3>
            {reportes.length === 0 ? (
              <p style={{ color: '#888', margin: 0 }}>No hay pedidos ni reportes pendientes de cocina.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reportes.map(rep => (
                  <div key={rep.id_reporte} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2a2a', padding: '12px 15px', borderRadius: '4px', borderLeft: rep.urgencia === 'Urgente' ? '4px solid #ef4444' : '4px solid #f59e0b' }}>
                    <div>
                      <span style={{ background: rep.urgencia === 'Urgente' ? '#7f1d1d' : '#78350f', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75em', fontWeight: 'bold', marginRight: '8px' }}>
                        {rep.urgencia.toUpperCase()}
                      </span>
                      <strong>{rep.producto_solicitado}</strong> — Cantidad: <strong>{rep.cantidad_necesaria}</strong>
                      {rep.observacion && <p style={{ margin: '4px 0 0', color: '#ccc', fontSize: '0.85em' }}>Nota: {rep.observacion}</p>}
                      <small style={{ color: '#888' }}>Reportado por: {rep.Usuario ? `${rep.Usuario.name} ${rep.Usuario.surname}` : 'Cocinero'}</small>
                    </div>
                    <button onClick={() => handleResolverReporte(rep.id_reporte)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85em' }}>
                      Marcar Resuelto
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. ALERTAS DE STOCK MÍNIMO */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ef4444' }}>
            <h3 style={{ marginTop: 0, color: '#f87171' }}>Alertas de Stock Mínimo y Reposición</h3>
            {productos.filter(p => parseFloat(p.stock_actual) <= parseFloat(p.stock_minimo)).length === 0 ? (
              <p style={{ color: '#888', margin: 0 }}>Todo el inventario está en niveles óptimos.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {productos.filter(p => parseFloat(p.stock_actual) <= parseFloat(p.stock_minimo)).map(prodCritico => (
                  <li key={`stock-${prodCritico.id_producto}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2a2a', padding: '10px 15px', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
                    <span>
                      <strong>{prodCritico.nombre_producto}</strong> está bajo mínimos. Disponible: <span style={{ color: '#f87171' }}>{prodCritico.stock_actual} {prodCritico.unidad_base}</span> (Mínimo: {prodCritico.stock_minimo}).
                    </span>
                    <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold' }}>Reposición Requerida</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 4. ADMINISTRAR PRODUCTOS */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #3b82f6' }}>
            <h3 style={{ marginTop: 0, color: '#60a5fa' }}>Administrar Productos (Ingreso de Lote o Nuevo)</h3>
            {mensajeProducto && <p style={{ color: mensajeProducto.includes('éxito') || mensajeProducto.includes('sumaron') ? '#4ade80' : '#ef4444' }}>{mensajeProducto}</p>}
            <form onSubmit={handleCrearProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Nombre (ej. Arroz Lucchetti)" value={formDataProducto.nombre_producto} onChange={(e) => setFormDataProducto({...formDataProducto, nombre_producto: e.target.value})} required style={{ flex: 2, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <select value={formDataProducto.unidad_base} onChange={(e) => setFormDataProducto({...formDataProducto, unidad_base: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="" disabled>Seleccione unidad base</option>
                  <option value="Unidad">Unidad (es)</option>
                  <option value="Kg">Kilogramos (Kg)</option>
                  <option value="Gr">Gramos (Gr)</option>
                  <option value="Lt">Litros (Lt)</option>
                </select>
              </div>
              <input type="text" placeholder="Descripción / Categoría (ej. Granos, Carnes, Verduras)" value={formDataProducto.descripcion} onChange={(e) => setFormDataProducto({...formDataProducto, descripcion: e.target.value})} style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" step="any" placeholder="Cantidad / Stock Inicial" value={formDataProducto.stock_actual} onChange={(e) => setFormDataProducto({...formDataProducto, stock_actual: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="number" step="any" placeholder="Stock Mínimo de Alerta" value={formDataProducto.stock_minimo} onChange={(e) => setFormDataProducto({...formDataProducto, stock_minimo: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              </div>
              <button type="submit" style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar / Sumar Stock</button>
            </form>
          </div>

          {/* 5. GESTIÓN DE PERSONAL (CON RESETEO DE CLAVE) */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #3b82f6' }}>
            <h3 style={{ marginTop: 0, color: '#60a5fa' }}>Gestión de Personal (Alta y Listado)</h3>
            {mensajeUser && <p style={{ color: mensajeUser.includes('éxito') ? '#4ade80' : '#ef4444' }}>{mensajeUser}</p>}
            <form onSubmit={handleCrearUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Nombre" value={formDataUser.name} onChange={(e) => setFormDataUser({...formDataUser, name: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="Apellido" value={formDataUser.surname} onChange={(e) => setFormDataUser({...formDataUser, surname: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="DNI" value={formDataUser.dni} onChange={(e) => setFormDataUser({...formDataUser, dni: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              </div>
              <input type="email" placeholder="Correo electrónico" value={formDataUser.email} onChange={(e) => setFormDataUser({...formDataUser, email: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <input type="password" placeholder="Contraseña" value={formDataUser.password} onChange={(e) => setFormDataUser({...formDataUser, password: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <select value={formDataUser.rol} onChange={(e) => setFormDataUser({...formDataUser, rol: e.target.value})} style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                <option value="cocinero">Cocinero</option>
                <option value="nutricionista">Nutricionista</option>
                <option value="administrador">Administrador</option>
              </select>
              <button type="submit" style={{ padding: '10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Crear Personal</button>
            </form>
            <h4 style={{ color: '#ccc', borderTop: '1px solid #333', paddingTop: '15px' }}>Personal Registrado en el Sistema:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {usuariosLista.map((u) => (
                <div key={u.id_usuario} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2a2a', padding: '8px 12px', borderRadius: '4px' }}>
                  <span><strong>{u.name} {u.surname}</strong> (DNI: {u.dni || 'N/A'}) <em>{u.email}</em> [{u.rol.toUpperCase()}]</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleResetPassword(u.id_usuario, `${u.name} ${u.surname}`)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em', fontWeight: 'bold' }}>
                      Resetear Clave
                    </button>
                    <button onClick={() => handleEliminarUsuario(u.id_usuario)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* ROL: NUTRICIONISTA                                        */}
      {/* ========================================================= */}
      {usuario.rol === 'nutricionista' && (
        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #10b981' }}>
          <h3 style={{ marginTop: 0, color: '#34d399' }}>Módulo de Nutrición: Prescripción Diaria por Paciente</h3>
          {mensajeMenu && <p style={{ color: mensajeMenu.includes('éxito') ? '#4ade80' : '#ef4444' }}>{mensajeMenu}</p>}
          <form onSubmit={handleCrearMenu} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <select value={formDataMenu.id_paciente} onChange={(e) => setFormDataMenu({...formDataMenu, id_paciente: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
              <option value="" disabled>Seleccione Paciente Internado (Habitación / Cama / Patología)</option>
              {pacientes.map(pac => (
                <option key={pac.id_paciente} value={pac.id_paciente}>
                  {pac.nombre} {pac.apellido} — Hab: {pac.habitacion} Cama: {pac.cama} | Patología: {pac.patologia} {pac.observaciones ? `(${pac.observaciones})` : ''}
                </option>
              ))}
            </select>

            <select value={formDataMenu.nombre_menu} onChange={(e) => setFormDataMenu({...formDataMenu, nombre_menu: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
              <option value="" disabled>Seleccione Protocolo de Dieta Hospitalaria</option>
              <option value="Dieta Hiposódica (Baja en Sodio)">Dieta Hiposódica (Baja en Sodio)</option>
              <option value="Dieta para Diabéticos">Dieta para Diabéticos (Control Glucémico)</option>
              <option value="Dieta Blanda / Gastrointestinal">Dieta Blanda / Gastrointestinal</option>
              <option value="Dieta Celíaca (Libre de TACC)">Dieta Celíaca (Libre de TACC)</option>
              <option value="Dieta Líquida / Post-Operatorio">Dieta Líquida / Post-Operatorio</option>
              <option value="Dieta General">Dieta General / Estandarizada</option>
            </select>

            <input type="text" placeholder="Detalle del menú del día (Almuerzo / Cena y observaciones)" value={formDataMenu.descripcion_dieta} onChange={(e) => setFormDataMenu({...formDataMenu, descripcion_dieta: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
            <button type="submit" style={{ padding: '10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Asignar Dieta del Día al Paciente</button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* ROL: COCINERO                                             */}
      {/* ========================================================= */}
      {usuario.rol === 'cocinero' && (
        <>
          {/* 1. DESCUENTO DE CONSUMO O MERMA */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #f59e0b' }}>
            <h3 style={{ marginTop: 0, color: '#fbbf24' }}>Módulo de Cocina: Consumo o Reporte de Merma (Descarte)</h3>
            {mensajeConsumo && <p style={{ color: mensajeConsumo.includes('éxito') ? '#4ade80' : '#ef4444' }}>{mensajeConsumo}</p>}
            <form onSubmit={handleRegistrarConsumo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <select value={formDataConsumo.id_producto} onChange={(e) => setFormDataConsumo({...formDataConsumo, id_producto: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                <option value="" disabled>Seleccione insumo del inventario</option>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre_producto} (Stock Actual: {p.stock_actual} {p.unidad_base})
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" step="any" placeholder="Cantidad" value={formDataConsumo.cantidad_consumida} onChange={(e) => setFormDataConsumo({...formDataConsumo, cantidad_consumida: e.target.value})} required style={{ flex: 2, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <select value={formDataConsumo.unidad_consumo} onChange={(e) => setFormDataConsumo({...formDataConsumo, unidad_consumo: e.target.value})} required style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="" disabled>Unidad</option>
                  <option value="Unidad">Unidad(es)</option>
                  <option value="Kg">Kilogramos (Kg)</option>
                  <option value="Gr">Gramos (Gr)</option>
                  <option value="Lt">Litros (Lt)</option>
                </select>
              </div>
              <select value={formDataConsumo.motivo} onChange={(e) => setFormDataConsumo({...formDataConsumo, motivo: e.target.value})} required style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                <option value="Preparación en cocina">Preparación de Menú Diario</option>
                <option value="MERMA / DESCARTE: Producto Dañado o con Plagas (ej. gorgojos)">MERMA / DESCARTE: Dañado o con Plagas (Ej. Gorgojos)</option>
              </select>
              <button type="submit" style={{ padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Procesar Operación</button>
            </form>
          </div>

          {/* 2. ENVIAR REPORTE DE FALTANTE AL ADMINISTRADOR */}
          <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ef4444' }}>
            <h3 style={{ marginTop: 0, color: '#f87171' }}>Solicitar Insumos / Reportar Faltante al Administrador</h3>
            {mensajeReporte && <p style={{ color: mensajeReporte.includes('enviado') ? '#4ade80' : '#ef4444' }}>{mensajeReporte}</p>}
            <form onSubmit={handleEnviarReporte} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Producto que falta o se necesita (ej. Aceite, Pollo, Sal)" value={formDataReporte.producto_solicitado} onChange={(e) => setFormDataReporte({...formDataReporte, producto_solicitado: e.target.value})} required style={{ flex: 2, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <input type="text" placeholder="Cantidad aproximada (ej. 10 Kg)" value={formDataReporte.cantidad_necesaria} onChange={(e) => setFormDataReporte({...formDataReporte, cantidad_necesaria: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                <select value={formDataReporte.urgencia} onChange={(e) => setFormDataReporte({...formDataReporte, urgencia: e.target.value})} style={{ flex: 1, padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="Normal">Prioridad Normal</option>
                  <option value="Urgente">¡Urgente para hoy!</option>
                </select>
              </div>
              <input type="text" placeholder="Observación adicional para el administrador (opcional)" value={formDataReporte.observacion} onChange={(e) => setFormDataReporte({...formDataReporte, observacion: e.target.value})} style={{ padding: '10px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <button type="submit" style={{ padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Enviar Reporte al Administrador</button>
            </form>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* SECCIÓN COMPARTIDA: MENÚS PLANIFICADOS DEL DÍA            */}
      {/* ========================================================= */}
      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>Menús Planificados del Día (Por Paciente):</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px', marginTop: '15px', marginBottom: '30px' }}>
        {menus.length === 0 ? (
          <p style={{ color: '#888' }}>No hay menús registrados en el sistema.</p>
        ) : (
          menus.map(m => (
            <div key={m.id_menu} style={{ background: '#1e1e1e', padding: '15px', borderRadius: '6px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {m.Paciente ? (
                  <div style={{ background: '#2a2a2a', padding: '8px', borderRadius: '4px', marginBottom: '10px', borderLeft: '3px solid #8b5cf6' }}>
                    <strong style={{ color: '#c4b5fd', display: 'block' }}>
                      Paciente: {m.Paciente.nombre} {m.Paciente.apellido}
                    </strong>
                    <span style={{ fontSize: '0.85em', color: '#ddd' }}>
                      Habitación: <strong>{m.Paciente.habitacion}</strong> | Cama: <strong>{m.Paciente.cama}</strong>
                    </span>
                    <div style={{ fontSize: '0.8em', color: '#aaa' }}>Categoría: {m.Paciente.patologia}</div>
                  </div>
                ) : (
                  <div style={{ background: '#2a2a2a', padding: '6px 8px', borderRadius: '4px', marginBottom: '10px', fontSize: '0.85em', color: '#aaa' }}>
                    Menú General / Sin paciente asignado
                  </div>
                )}

                <h4 style={{ margin: '0 0 5px 0', color: '#34d399' }}>{m.nombre_menu}</h4>
                <p style={{ margin: '4px 0', color: '#ccc', fontSize: '0.9em' }}>{m.descripcion_dieta}</p>
              </div>
              {(usuario.rol === 'nutricionista' || usuario.rol === 'administrador') && (
                <button onClick={() => handleEliminarMenu(m.id_menu)} style={{ marginTop: '12px', background: '#dc2626', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85em' }}>
                  Actualizar / Eliminar Dieta
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN COMPARTIDA: INVENTARIO ACTUAL EN STOCK            */}
      {/* ========================================================= */}
      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '8px' }}>Inventario Actual en Stock:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px', marginTop: '15px' }}>
        {productos.length === 0 ? (
          <p style={{ color: '#888' }}>No hay productos cargados en el stock.</p>
        ) : (
          productos.map(p => (
            <div key={p.id_producto} style={{ background: '#1e1e1e', padding: '15px', borderRadius: '6px', border: '1px solid #333' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#60a5fa' }}>{p.nombre_producto}</h4>
              <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '0.8em', fontStyle: 'italic' }}>{p.descripcion || 'Sin categoría'}</p>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #444', fontSize: '0.85em', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: parseFloat(p.stock_actual) <= parseFloat(p.stock_minimo) ? '#f87171' : '#4ade80' }}>
                  Stock Actual: <strong>{p.stock_actual} {p.unidad_base}</strong>
                </span>
                <span>Stock Mínimo: <strong>{p.stock_minimo} {p.unidad_base}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;