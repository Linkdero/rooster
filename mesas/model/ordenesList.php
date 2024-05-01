<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Orden
{
    //Opcion 1
    static function getOrdenes()
    {
        // Parsear los parámetros
        $estado = isset($_GET["filtro"]) ? $_GET["filtro"] : null;
        $horaInicial = isset($_GET['horaInicial']) ? $_GET['horaInicial'] : null;
        $horaFinal = isset($_GET['horaFinal']) ? $_GET['horaFinal'] : null;
        $local = isset($_GET["local"]) ? $_GET["local"] : null;

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Construir la consulta SQL
        $sql = "SELECT o.id_orden, o.descripcion, o.total, o.fecha_final, o.id_estado, e.estado, c.nom_cliente
                FROM tb_orden AS o
                LEFT JOIN tb_estado as e ON o.id_estado = e.id_estado
                LEFT JOIN tb_cliente as c ON o.id_orden = c.id_orden
                WHERE 1 "; // Agregamos un 1 para construir la cláusula WHERE correctamente

        $params = []; // Un array para almacenar los parámetros a pasar en execute

        if ($horaInicial && $horaFinal) {
            $sql .= " AND o.fecha_inicio >= ? AND o.fecha_final <= ?";
            $params[] = $horaInicial; // Añadimos el primer parámetro
            $params[] = $horaFinal; // Añadimos el segundo parámetro
        }

        if ($local != 3) {
            $sql .= " AND o.id_local = ?";
            $params[] = $local; // Añadimos el tercer parámetro
        }

        if ($estado != 1) {
            $sql .= " AND o.id_estado = ?";
            $params[] = $estado; // Añadimos el cuarto parámetro
        }

        // Ordenar
        $sql .= " ORDER BY o.id_orden DESC";

        // Ejecutar la consulta
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params); // Pasamos el array de parámetros

        $ordenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Transformar los resultados y devolver como JSON
        $data = array();
        foreach ($ordenes as $o) {
            $sub_array = array(
                "id_orden" => $o["id_orden"],
                "descripcion" => $o["descripcion"],
                "total" => $o["total"],
                "fecha_final" => $o["fecha_final"],
                "id_estado" => $o["id_estado"],
                "estado" => $o["estado"],
                "nom_cliente" => $o["nom_cliente"]
            );
            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }


    static function getNombreCliente()
    {
        $idMesa = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT c.nom_cliente as nombre
        FROM tb_orden as o
        LEFT JOIN tb_cliente AS c ON o.id_orden = c.id_orden
        WHERE o.id_mesa = ? and o.id_estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idMesa, 4));

        $comida = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($comida as $c) {
            $sub_array = array(
                "nombre" => $c["nombre"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    static function getOrdenDetalle()
    {
        $idOrden = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT
        o.id_orden,
        od.reg_num,
        od.cantidad,
        o.total,
        CASE
            WHEN od.id_tipo = 1 THEN 'Materia Prima'
            WHEN od.id_tipo = 2 THEN 'Insumo'
            WHEN od.id_tipo = 3 THEN 'Combo'
            WHEN od.id_tipo = 4 THEN 'Alimento'
            ELSE 'Tipo Desconocido'
        END AS tipo_producto,
        CASE
            WHEN od.id_tipo = 1 THEN mp.materia_prima
            WHEN od.id_tipo = 2 THEN i.descripcion
            WHEN od.id_tipo = 3 THEN c.descripcion
            WHEN od.id_tipo = 4 THEN a.alimento_nombre
            ELSE NULL
        END AS descripcion,
        CASE
            WHEN od.id_tipo = 1 THEN mp.id_materia_prima
            WHEN od.id_tipo = 2 THEN i.id_insumo
            WHEN od.id_tipo = 3 THEN c.id_combo
            WHEN od.id_tipo = 4 THEN a.id_alimento
            ELSE NULL
        END AS id_producto,
        CASE
            WHEN od.id_tipo = 1 THEN mp.precio
            WHEN od.id_tipo = 2 THEN i.precio
            WHEN od.id_tipo = 3 THEN c.precio
            WHEN od.id_tipo = 4 THEN a.precio_alimento

            ELSE NULL
        END AS precio,
        CONCAT(m.medida , ' ', mp2.materia_prima) as nombre_equivalencia,
        mpe.id_equivalencia,
        mpe.precio as precio_equivalencia,
        od.id_tipo,
        od.estado as estado_insumo
    FROM tb_orden o
    LEFT JOIN tb_orden_detalle od ON o.id_orden = od.id_orden
    LEFT JOIN tb_materia_prima mp ON od.id_tipo = 1 AND od.id_insumo = mp.id_materia_prima
    LEFT JOIN tb_insumo i ON od.id_tipo = 2 AND od.id_insumo = i.id_insumo
    LEFT JOIN tb_combo c ON od.id_tipo = 3 AND od.id_insumo = c.id_combo
 	LEFT JOIN tb_materia_prima_equivalencia mpe ON od.id_equivalencia = mpe.id_equivalencia
    LEFT JOIN tb_medida m ON mpe.id_medida = m.id_medida
    LEFT JOIN tb_materia_prima mp2 ON mpe.id_materia_prima = mp2.id_materia_prima
    LEFT JOIN tb_alimento AS a ON od.id_tipo = 4 AND od.id_insumo = a.id_alimento
    WHERE o.id_orden = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idOrden));

        $ordenDetalle = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($ordenDetalle as $o) {
            $sub_array = array(
                "id_orden" => $o["id_orden"],
                "reg_num" => $o["reg_num"],
                "tipo_producto" => $o["tipo_producto"],
                "descripcion" => $o["descripcion"],
                "id_producto" => $o["id_producto"],
                "precio" => $o["precio"],
                "cantidad" => $o["cantidad"],
                "total" => $o["total"],
                "nombre_equivalencia" => $o["nombre_equivalencia"],
                "id_equivalencia" => $o["id_equivalencia"],
                "precio_equivalencia" => $o["precio_equivalencia"],
                "estado_insumo" => $o["estado_insumo"],
                "id_tipo" => $o["id_tipo"],
                "estado_insumo" => $o["estado_insumo"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    static function getInformacionCliente()
    {
        $idOrden = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT c.nom_cliente as nombre, nit_cliente as nit, c.direccion, observacion, o.id_mesero, l.descripcion as locales,
        CONCAT(em.nombre, ' ', em.apellido) as mesera, em.foto, o.fecha_inicio, o.fecha_final
        FROM tb_orden as o
        LEFT JOIN tb_cliente AS c ON o.id_orden = c.id_orden
        LEFT JOIN tb_empleados AS em ON o.id_mesero = em.id_empleado
        LEFT JOIN tb_local AS l ON em.id_local = l.id_local
        WHERE o.id_orden = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idOrden));

        $cliente = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($cliente as $c) {
            $sub_array = array(
                "nombre" => $c["nombre"],
                "nit" => $c["nit"],
                "direccion" => $c["direccion"],
                "observacion" => $c["observacion"],
                "id_mesero" => $c["id_mesero"],
                "mesera" => $c["mesera"],
                "foto" => $c["foto"],
                "locales" => $c["locales"],
                "fecha_inicio" => $c["fecha_inicio"],
                "fecha_final" => $c["fecha_final"],

            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }
    static function obtenerOrden()
    {
        $idOrden = $_GET["id"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_orden
        FROM tb_orden
        WHERE id_mesa = ? AND id_estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idOrden, 4));
        $orden = $p->fetch();
        $idOrden = $orden["id_orden"];
        echo $idOrden;
        return $idOrden;
    }
    static function setActualizarEstadoInsumo()
    {
        $estado = $_POST["estado"];
        $id = $_POST["id"];
        $tipo = $_POST["tipo"];
        if ($estado) {
            $estado = 0;
        } else {
            $estado = 1;
        }
        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();

            $sql = "UPDATE tb_orden_detalle
            SET estado = ?
            WHERE id_insumo = ? AND id_tipo = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($estado, $id, $tipo));

            $pdo->commit();

            $respuesta = ['msg' => 'Estado Actualizado', 'id' => 1];
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

    static function getTragosChicaRooster()
    {
        $idOrden = $_GET["id"];
        $correlativo = 1;
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT tcr.id_empleado, CONCAT(e.nombre ,' ' ,e.apellido) AS nombre_mesera,
        tcr.id_materia_prima, mp.materia_prima,cantidad, tcr.precio
        FROM tbl_trago_chica_rooster AS tcr
        LEFT OUTER JOIN tb_empleados AS e ON tcr.id_empleado = e.id_empleado
        LEFT OUTER JOIN tb_materia_prima AS mp ON tcr.id_materia_prima = mp.id_materia_prima
        WHERE id_orden = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idOrden));

        $trago = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($trago as $t) {
            $sub_array = array(
                "correlativo" => $correlativo,
                "id_empleado" => $t["id_empleado"],
                "nombre_mesera" => $t["nombre_mesera"],
                "id_materia_prima" => $t["id_materia_prima"],
                "materia_prima" => $t["materia_prima"],
                "cantidad" => $t["cantidad"],
                "precio" => $t["precio"]
            );
            $data[] = $sub_array;
            $correlativo++;
        }
        echo json_encode($data);
        return $data;
    }

    static function setTragosChicaRooster()
    {
        // Obtener datos del POST
        $tragos = $_POST["tragos"];
        $idOrden = $_POST["orden"];

        // Decodificar la cadena JSON de tragos
        $tragos = json_decode($tragos, true);

        try {
            $db = new Database();
            $pdo = $db->connect();

            // Establecer el modo de error y comenzar la transacción
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();

            foreach ($tragos as $t) {
                $id_materia_prima = $t["id_materia_prima"];
                $id_empleado = $t["id_empleado"];
                $cantidad = $t["cantidad"];
                $precio = $t["precio"];

                // Verificar si ya existe un registro para este trago en la orden
                $sql = "SELECT COUNT(id_orden) as conteo
                        FROM tbl_trago_chica_rooster
                        WHERE id_orden = ? AND id_materia_prima = ? AND id_empleado = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$idOrden, $id_materia_prima, $id_empleado]);
                $conteo = $stmt->fetchColumn();

                if ($conteo) {
                    // Actualizar el registro existente
                    $sql = "UPDATE tbl_trago_chica_rooster
                            SET cantidad = ?, precio = ?
                            WHERE id_orden = ? AND id_materia_prima = ? AND id_empleado = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$cantidad, $precio, $idOrden, $id_materia_prima, $id_empleado]);
                } else {
                    // Insertar un nuevo registro
                    $sql = "INSERT INTO tbl_trago_chica_rooster (id_orden, id_empleado, id_materia_prima, cantidad, precio)
                            VALUES (?, ?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$idOrden, $id_empleado, $id_materia_prima, $cantidad, $precio]);
                }
            }

            // Confirmar la transacción si todas las operaciones se completaron correctamente
            $pdo->commit();

            $respuesta = ['msg' => 'Tragos Actualizados', 'id' => 1];
        } catch (PDOException $e) {
            // Si hay una excepción, realizar un rollback y capturar el mensaje de error
            $pdo->rollBack();
            $respuesta = ['msg' => 'ERROR', 'id' => ['errorInfo' => $e->getMessage()]];
        } finally {
            // Cerrar la conexión PDO al finalizar
            $pdo = null;
        }

        // Devolver la respuesta como JSON
        echo json_encode($respuesta);
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Orden::getOrdenes();
            break;

        case 2:
            Orden::getNombreCliente();
            break;

        case 3:
            Orden::getOrdenDetalle();
            break;

        case 4:
            Orden::getInformacionCliente();
            break;

        case 5;
            Orden::obtenerOrden();
            break;

        case 6;
            Orden::setActualizarEstadoInsumo();
            break;

        case 7;
            Orden::getTragosChicaRooster();
            break;
        case 8;
            Orden::setTragosChicaRooster();
            break;
    }
}
