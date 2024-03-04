<?php
session_start();

include_once 'database.php';

$usuario = $_GET['username'];
$contrasena = md5($_GET['password']);

try {
    $db = new Database();
    $pdo = $db->connect();

    $sql = "SELECT id, usuario, password, id_local,nombre, apellido, id_roll, imagen
    FROM usuarios 
    WHERE usuario = ? AND password = ? AND id_estado = ?";

    $p = $pdo->prepare($sql);
    $p->execute(array($usuario, $contrasena, 1));

    $result = $p->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // Usuario y contraseña coinciden, establece la variable de sesión
        $_SESSION['id'] = $result['id'];
        $_SESSION['usuario'] = $result['usuario'];
        $_SESSION['id_roll'] = $result['id_roll'];
        $_SESSION['imagen'] = $result['imagen'];
        $_SESSION['nombre'] = $result['nombre'];
        $_SESSION['apellido'] = $result['apellido'];
        $_SESSION['id_local'] = $result['id_local'];


        echo json_encode(['msg' => 'Inicio de sesión exitoso', 'id' => 1]);

        exit();
        // Cerrar la conexión a la base de datos
        $pdo = null;
    } else {

        $sql = "SELECT usuario FROM usuarios WHERE usuario = ?";
        $p = $pdo->prepare($sql);
        $p->execute(array($usuario));
        $result1 = $p->fetch(PDO::FETCH_ASSOC);

        if ($result1 == false) {
            echo json_encode(['msg' => 'Error, nombre de usuario no encontrado', 'id' => 2]);
            return;
        }

        $sql = "SELECT usuario FROM usuarios WHERE usuario = ? AND password = ?";
        $p = $pdo->prepare($sql);
        $p->execute(array($usuario, $contrasena));
        $result2 = $p->fetch(PDO::FETCH_ASSOC);

        if ($result2 == false) {
            echo json_encode(['msg' => 'Error, contraseña de usuario incorrecta', 'id' => 2]);
            return;
        }

        $sql = "SELECT usuario FROM usuarios WHERE usuario = ? AND password = ? AND id_estado = ?";
        $p = $pdo->prepare($sql);
        $p->execute(array($usuario, $contrasena, 2));
        $result3 = $p->fetch(PDO::FETCH_ASSOC);

        if ($result3) {
            echo json_encode(['msg' => 'Error, usuario desabilitado', 'id' => 2]);
            return;
        }

        echo json_encode(['msg' => 'Error, usuario no encontrado', 'id' => 2]);
    }
} catch (PDOException $e) {
    echo json_encode(['msg' => 'ERROR']);
}
