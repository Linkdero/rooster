<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Combo
{
    //Opcion 1
    static function getCombos()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_combo as id, descripcion as nombre, precio, c.id_estado, e.estado
        FROM tb_combo as c
        LEFT JOIN tb_estado as e ON c.id_estado = e.id_estado";
        $p = $pdo->prepare($sql);
        $p->execute();

        $combo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($combo as $c) {
            $sub_array = array(
                "id" => $c["id"],
                "nombre" => $c["nombre"],
                "id_estado" => $c["id_estado"],
                "precio" => $c["precio"],
                "estado" => $c["estado"],
            );
            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }

    static function setnuevoCombo()
    {
        $precio = $_GET["precio"];
        $descripcion = $_GET["descripcion"];
        $filasInsumos = $_GET["filasInsumos"];
        $local = $_GET["local"];

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();

            $sql = "INSERT INTO tb_combo(descripcion, precio, id_estado, id_local) 
            VALUES (?,?,?,?)";

            $p = $pdo->prepare($sql);

            $p->execute(array($descripcion, $precio, 1, $local));

            $sql = "SELECT id_combo
            FROM tb_combo
            ORDER BY id_combo DESC
            LIMIT 1";

            $p = $pdo->prepare($sql);
            $p->execute();
            $id_combo = $p->fetch(PDO::FETCH_ASSOC);
            $id_combo = $id_combo["id_combo"];

            foreach ($filasInsumos as $f) {

                $sql = "INSERT INTO `tb_combo_detalle`(`id_combo`, `id_insumo`, `cantidades`)
                VALUES (?,?,?)";
                $p = $pdo->prepare($sql);

                $p->execute(array($id_combo, $f["idInsumo"], $f["cantidad"]));
            }

            $pdo->commit();

            $respuesta =  ['msg' => 'Combo Agregado', 'id' => 1];
        } catch (PDOException $e) {
            // Si hay una excepción, realiza un rollback
            $pdo->rollBack();
            $respuesta = ['msg' => 'ERROR', 'id' => ['errorInfo' => $e->getMessage()]];
        } finally {
            // Asegúrate de cerrar la conexión al finalizar
            $pdo = null;
        }

        // Devuelve la respuesta
        echo json_encode($respuesta);
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Combo::getCombos();
            break;
        case 2:
            Combo::setnuevoCombo();
            break;
    }
}
