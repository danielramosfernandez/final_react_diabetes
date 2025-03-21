<?php
// estadisticas.php

// Permitir solicitudes CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include 'conexion.php';

// Función para obtener estadísticas de los valores LENTA
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener el nombre del usuario de los parámetros de la consulta
    $user = isset($_GET['user']) ? $_GET['user'] : '';

    // Obtener el promedio, mínimo y máximo de la LENTA en el mes actual para el usuario específico
    $sql = "SELECT AVG(lenta) as promedio, MIN(lenta) as minimo, MAX(lenta) as maximo, GROUP_CONCAT(lenta) as valores 
            FROM control_glucosa 
            WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND user = :user";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user', $user);
    $stmt->execute();
    $estadisticas = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Convertir la cadena de valores en un array
    if ($estadisticas && $estadisticas['valores']) {
        $estadisticas['valores'] = array_map('floatval', explode(',', $estadisticas['valores']));
    } else {
        $estadisticas['valores'] = [];
    }

    // Enviar los datos como respuesta en formato JSON
    echo json_encode($estadisticas);
}

// Función para añadir un nuevo valor LENTA
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener el cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validar el dato recibido
    if (isset($data['lenta']) && isset($data['user'])) {
        $lenta = $data['lenta'];
        $user = $data['user'];
        
        // Insertar el nuevo valor en la base de datos
        $sql = "INSERT INTO control_glucosa (lenta, fecha, user) VALUES (:lenta, NOW(), :user)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':lenta', $lenta);
        $stmt->bindParam(':user', $user);
        
        if ($stmt->execute()) {
            // Responder con un mensaje de éxito
            echo json_encode(['message' => 'Valor añadido correctamente']);
        } else {
            // Responder con un mensaje de error
            echo json_encode(['message' => 'Error al añadir el valor']);
        }
    } else {
        // Responder con un mensaje de error si no se recibe el dato
        echo json_encode(['message' => 'Datos inválidos']);
    }
}
?>
