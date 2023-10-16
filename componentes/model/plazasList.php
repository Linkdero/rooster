<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Plaza
{
    //Opcion 1
    static function getPlazas()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id_plaza as id, plaza as nombre FROM tb_plaza";

        $p = $pdo->prepare($sql);
        $p->execute();
        $plazas = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($plazas as $p) {
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
            Plaza::getPlazas();
            break;
    }
}
