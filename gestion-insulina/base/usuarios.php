<?php

// Configuración de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configurar cabeceras CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS"); // Agregar PUT aquí
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de preflight request (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
include 'conexion.php';

// Verificar que la conexión a la base de datos está activa
if (!$pdo) {
    http_response_code(500);
    echo json_encode(["message" => "Error en la conexión a la base de datos"]);
    exit();
}

// Manejo de solicitudes GET
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        // Consultar todos los usuarios
        $sql = "SELECT id_usu, usuario, nombre, apellidos, fecha_nacimiento FROM usuario";
        $stmt = $pdo->query($sql);
        
        // Fetch all users
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si se encontraron usuarios
        if (empty($users)) {
            http_response_code(204); // No Content
            exit();
        }

        // Devolver usuarios en formato JSON
        echo json_encode($users);

    } catch (Exception $e) {
        // Guardar error en un archivo log para depuración
        file_put_contents("error_log.txt", date("Y-m-d H:i:s") . " - Error al obtener usuarios: " . $e->getMessage() . "\n", FILE_APPEND);
        
        http_response_code(500);
        echo json_encode(["message" => "Error al obtener usuarios"]);
    }
}

// Manejo de solicitudes POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"));

    // Validar que todos los datos fueron enviados
    if (!$data || !isset($data->nombre_usuario, $data->contra, $data->nombre, $data->apellidos, $data->fecha_nacimiento)) {
        http_response_code(400);
        echo json_encode(["message" => "Faltan datos o JSON inválido"]);
        exit();
    }

    try {
        // Limpiar y procesar datos
        $nombre_usuario = trim($data->nombre_usuario);
        $contra = password_hash(trim($data->contra), PASSWORD_BCRYPT); // Encriptar contraseña
        $nombre = trim($data->nombre);
        $apellidos = trim($data->apellidos);
        $fecha_nacimiento = trim($data->fecha_nacimiento);

        // Registrar el usuario en la base de datos
        $sql = "INSERT INTO usuario (usuario, contra, nombre, apellidos, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombre_usuario, $contra, $nombre, $apellidos, $fecha_nacimiento]);

        http_response_code(201); // Código 201 = Creado
        echo json_encode(["message" => "Usuario creado exitosamente"]);

    } catch (Exception $e) {
        // Guardar error en un archivo log para depuración
        file_put_contents("error_log.txt", date("Y-m-d H:i:s") . " - Error al crear usuario: " . $e->getMessage() . "\n", FILE_APPEND);
        
        http_response_code(500);
        echo json_encode(["message" => "Error al crear usuario"]);
    }
}

// Manejo de solicitudes DELETE
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Obtener datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"));

    // Validar que se ha enviado el nombre de usuario
    if (!$data || !isset($data->nombre_usuario)) {
        http_response_code(400);
        echo json_encode(["message" => "Faltan datos o JSON inválido"]);
        exit();
    }

    try {
        $nombre_usuario = trim($data->nombre_usuario);

        // Eliminar el usuario de la base de datos
        $sql = "DELETE FROM usuario WHERE usuario = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombre_usuario]);

        if ($stmt->rowCount() > 0) {
            http_response_code(200); // Código 200 = OK
            echo json_encode(["message" => "Usuario eliminado exitosamente"]);
        } else {
            http_response_code(404); // No encontrado
            echo json_encode(["message" => "Usuario no encontrado"]);
        }

    } catch (Exception $e) {
        // Guardar error en un archivo log para depuración
        file_put_contents("error_log.txt", date("Y-m-d H:i:s") . " - Error al eliminar usuario: " . $e->getMessage() . "\n", FILE_APPEND);
        
        http_response_code(500);
        echo json_encode(["message" => "Error al eliminar usuario"]);
    }
}

// Manejo de solicitudes PUT
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Obtener datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"));

    // Validar que se han enviado los datos necesarios
    if (!$data || !isset($data->nombre_usuario, $data->nombre, $data->apellidos, $data->fecha_nacimiento)) {
        http_response_code(400);
        echo json_encode(["message" => "Faltan datos o JSON inválido"]);
        exit();
    }

    try {
        $nombre_usuario = trim($data->nombre_usuario);
        $nombre = trim($data->nombre);
        $apellidos = trim($data->apellidos);
        $fecha_nacimiento = trim($data->fecha_nacimiento);

        // Actualizar el usuario en la base de datos
        $sql = "UPDATE usuario SET nombre = ?, apellidos = ?, fecha_nacimiento = ? WHERE usuario = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombre, $apellidos, $fecha_nacimiento, $nombre_usuario]);

        if ($stmt->rowCount() > 0) {
            http_response_code(200); // Código 200 = OK
            echo json_encode(["message" => "Usuario actualizado exitosamente"]);
        } else {
            http_response_code(404); // No encontrado
            echo json_encode(["message" => "Usuario no encontrado"]);
        }

    } catch (Exception $e) {
        // Guardar error en un archivo log para depuración
        file_put_contents("error_log.txt", date("Y-m-d H:i:s") . " - Error al actualizar usuario: " . $e->getMessage() . "\n", FILE_APPEND);
        
        http_response_code(500);
        echo json_encode(["message" => "Error al actualizar usuario"]);
    }
}
?>
