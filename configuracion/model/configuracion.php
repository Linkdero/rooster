<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Configuracion
{
    //Opcion 1
    static function getUsuario()
    {
        $idUsuario = $_GET["usuario"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT usuario, id_roll, id_estado, imagen, `nombre`, `apellido` FROM usuarios WHERE id = ?";

        $p = $pdo->prepare($sql);
        $p->execute(array($idUsuario));
        $usuario = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($usuario as $u) {
            $sub_array = array(
                "usuario" => $u["usuario"],
                "nombre" => $u["nombre"],
                "apellido" => $u["apellido"],

                "id_roll" => $u["id_roll"],
                "id_estado" => $u["id_estado"],
                "imagen" => $u["imagen"],

            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    static function getUsuarios()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT u.id, usuario,CONCAT(u.nombre,' ',u.apellido) AS nombre, u.id_roll, r.descripcion as roll, u.id_estado
        FROM usuarios AS u 
        LEFT JOIN tb_roll as r on u.id_roll = r.id_roll";

        $p = $pdo->prepare($sql);
        $p->execute();
        $usuario = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($usuario as $u) {
            $sub_array = array(
                "id" => $u["id"],
                "usuario" => $u["usuario"],
                "nombre" => $u["nombre"],
                "roll" => $u["roll"],
                "id_roll" => $u["id_roll"],
                "id_estado" => $u["id_estado"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    static function setNuevoLocal()
    {
        $nombreLocal = $_POST["nombreLocal"];
        try {
            $db = new Database();
            $pdo = $db->connect();

            $sql = "INSERT INTO tb_local(descripcion) VALUES (?)";

            $p = $pdo->prepare($sql);

            $p->execute(array($nombreLocal));
            $pdo = null;
            echo json_encode(['msg' => 'Local Agregado', 'id' => 1]);

            exit(); // Asegúrate de detener la ejecución del script después de la redirección

        } catch (PDOException $e) {
            echo json_encode(['msg' => 'ERROR: ' . $e->getMessage()]);
        }
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Configuracion::getUsuario();
            break;

        case 2:
            Configuracion::getUsuarios();
            break;
        case 3:
            Configuracion::setNuevoLocal();
            break;
    }
}
