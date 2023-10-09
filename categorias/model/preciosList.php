<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Precio
{
    //Opcion 1
    static function getPrecios()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_precio as id, precio as nombre FROM tb_precio";

        $p = $pdo->prepare($sql);

        $p->execute();

        $precios = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($precios as $p) {
            $sub_array = array(
                "id" => $p["id"],
                "nombre" => $p["nombre"],
            );
            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }

    static function setNuevoPrecio()
    {
        $idMedida = $_GET["filtro"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_insumo as id, i.descripcion as nombre, i.id_estado, e.descripcion
        FROM tb_insumo as i
        LEFT JOIN tb_estado as e ON i.id_estado = e.id_estado
        WHERE i.id_medida = ? and i.id_estado = ?";


        $p = $pdo->prepare($sql);

        $p->execute(array($idMedida, 1));

        $insumos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($insumos as $i) {
            $sub_array = array(
                "id" => $i["id"],
                "nombre" => $i["nombre"],
                "estado" => $i["estado"],
                "descripcion" => $i["descripcion"],
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
            Precio::getPrecios();
            break;

        case 2:
            Precio::setNuevoPrecio();
            break;
    }
}
