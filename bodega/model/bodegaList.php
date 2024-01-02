<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Bodega
{
    //Opcion 1
    static function getMateriaPrima()
    {
        $local = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $tipo = $_GET["tipo"];
        if ($tipo == 1) {
            $sql = "SELECT id_materia_prima as id, materia_prima as nombre, precio
                    FROM tb_materia_prima
                    WHERE id_estado = ? and id_local = ?";
        } else {
            $sql = "SELECT mp.id_materia_prima as id, mp.materia_prima as nombre, m.medida, mp.precio, mp.existencias, mp.id_estado, e.estado
                    FROM tb_materia_prima as mp
                    LEFT JOIN tb_estado as e ON mp.id_estado = e.id_estado
                    LEFT JOIN tb_medida as m ON mp.id_medida = m.id_medida ";
            if ($local != 3) {
                $sql .= "WHERE mp.id_local = ?";
            }
        }

        $p = $pdo->prepare($sql);
        if ($tipo == 1) {
            $p->execute(array(1, $local));
        } else {
            if ($local != 3) {
                $p->execute(array($local));
            } else {
                $p->execute();
            }
        }
        $insumo = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array(); // Or initialize it with the appropriate data structure.

        foreach ($insumo as $i) {
            $sub_array = [
                "id" => $i["id"],
                "nombre" => $i["nombre"],
                "precio" => $i["precio"]

            ];

            // Agregar elementos adicionales si $tipo no es igual a 1
            if ($tipo != 1) {
                $sub_array["medida"] = $i["medida"];
                $sub_array["existencias"] = $i["existencias"];
                $sub_array["id_estado"] = $i["id_estado"];
                $sub_array["estado"] = $i["estado"];
            }

            $data[] = $sub_array;
        }
        echo json_encode($data);
    }

    //Opcion 2
    static function setNuevaMateriaPrima()
    {
        try {
            $medida = $_POST["medida"];
            $precio = $_POST["precio"];
            $existencia = $_POST["existencia"];
            $descripcion = $_POST["descripcion"];
            $local = $_POST["local"];
            $fechaHoy = date("Y-m-d H:i:s");

            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            if (!is_numeric($medida)) {
                $sql = "SELECT id_medida
                        FROM tb_medida
                        WHERE medida LIKE ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($medida));
                $comprobante = $p->fetch(PDO::FETCH_ASSOC);

                if (empty($comprobante)) {
                    $sql = "INSERT INTO tb_medida(medida, id_estado)
                            VALUES (?,?)";
                    $p = $pdo->prepare($sql);
                    $p->execute(array($medida, 1));

                    $medida = $pdo->lastInsertId();
                } else {
                    $medida = $comprobante["id_medida"];
                }
            }

            $sql = "INSERT INTO tb_materia_prima(materia_prima, id_medida, precio, existencias,id_estado, id_local)
                    VALUES (?,?,?,?,?,?)";

            $p = $pdo->prepare($sql);
            $p->execute(array($descripcion, $medida, $precio, $existencia, 1, $local));

            $sql = "SELECT id_materia_prima
            FROM tb_materia_prima
            ORDER BY id_materia_prima DESC
            LIMIT 1;";

            $p = $pdo->prepare($sql);
            $p->execute();
            $idMateriaPrima = $p->fetch();
            $idMateriaPrima = $idMateriaPrima["id_materia_prima"];

            $sql = "INSERT INTO tb_materia_prima_bitacora(id_materia_prima, ingreso, fecha)
            VALUES (?,?,?)";

            $p = $pdo->prepare($sql);
            $p->execute(array($idMateriaPrima, $existencia, $fechaHoy));

            $respuesta = ['msg' => 'Materia Prima Agregada', 'id' => 1];
        } catch (PDOException $e) {
            $respuesta = array('msg' => 'ERROR', 'id' => $e->getMessage());
        } catch (Exception $e2) {
            $respuesta = array('msg' => 'ERROR', 'id' => $e2->getMessage());
        } finally {
            $pdo = null;
            echo json_encode($respuesta);
        }
    }
    static function setEstadoMateriaPrima()
    {
        $id = $_GET["id"];
        $estado = $_GET["estado"];
        if ($estado == 1) {
            $titulo = 'Materia Prima Activada';
        } else {
            $titulo = 'Materia Prima Inhabilitada';
        }
        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "UPDATE tb_materia_prima
            SET id_estado= ?
            WHERE id_materia_prima = ?";

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


    static function setNuevoIngresoBodega()
    {
        $id = $_POST["id"];
        $existencia = $_POST["existencia"];
        $fechaHoy = date("Y-m-d H:i:s");

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "UPDATE tb_materia_prima
            SET existencias = existencias + ?
            WHERE id_materia_prima = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($existencia, $id));

            $sql = "INSERT INTO tb_materia_prima_bitacora(id_materia_prima, ingreso, fecha)
            VALUES (?,?,?)";

            $p = $pdo->prepare($sql);
            $p->execute(array($id, $existencia, $fechaHoy));

            $respuesta = ['msg' => 'Ingreso Exitoso', 'id' => 1];
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
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Bodega::getMateriaPrima();
            break;

        case 2:
            Bodega::setNuevaMateriaPrima();
            break;

        case 3:
            Bodega::setEstadoMateriaPrima();
            break;

        case 4:
            Bodega::setNuevoIngresoBodega();
            break;
    }
}
