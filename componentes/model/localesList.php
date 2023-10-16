<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Local
{
    //Opcion 1
    static function getLocales()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id_local as id, descripcion as nombre FROM tb_local WHERE id_local !=?";

        $p = $pdo->prepare($sql);
        $p->execute(array(3));
        $locales = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($locales as $l) {
            $sub_array = array(
                "id" => $l["id"],
                "nombre" => $l["nombre"],
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
            Local::getLocales();
            break;
    }
}
