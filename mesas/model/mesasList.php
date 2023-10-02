<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Mesa
{
    //Opcion 1
    static function getMesasOcupadas()
    {
        $estado = $_GET["filtro"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        if ($estado == 1) {
            $sql = "SELECT id_mesa, nro_mesa, referencia,e.estado ,estado_mesa, l.descripcion as restaurante
            FROM tb_mesa as m
            LEFT JOIN tb_estado as e ON m.estado_mesa = e.id_estado
            LEFT JOIN tb_local as l ON m.id_local = l.id_local;";
        } else {
            $sql = "SELECT id_mesa, nro_mesa, referencia,e.estado ,estado_mesa, l.descripcion as restaurante
            FROM tb_mesa as m
            LEFT JOIN tb_estado as e ON m.estado_mesa = e.id_estado
            LEFT JOIN tb_local as l ON m.id_local = l.id_local
            WHERE estado_mesa = ?";
        }

        $p = $pdo->prepare($sql);
        if ($estado == 1) {
            $p->execute();
        } else {
            $p->execute(array($estado));
        }
        $mesas = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($mesas as $m) {
            $sub_array = array(
                "id_mesa" => $m["id_mesa"],
                "nro_mesa" => $m["nro_mesa"],
                "referencia" => $m["referencia"],
                "estado" => $m["estado"],
                "estado_mesa" => $m["estado_mesa"],
                "restaurante" => $m["restaurante"]

            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }
    static function getComidas()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_comida, comida, id_sub_menu, estado FROM tb_comida
        WHERE estado = 1";

        $p = $pdo->prepare($sql);

        $p->execute();

        $comida = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($comida as $c) {
            $sub_array = array(
                "id" => $c["id_comida"],
                "comida" => $c["comida"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }
    static function getInsumos()
    {
        $id = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT `id_insumo`, `descripcion`, id_comida, precio
        FROM `tb_insumo`
        WHERE id_comida = ? AND estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($id, 1));

        $insumos = $p->fetchAll(PDO::FETCH_ASSOC);
        foreach ($insumos as $i) {
            $sub_array = array(
                "id" => $i["id_insumo"],
                "descripcion" => $i["descripcion"],
                "precio" => $i["precio"],
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
            Mesa::getMesasOcupadas();
            break;

        case 2:
            Mesa::getComidas();
            break;

        case 3:
            Mesa::getInsumos();
            break;
    }
}
