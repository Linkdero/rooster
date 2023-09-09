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
            $sql = "SELECT id_mesa, nro_mesa, referencia,e.descripcion ,estado_mesa, l.descripcion as restaurante
            FROM tb_mesa as m
            LEFT JOIN tb_estado as e ON m.estado_mesa = e.id_estado
            LEFT JOIN tb_local as l ON m.id_local = l.id_local;";
        } else {
            $sql = "SELECT id_mesa, nro_mesa, referencia,e.descripcion ,estado_mesa, l.descripcion as restaurante
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
                "descripcion" => $m["descripcion"],
                "estado_mesa" => $m["estado_mesa"],
                "restaurante" => $m["restaurante"]

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
    }
}
