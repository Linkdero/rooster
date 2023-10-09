<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Orden
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
    static function getNombreCliente()
    {
        $idMesa = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT c.nom_cliente as nombre
        FROM tb_orden as o
        LEFT JOIN tb_cliente AS c ON o.id_orden = c.id_orden
        WHERE o.id_mesa = ? and o.id_estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idMesa, 4));

        $comida = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($comida as $c) {
            $sub_array = array(
                "nombre" => $c["nombre"],
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
            Orden::getMesasOcupadas();
            break;

        case 2:
            Orden::getNombreCliente();
            break;
    }
}
