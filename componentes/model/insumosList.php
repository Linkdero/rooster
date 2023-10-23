<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Insumo
{
    //Opcion 1
    static function getInsumosComida()
    {
        $comida = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id_insumo as id, descripcion as nombre
        FROM tb_insumo
        WHERE id_comida = ? and id_estado = ?";

        $p = $pdo->prepare($sql);
        $p->execute(array($comida, 1));

        $insumos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($insumos as $i) {
            $sub_array = array(
                "id" => $i["id"],
                "nombre" => $i["nombre"],
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
            Insumo::getInsumosComida();
            break;
    }
}
