<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Combo
{
    //Opcion 1
    static function getCombos()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_combo as id, descripcion as nombre, precio, c.id_estado, e.estado
         FROM tb_combo as c
        LEFT JOIN tb_estado as e ON c.id_estado = e.id_estado";

        $p = $pdo->prepare($sql);

        $p->execute();

        $combo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($combo as $c) {
            $sub_array = array(
                "id" => $c["id"],
                "nombre" => $c["nombre"],
                "id_estado" => $c["id_estado"],
                "precio" => $c["precio"],
                "estado" => $c["estado"],
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
            Combo::getCombos();
            break;
    }
}
