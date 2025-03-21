import React, { useState } from 'react';

const FormularioUsuarios = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contra, setContra] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreUsuario || !contra || !nombre || !apellidos || !fechaNacimiento) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/usuarios.php', {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_usuario: nombreUsuario,
          contra: contra,
          nombre: nombre,
          apellidos: apellidos,
          fecha_nacimiento: fechaNacimiento
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      console.log('Usuario creado:', data);
      alert('Usuario creado exitosamente!');
      
      setNombreUsuario('');
      setContra('');
      setNombre('');
      setApellidos('');
      setFechaNacimiento('');

    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el usuario');
    }
  };

  return (
    <div>
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario:</label>
          <input 
            type="text" 
            value={nombreUsuario} 
            onChange={(e) => setNombreUsuario(e.target.value)} 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={contra} 
            onChange={(e) => setContra(e.target.value)} 
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
          />
        </div>
        <div>
          <label>Apellidos:</label>
          <input 
            type="text" 
            value={apellidos} 
            onChange={(e) => setApellidos(e.target.value)} 
          />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input 
            type="date" 
            value={fechaNacimiento} 
            onChange={(e) => setFechaNacimiento(e.target.value)} 
          />
        </div>
        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default FormularioUsuarios;
