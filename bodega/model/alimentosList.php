<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Alimento
{
    //Opcion 1
    static function getAlimentos()
    {
        $local = $_GET["id"];
        $estado = $_GET["estado"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $tipo = $_GET["tipo"];
        if ($tipo == 1) {
            $sql = "SELECT id_materia_prima as id, materia_prima as nombre, precio,equivalencia
                    FROM tb_materia_prima
                    WHERE id_estado = ? and id_local = ?";
        } else {
            $sql = "SELECT id_alimento,alimento_nombre, alimento_descripcion,precio_alimento, id_estado
            FROM tb_alimento
            WHERE id_estado = ? ";
            if ($local != 3) {
                $sql .= " AND id_local = ?";
            }
        }

        $p = $pdo->prepare($sql);
        if ($tipo == 1) {
            $p->execute(array(1, $local));
        } else {
            if ($local != 3) {
                $p->execute(array($estado, $local));
            } else {
                $p->execute(array($estado));
            }
        }
        $alimentos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();

        foreach ($alimentos as $a) {
            $sub_array = [
                "id_alimento" => $a["id_alimento"],
                "alimento_nombre" => $a["alimento_nombre"],
                "precio_alimento" => $a["precio_alimento"],
            ];

            if ($tipo != 1) {
                $sub_array["alimento_descripcion"] = $a["alimento_descripcion"];
                $sub_array["id_estado"] = $a["id_estado"];
            }

            $data[] = $sub_array;
        }
        echo json_encode($data);
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Alimento::getAlimentos();
            break;
    }
}
