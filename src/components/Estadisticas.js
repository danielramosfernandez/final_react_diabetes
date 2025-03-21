// src/pages/Stats.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Stats = () => {
  const [stats, setStats] = useState({});
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

  useEffect(() => {
    // Obtener estadísticas desde el backend
    axios.get('http://localhost/backend/estadisticas.php')
      .then(response => {
        setStats(response.data);
        
        // Asignar los datos de la API al gráfico
        const initialData = response.data.valores || [65, 59, 80, 81]; // Cambia esto según tu API
        setChartData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: initialData,
          }]
        }));
      })
      .catch(error => console.log(error));
  }, []);

  const handleAddData = () => {
    if (newValue) {
      const updatedData = {
        ...chartData,
        datasets: [{
          ...chartData.datasets[0],
          data: [...chartData.datasets[0].data, parseFloat(newValue)],
        }]
      };

      setChartData(updatedData);
      setNewValue(''); // Limpiar el campo de entrada

      // Enviar el nuevo valor a la API
      axios.post('http://localhost/backend/estadisticas.php', { lenta: newValue })
        .then(response => {
          console.log(response.data.message); // Mensaje de éxito
        })
        .catch(error => {
          console.error('Error al añadir valor:', error);
        });
    }
  };

  return (
    <div>
      <h2>Estadísticas de Control Glucosa</h2>
      <p><strong>Promedio LENTA:</strong> {stats.promedio}</p>
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
