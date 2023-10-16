<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Permiso
{
    //Opcion 1
    static function getPermisos()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id_roll as id, descripcion as nombre FROM tb_roll";

        $p = $pdo->prepare($sql);
        $p->execute();
        $permisos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($permisos as $p) {
            $sub_array = array(
                "id" => $p["id"],
                "nombre" => $p["nombre"],
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
            Permiso::getPermisos();
            break;
    }
}
