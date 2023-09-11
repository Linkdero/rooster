<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Bodega
{
    //Opcion 1
    static function getInsumos()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_insumo as id, i.descripcion as nombre, id_menu, i.id_sub_menu,
        i.id_comida, c.comida, i.id_medida, m.medida, precio, i.estado, e.descripcion, existencias
        FROM tb_insumo as i
        LEFT JOIN tb_estado as e ON i.estado = e.id_estado
        LEFT JOIN tb_comida as c ON i.id_comida = c.id_comida
        LEFT JOIN tb_medida as m ON i.id_medida = m.id_medida";

        $p = $pdo->prepare($sql);

        $p->execute();

        $insumo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($insumo as $i) {
            $sub_array = array(
                "id" => $i["id"],
                "nombre" => $i["nombre"],
                "id_menu" => $i["id_menu"],
                "id_sub_menu" => $i["id_sub_menu"],
                "id_comida" => $i["id_comida"],
                "comida" => $i["comida"],
                "id_medida" => $i["id_medida"],
                "medida" => $i["medida"],
                "precio" => $i["precio"],
                "estado" => $i["estado"],
                "descripcion" => $i["descripcion"],
                "existencias" => $i["existencias"],
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
            Bodega::getInsumos();
            break;
    }
}
