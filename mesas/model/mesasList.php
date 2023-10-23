<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Mesa
{
    //Opcion 1
    static function getMesasOcupadas()
    {
        // Parsear los parámetros
        $estado = isset($_GET["filtro"]) ? $_GET["filtro"] : null;
        $local = isset($_GET["local"]) ? $_GET["local"] : null;

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Construir la consulta SQL
        $sql = "SELECT id_mesa, nro_mesa, referencia, e.estado, estado_mesa, l.descripcion as restaurante
                FROM tb_mesa as m
                LEFT JOIN tb_estado as e ON m.estado_mesa = e.id_estado
                LEFT JOIN tb_local as l ON m.id_local = l.id_local
                WHERE 1=1";

        $params = array();

        if ($estado && $estado != 1 && $estado != 3) {
            $sql .= " AND estado_mesa = ?";
            $params[] = $estado;
        }

        if ($local != 3) {
            $sql .= " AND m.id_local = ?";
            $params[] = $local;
        }

        // Ejecutar la consulta
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Transformar los resultados y devolver como JSON
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

    static function getComidas()
    {
        $local = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT c.id_comida as id, c.comida, m.id_local
        FROM tb_comida c
        LEFT JOIN tb_sub_menu sm ON c.id_sub_menu = sm.id_sub_menu
        LEFT JOIN tb_menu m ON sm.id_menu = m.id
        WHERE c.estado = ? AND m.id_local = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array(1, $local));

        $comida = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($comida as $c) {
            $sub_array = array(
                "id" => $c["id"],
                "comida" => $c["comida"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }
    static function getInsumos()
    {
        $id = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT `id_insumo`, `descripcion`, id_comida, precio
        FROM `tb_insumo`
        WHERE id_comida = ? AND estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($id, 1));

        $insumos = $p->fetchAll(PDO::FETCH_ASSOC);
        foreach ($insumos as $i) {
            $sub_array = array(
                "id" => $i["id_insumo"],
                "descripcion" => $i["descripcion"],
                "precio" => $i["precio"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    static function setNuevaOrden()
    {
        $descripcion = $_GET["descripcion"];
        $idMesa = $_GET["idMesa"];
        $fechaHoraActual = date('Y-m-d H:i:s');
        $filasInsumos = $_GET["filasInsumos"];
        $regNum = 1;
        $nombreCliente = $_GET["nombreCliente"];
        $idEmpleado = $_GET["idEmpleado"];
        $idLocal = $_GET["idLocal"];

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();

            $sql = "UPDATE tb_mesa SET estado_mesa = ?
            WHERE id_mesa = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array(4, $idMesa));

            $sql = "INSERT INTO tb_orden(descripcion, id_mesa, id_mesero, fecha_inicio, id_estado, id_local) 
            VALUES (?,?,?,?,?,?)";

            $p = $pdo->prepare($sql);

            $p->execute(array($descripcion, $idMesa, $idEmpleado, $fechaHoraActual, 4, $idLocal));

            $sql = "SELECT id_orden
            FROM tb_orden
            ORDER BY id_orden DESC
            LIMIT 1";

            $p = $pdo->prepare($sql);
            $p->execute();
            $id_orden = $p->fetch(PDO::FETCH_ASSOC);
            $id_orden = $id_orden["id_orden"];

            $sql = "INSERT INTO tb_cliente(id_orden,nom_cliente)
            VALUES (?,?)";

            $p = $pdo->prepare($sql);

            $p->execute(array($id_orden, $nombreCliente));

            foreach ($filasInsumos as $f) {
                $sql = "INSERT INTO tb_orden_detalle(id_orden, reg_num, id_insumo, cantidad, id_tipo)
                VALUES (?,?,?,?,?)";
                $p = $pdo->prepare($sql);

                $p->execute(array($id_orden, $regNum, $f["idInsumo"], $f["cantidad"], $f["tipoMenu"]));
                $regNum++;
            }

            foreach ($filasInsumos as $f) {
                if ($f["tipoMenu"] == 3) {
                    $sql = "SELECT cd.id_insumo, SUM(cd.cantidades * ?) as cantidades
                    FROM tb_combo_detalle as cd
                    WHERE cd.id_combo = ?";
                    $p = $pdo->prepare($sql);
                    $p->execute(array($f["cantidad"], $f["idInsumo"]));
                    $insumos = $p->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($insumos as $i) {
                        $sql = "SELECT id.id_materia_prima, SUM(id.cantidades * ?) as cantidades
                                FROM tb_insumo_detalle as id
                                WHERE id_insumo = ?";
                        $p = $pdo->prepare($sql);
                        $p->execute(array($i["cantidades"], $i["id_insumo"]));
                        $datosFinales = $p->fetchAll(PDO::FETCH_ASSOC);

                        foreach ($datosFinales as $df) {
                            $sql = "UPDATE tb_materia_prima 
                                    SET existencias = existencias - ? 
                                    WHERE id_materia_prima = ?";
                            $p = $pdo->prepare($sql);
                            $p->execute(array($df["cantidades"], $df["id_materia_prima"]));
                        }
                    }
                } else if ($f["tipoMenu"] == 2) {
                    $sql = "SELECT id.id_materia_prima, SUM(id.cantidades * ?) as cantidades
                    FROM tb_insumo_detalle as id
                    WHERE id_insumo = ?";
                    $p = $pdo->prepare($sql);
                    $p->execute(array($f["cantidad"], $f["idInsumo"]));
                    $insumos = $p->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($insumos as $i) {
                        $sql = "UPDATE tb_materia_prima 
                                    SET existencias = existencias - ? 
                                    WHERE id_materia_prima = ?";
                        $p = $pdo->prepare($sql);
                        $p->execute(array($i["cantidades"], $i["id_materia_prima"]));
                    }
                } else if ($f["tipoMenu"] == 1) {
                    $sql = "UPDATE tb_materia_prima 
                    SET existencias = existencias - ? 
                    WHERE id_materia_prima = ?";
                    $p = $pdo->prepare($sql);
                    $p->execute(array($f["cantidad"], $f["idInsumo"]));
                }
            }
            $pdo->commit();

            $respuesta =  ['msg' => 'Orden Generada', 'id' => 1];
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

    static function setFinalizarOrden()
    {
        $idMesa = $_GET["id"];
        $nit = $_GET["nit"];
        $direccion = $_GET["direccion"];
        $observacion = $_GET["observacion"];
        $fechaHoraActual = date('Y-m-d H:i:s');
        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();

            $sql = "UPDATE tb_mesa SET estado_mesa = ?
            WHERE id_mesa = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array(3, $idMesa));

            $sql = "SELECT id_orden FROM tb_orden
            WHERE id_mesa = ? AND id_estado = ?";

            $p = $pdo->prepare($sql);
            $p->execute(array($idMesa, 4));
            $idORden = $p->fetch(PDO::FETCH_ASSOC);
            $idORden = $idORden["id_orden"];


            $sql = "SELECT
            SUM(
                CASE
                    WHEN od.id_tipo = 1 THEN mp.precio
                    WHEN od.id_tipo = 2 THEN ins.precio
                    WHEN od.id_tipo = 3 THEN c.precio
                    ELSE 0 -- Puedes establecer un valor por defecto si es necesario
                END
            ) AS total_precio
        FROM tb_orden_detalle od
        LEFT JOIN tb_materia_prima mp ON od.id_tipo = 1 AND od.id_insumo = mp.id_materia_prima
        LEFT JOIN tb_insumo ins ON od.id_tipo = 2 AND od.id_insumo = ins.id_insumo
        LEFT JOIN tb_combo c ON od.id_tipo = 3 AND od.id_insumo = c.id_combo
        WHERE od.id_orden = ?;";

            $p = $pdo->prepare($sql);
            $p->execute(array($idORden));
            $sumaTotal = $p->fetch(PDO::FETCH_ASSOC);
            $sumaTotal = $sumaTotal["total_precio"];

            $sql = "UPDATE tb_orden 
            SET total=?,fecha_final=?,id_estado=?
            WHERE id_orden = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($sumaTotal, $fechaHoraActual, 5, $idORden));

            $sql = "UPDATE tb_cliente
            SET nit_cliente=?,direccion=?,observacion=?
            WHERE id_orden = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($nit, $direccion, $observacion, $idORden));

            $pdo->commit();

            $respuesta =  ['msg' => 'Orden Finalizada', 'id' => 1];
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
            Mesa::getMesasOcupadas();
            break;

        case 2:
            Mesa::getComidas();
            break;

        case 3:
            Mesa::getInsumos();
            break;

        case 4:
            Mesa::setNuevaOrden();
            break;
        case 5:
            Mesa::setFinalizarOrden();
            break;
    }
}
