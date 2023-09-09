<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Mesa
{
    //Opcion 1
    static function getMenus()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT m.id, m.menu, m.estado,e.descripcion FROM `tb_menu` as m
        LEFT JOIN tb_estado as e ON m.estado = e.id_estado
        WHERE estado =1;";

        $p = $pdo->prepare($sql);

        $p->execute();

        $menu = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($menu as $m) {
            $sub_array = array(
                "id" => $m["id"],
                "menu" => $m["menu"],
                "estado" => $m["estado"],
                "descripcion" => $m["descripcion"],
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
            Mesa::getMenus();
            break;
    }
}
