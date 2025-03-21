import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Asegúrate de que Routes está importado correctamente
import { ValidationProvider } from './components/Validacion';
import UserTable from './components/TablaUsuarios';
import UserForm from './components/FormularioUsuarios';
import Stats from './services/Stats';

const App = () => {
  return (
    <ValidationProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li><a href="/">Usuarios</a></li>
              <li><a href="/crear-usuario">Crear Usuario</a></li>
              <li><a href="/estadisticas">Estadísticas</a></li>
            </ul>
          </nav>

          {/* Reemplaza Switch por Routes */}
          <Routes>
            <Route path="/" element={<UserTable />} />
            <Route path="/crear-usuario" element={<UserForm />} />
            <Route path="/estadisticas" element={<Stats />} />
          </Routes>
        </div>
      </Router>
    </ValidationProvider>
  );
};

export default App;