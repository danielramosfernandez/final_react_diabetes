import React, { useState, useEffect } from 'react';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/usuarios.php')
      .then(response => {
        if (!response.ok) {
          console.error(`Error fetching users: ${response.statusText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Cambiado a json() para simplificar
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Expected an array, but got:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleDelete = (username) => {
    fetch('http://localhost:8000/usuarios.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre_usuario: username }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting user');
        }
        setUsers(users.filter(user => user.usuario !== username));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre_usuario: user.usuario, // Mantener el nombre de usuario
      nombre: user.nombre,
      apellidos: user.apellidos,
      fecha_nacimiento: user.fecha_nacimiento,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    fetch('http://localhost:8000/usuarios.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating user');
        }
        setUsers(users.map(user => (user.usuario === formData.nombre_usuario ? { ...user, ...formData } : user)));
        setEditingUser(null);
        setFormData({
          nombre_usuario: '',
          nombre: '',
          apellidos: '',
          fecha_nacimiento: '',
        });
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Fecha de Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id_usu}>
                <td>{user.usuario}</td>
                <td>{user.nombre}</td>
                <td>{user.apellidos}</td>
                <td>{user.fecha_nacimiento}</td>
                <td>
                  <button onClick={() => handleDelete(user.usuario)}>Eliminar</button>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingUser && (
        <div>
          <h3>Editar Usuario</h3>
          <input
            type="text"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            readOnly // Deshabilitar la edición del nombre de usuario
          />
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleFormChange}
          />
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleFormChange}
          />
          <button onClick={handleUpdate}>Actualizar</button>
          <button onClick={() => setEditingUser(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
