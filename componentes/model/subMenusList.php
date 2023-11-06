<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class SubMenu
{
    //Opcion 1
    static function getSubMenus()
    {
        $local = $_GET["id"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id
        FROM tb_menu
        WHERE id_local = ? and estado = ?";

        $p = $pdo->prepare($sql);
        $p->execute(array($local, 1));
        $menus = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();

        foreach ($menus as $m) {
            $sql = "SELECT id_sub_menu as id, sub_menu as nombre
            FROM tb_sub_menu
            WHERE id_menu = ? and estado = ?";

            $p = $pdo->prepare($sql);
            $p->execute(array($m['id'], 1));
            $subMenus = $p->fetchAll(PDO::FETCH_ASSOC);

            foreach ($subMenus as $s) {
                $sub_array = array(
                    "id" => $s["id"],
                    "nombre" => $s["nombre"],
                );
                $data[] = $sub_array;
            }
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
            SubMenu::getSubMenus();
            break;
    }
}