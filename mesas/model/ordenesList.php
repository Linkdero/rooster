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
            ELSE 'Tipo Desconocido'
        END AS tipo_producto,
        CASE 
            WHEN od.id_tipo = 1 THEN mp.materia_prima
            WHEN od.id_tipo = 2 THEN i.descripcion
            WHEN od.id_tipo = 3 THEN c.descripcion
            ELSE NULL
        END AS descripcion,
        CASE 
            WHEN od.id_tipo = 1 THEN mp.id_materia_prima
            WHEN od.id_tipo = 2 THEN i.id_insumo
            WHEN od.id_tipo = 3 THEN c.id_combo
            ELSE NULL
        END AS id_producto,
        CASE 
            WHEN od.id_tipo = 1 THEN mp.precio
            WHEN od.id_tipo = 2 THEN i.precio
            WHEN od.id_tipo = 3 THEN c.precio
            ELSE NULL
        END AS precio,
        CONCAT(m.medida , ' ', mp2.materia_prima) as nombre_equivalencia,
        mpe.id_equivalencia,
        mpe.precio as precio_equivalencia
    FROM tb_orden o
    LEFT JOIN tb_orden_detalle od ON o.id_orden = od.id_orden
    LEFT JOIN tb_materia_prima mp ON od.id_tipo = 1 AND od.id_insumo = mp.id_materia_prima
    LEFT JOIN tb_insumo i ON od.id_tipo = 2 AND od.id_insumo = i.id_insumo
    LEFT JOIN tb_combo c ON od.id_tipo = 3 AND od.id_insumo = c.id_combo   
 	LEFT JOIN tb_materia_prima_equivalencia mpe ON od.id_equivalencia = mpe.id_equivalencia
    LEFT JOIN tb_medida m ON mpe.id_medida = m.id_medida
    LEFT JOIN tb_materia_prima mp2 ON mpe.id_materia_prima = mp2.id_materia_prima
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
    }
}
