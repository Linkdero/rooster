<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Categoria
{
    //Opcion 1
    static function getMenus()
    {
        $tipoTabla = $_GET["tipoTabla"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if ($tipoTabla ==  1) {
            $sql = "SELECT m.id as id, m.menu as nombre, m.estado as estado,e.descripcion as descripcion
            FROM tb_menu as m
            LEFT JOIN tb_estado as e ON m.estado = e.id_estado";
        } else if ($tipoTabla ==  2) {
            $sql = "SELECT id_sub_menu as id, sub_menu as nombre, id_menu as idPadre, estado as estado, e.descripcion as descripcion
            FROM tb_sub_menu as sm
            LEFT JOIN tb_estado as e ON sm.estado = e.id_estado";
        } else if ($tipoTabla ==  3) {
            $sql = "SELECT id_comida as id, comida as nombre, id_sub_menu as idPadre, estado as estado,e.descripcion
            FROM tb_comida as c
            LEFT JOIN tb_estado as e ON c.estado = e.id_estado";
        }

        $p = $pdo->prepare($sql);

        $p->execute();

        $menu = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($menu as $m) {
            $sub_array = array(
                "id" => $m["id"],
                "menu" => $m["nombre"],
                "estado" => $m["estado"],
                "descripcion" => $m["descripcion"],
            );

            // Agregar el campo idPadre si está presente en la consulta
            if (isset($m["idPadre"])) {
                $sub_array["idPadre"] = $m["idPadre"];
            }

            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }
    static function getCatalogo()
    {
        $filtro = $_GET["filtro"];
        $tipoTabla = $_GET["tipoTabla"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if ($tipoTabla == 1) {
            $sql = "SELECT sm.id_sub_menu as id, sm.sub_menu as nombre, sm.id_menu as idPadre, sm.estado, e.descripcion FROM tb_sub_menu as sm 
            LEFT JOIN tb_estado as e ON sm.estado = e.id_estado
            WHERE sm.id_menu = ?";
        } else if ($tipoTabla == 2) {
            $sql = "SELECT c.id_comida as id, c.comida as nombre, c.id_sub_menu as idPadre, c.estado, e.descripcion FROM tb_comida as c
            LEFT JOIN tb_estado as e ON c.estado = e.id_estado
            WHERE c.id_sub_menu = ?";
        } else if ($tipoTabla == 3) {
            $sql = "SELECT sm.id_sub_menu, sm.sub_menu, sm.id_menu, sm.estado, e.descripcion FROM tb_sub_menu as sm 
            LEFT JOIN tb_estado as e ON sm.estado = e.id_estado
            WHERE sm.id_menu = ?";
        }

        $p = $pdo->prepare($sql);

        $p->execute(array($filtro));

        $catalogos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($catalogos as $c) {
            $sub_array = array(
                "id" => $c["id"],
                "nombre" => $c["nombre"],
                "idPadre" => $c["idPadre"],
                "descripcion" => $c["descripcion"],
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
            Categoria::getMenus();
            break;

        case 2:
            Categoria::getCatalogo();
            break;
    }
}
