import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Stats = () => {
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || ''); // Cargar el nombre del usuario desde localStorage
  const [stats, setStats] = useState({
    promedio: 0,
    minimo: 0,
    maximo: 0,
    valores: []
  });
  const [chartData, setChartData] = useState({
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [{
      label: 'Valor LENTA',
      data: [], // Inicialmente vacío, se llenará con datos de la API
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });
  const [newValue, setNewValue] = useState('');
  const [inputUserName, setInputUserName] = useState(userName); // Estado para el campo de entrada del nombre de usuario

  useEffect(() => {
    if (userName) {
      // Obtener estadísticas desde el backend para el usuario específico
      fetch(`http://localhost/backend/estadisticas.php?user=${userName}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
          }
          return response.json();
        })
        .then(data => {
          setStats(data);

          // Asignar los datos de la API al gráfico
          const initialData = data.valores || []; // Cambia esto según tu API
          setChartData(prevData => ({
            ...prevData,
            datasets: [{
              ...prevData.datasets[0],
              data: initialData,
            }]
          }));

          // Calcular promedios, mínimos y máximos
          calculateStats(initialData);
        })
        .catch(error => console.log(error));
    } else {
      // Si el nombre del usuario está vacío, restablecer las estadísticas y gráfico
      setStats({
        promedio: 0,
        minimo: 0,
        maximo: 0,
        valores: []
      });
      setChartData({
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Valor LENTA',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });
    }
  }, [userName]); // Dependencia en userName

  const calculateStats = (data) => {
    const total = data.reduce((acc, val) => acc + val, 0);
    const promedio = total / data.length || 0;
    const minimo = Math.min(...data);
    const maximo = Math.max(...data);

    setStats({
      promedio,
      minimo,
      maximo,
      valores: data
    });
  };

  const handleAddData = () => {
    if (newValue) {
      const newValueFloat = parseFloat(newValue);
      const updatedData = {
        ...chartData,
        datasets: [{
          ...chartData.datasets[0],
          data: [...chartData.datasets[0].data, newValueFloat],
        }]
      };

      setChartData(updatedData);
      setNewValue(''); // Limpiar el campo de entrada

      // Calcular nuevas estadísticas
      const updatedValues = [...stats.valores, newValueFloat];
      calculateStats(updatedValues);

      // Enviar el nuevo valor a la API
      fetch('http://localhost/backend/estadisticas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          lenta: newValueFloat,
          user: userName // Incluir el nombre del usuario
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
          }
          return response.json();
        })
        .then(data => {
          console.log(data.message); // Mensaje de éxito
        })
        .catch(error => {
          console.error('Error al añadir valor:', error);
        });
    }
  };

  const handleUserNameChange = (e) => {
    setInputUserName(e.target.value); // Actualizar el valor en el estado local del input
  };

  const handleConfirmUserName = () => {
    setUserName(inputUserName); // Confirmar el cambio de nombre
    localStorage.setItem('userName', inputUserName); // Guardar el nuevo nombre en localStorage
  };

  return (
    <div>
      <h2>Estadísticas de Control Glucosa</h2>
      
      {/* Campo de entrada para el nombre del usuario */}
      <div>
        <input
          type="text"
          value={inputUserName}
          onChange={handleUserNameChange}
          placeholder="Nombre del Usuario"
        />
        <button onClick={handleConfirmUserName}>Confirmar Nombre</button>
      </div>

      <p><strong>Promedio LENTA:</strong> {stats.promedio.toFixed(2)}</p>
      <p><strong>Valor Mínimo LENTA:</strong> {stats.minimo}</p>
      <p><strong>Valor Máximo LENTA:</strong> {stats.maximo}</p>

      {/* Mostrar el gráfico */}
      {chartData.datasets && (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Line data={chartData} />
        </div>
      )}

      {/* Formulario para añadir nuevos valores */}
      <div>
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Nuevo valor LENTA"
        />
        <button onClick={handleAddData}>Añadir Valor</button>
      </div>
    </div>
  );
};

export default Stats;
