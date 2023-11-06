<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Comida
{
    //Opcion 1
    static function getComidas()
    {
        $local = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_insumo as id, i.descripcion as nombre,i.id_comida, c.comida, precio, i.id_estado, e.estado
        FROM tb_insumo as i
        LEFT JOIN tb_estado as e ON i.id_estado = e.id_estado
        LEFT JOIN tb_comida as c ON i.id_comida = c.id_comida
        LEFT JOIN tb_sub_menu as sm ON c.id_sub_menu = sm.id_sub_menu
        LEFT JOIN tb_menu as m ON sm.id_menu = m.id ";
        if ($local != 3) {
            $sql .= "WHERE m.id_local = ?";
        }
        $p = $pdo->prepare($sql);

        if ($local != 3) {
            $p->execute(array($local));
        } else {
            $p->execute();

        }

        $insumo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($insumo as $i) {
            $sub_array = array(
                "id" => $i["id"],
                "nombre" => $i["nombre"],
                "id_comida" => $i["id_comida"],
                "comida" => $i["comida"],
                "precio" => $i["precio"],
                "id_estado" => $i["id_estado"],
                "estado" => $i["estado"],
            );

            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }

    //Opcion 2
    static function setnuevoInsumo()
    {
        $comida = $_GET["comida"];
        $precio = $_GET["precio"];
        $descripcion = $_GET["descripcion"];
        $filasInsumos = $_GET["filasInsumos"];
        $local = $_GET["local"];

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();

            $sql = "INSERT INTO tb_insumo(descripcion, id_comida, precio, id_local, id_estado)
            VALUES (?,?,?,?,?)";

            $p = $pdo->prepare($sql);

            $p->execute(array($descripcion, $comida, $precio, $local, 1));

            $sql = "SELECT id_insumo
            FROM tb_insumo
            ORDER BY id_insumo DESC
            LIMIT 1";

            $p = $pdo->prepare($sql);
            $p->execute();
            $id_insumo = $p->fetch(PDO::FETCH_ASSOC);
            $id_insumo = $id_insumo["id_insumo"];

            foreach ($filasInsumos as $f) {

                $sql = "INSERT INTO tb_insumo_detalle(id_insumo, id_materia_prima,cantidades) VALUES (?,?,?)";

                $p = $pdo->prepare($sql);

                $p->execute(array($id_insumo, $f["idInsumo"], $f["cantidad"]));
            }

            $pdo->commit();

            $respuesta = ['msg' => 'Insumo Agregado', 'id' => 1];
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

    static function setEstadoInsumo()
    {
        $id = $_GET["id"];
        $estado = $_GET["estado"];
        if ($estado == 1) {
            $titulo = 'Insumo Activado';
        } else {
            $titulo = 'Insumo Inhabilitado';
        }
        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "UPDATE tb_insumo
            SET id_estado = ?
            WHERE id_insumo =?";

            $p = $pdo->prepare($sql);

            $p->execute(array($estado, $id));

            $respuesta = ['msg' => $titulo, 'id' => 1];
        } catch (PDOException $e) {
            $respuesta = array('msg' => 'ERROR', 'id' => $e);
            try {
                $pdo->rollBack();
            } catch (Exception $e2) {
                $respuesta = array('msg' => 'ERROR', 'id' => $e2);
            }
        }
        $pdo = null;
        echo json_encode($respuesta);
    }

    static function getInsumosFiltrados()
    {
        $id = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_insumo as id, descripcion as nombre, precio
        FROM tb_insumo
        WHERE id_comida = ? and id_estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($id, 1));

        $insumo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($insumo as $i) {
            $sub_array = array(
                "id" => $i["id"],
                "nombre" => $i["nombre"],
                "precio" => $i["precio"],
            );

            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }

    static function getInsumos()
    {
        $local = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT i.id_insumo as id, i.descripcion as nombre, i.id_local
        FROM  tb_insumo i
        LEFT JOIN  tb_comida c ON i.id_comida = c.id_comida
        LEFT JOIN  tb_sub_menu sm ON c.id_sub_menu = sm.id_sub_menu
        LEFT JOIN  tb_menu m ON sm.id_menu = m.id
        WHERE m.id_local = ? AND i.id_estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($local, 1));

        $insumo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($insumo as $i) {
            $sub_array = array(
                "id" => $i["id"],
                "nombre" => $i["nombre"]
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
            Comida::getComidas();
            break;

        case 2:
            Comida::setnuevoInsumo();
            break;

        case 3:
            Comida::setEstadoInsumo();
            break;

        case 4:
            Comida::getInsumosFiltrados();
            break;
        case 5:
            Comida::getInsumos();
            break;
    }
}