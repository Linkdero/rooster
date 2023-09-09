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
        $sql = "SELECT usuario, id_roll, id_estado, imagen FROM usuarios WHERE id = ?";

        $p = $pdo->prepare($sql);
        $p->execute(array($idUsuario));
        $usuario = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($usuario as $u) {
            $sub_array = array(
                "usuario" => $u["usuario"],
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
        $sql = "SELECT u.id, usuario, u.id_roll, r.nombre as roll, u.id_estado FROM usuarios AS u 
        LEFT JOIN rolls as r on u.id_roll = r.id";

        $p = $pdo->prepare($sql);
        $p->execute();
        $usuario = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($usuario as $u) {
            $sub_array = array(
                "id" => $u["id"],
                "usuario" => $u["usuario"],
                "roll" => $u["roll"],
                "idroll" => $u["id_roll"],
                "id_estado" => $u["id_estado"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
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
    }
}