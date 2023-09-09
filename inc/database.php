<?php
class Database
{
    public function connect()
    {
        // Datos de conexión a la base de datos
        $host = "localhost";
        $usuario = "root";
        $contrasena = "";
        $basedatos = "roosters";

        // Crear una conexión a la base de datos con PDO
        try {
            $pdo = new PDO("mysql:host=$host;dbname=$basedatos", $usuario, $contrasena);
            return $pdo;
        } catch (PDOException $e) {
            die("Error en la conexión: " . $e->getMessage());
        }
    }
}