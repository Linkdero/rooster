<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Medidas
{
    //Opcion 1
    static function getMedidas()
    {
        $tipo = $_GET["tipo"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if ($tipo == 1) {
            $sql = "SELECT id_medida as id, medida as nombre
            FROM tb_medida 
            WHERE id_estado = ?";
        } else {
            $sql = "SELECT id_medida as id, medida as nombre, m.id_estado as id_estado, e.estado
            FROM tb_medida as m
            LEFT JOIN tb_estado as e ON m.id_estado = e.id_estado
            WHERE m.id_estado = ?";
        }


        $p = $pdo->prepare($sql);

        $p->execute(array(1));

        $medidas = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($medidas as $m) {
            $sub_array = array(
                "id" => $m["id"],
                "nombre" => $m["nombre"],
            );

            if (isset($m["estado"])) {
                $sub_array["id_estado"] = $m["id_estado"];
                $sub_array["estado"] = $m["estado"];
            }
            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }

    static function getInsumosMedidas()
    {
        $idMedida = $_GET["filtro"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_materia_prima as id, materia_prima as nombre, mp.id_estado as estado, e.estado as descripcion
         FROM tb_materia_prima as mp
        LEFT JOIN tb_estado as e ON mp.id_estado = e.id_estado
        WHERE mp.id_medida = ? and mp.id_estado = ?";

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
            Medidas::getMedidas();
            break;

        case 2:
            Medidas::getInsumosMedidas();
            break;
    }
}
