<?php
// database.php

$host = 'localhost'; // Cambia por tu host
$dbname = 'diabetesdb';
$username = 'root'; // Cambia por tu usuario
$password = ''; // Cambia por tu contraseña

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
