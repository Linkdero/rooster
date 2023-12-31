<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Menu
{
    //Opcion 1
    static function getMenus()
    {
        $local = $_GET["id"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id, menu as nombre FROM `tb_menu`
        WHERE id_local = ? and estado = ?";

        $p = $pdo->prepare($sql);
        $p->execute(array($local, 1));
        $menus = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($menus as $m) {
            $sub_array = array(
                "id" => $m["id"],
                "nombre" => $m["nombre"],
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
            Menu::getMenus();
            break;
    }
}
