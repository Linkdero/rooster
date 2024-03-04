<?php
include '../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Inventario
{
    static function getInventarioSalidas()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $fechaInicial = $_GET["fechaInicial"];
        $fechaFinal = $_GET["fechaFinal"];
        $idLocal = $_GET["local"];
        $tipo = $_GET["tipo"];

        $sql = "SELECT o.id_orden, o.fecha_final, l.descripcion, od.cantidad, od.id_tipo,
        CASE
 			WHEN od.equivalencia = 1 THEN CONCAT(m.medida , ' ', mp2.materia_prima)
            WHEN od.id_tipo = 1 THEN mp.materia_prima
            WHEN od.id_tipo = 2 THEN i.descripcion
            WHEN od.id_tipo = 3 THEN c.descripcion
            WHEN od.id_tipo = 4 THEN a.alimento_nombre
			ELSE 0
        END AS item_descripcion,
        CASE
			WHEN od.equivalencia = 1 THEN mpe.precio
            WHEN od.id_tipo = 1 THEN mp.precio
            WHEN od.id_tipo = 2 THEN i.precio
            WHEN od.id_tipo = 3 THEN c.precio
            WHEN od.id_tipo = 4 THEN a.precio_alimento
        END AS item_precio,
        (od.cantidad *
            CASE
                WHEN od.equivalencia = 1 THEN mpe.precio
                WHEN od.id_tipo = 1 THEN mp.precio
                WHEN od.id_tipo = 2 THEN i.precio
                WHEN od.id_tipo = 3 THEN c.precio
                WHEN od.id_tipo = 4 THEN a.precio_alimento
            END) AS total
    FROM tb_orden AS o
    LEFT JOIN tb_orden_detalle AS od ON o.id_orden = od.id_orden
    LEFT JOIN tb_local AS l ON o.id_local = l.id_local
    LEFT JOIN tb_estado AS e ON o.id_estado = e.id_estado
    LEFT JOIN tb_materia_prima AS mp ON od.id_tipo = 1 AND od.id_insumo = mp.id_materia_prima
    LEFT JOIN tb_insumo AS i ON od.id_tipo = 2 AND od.id_insumo = i.id_insumo
    LEFT JOIN tb_combo AS c ON od.id_tipo = 3 AND od.id_insumo = c.id_combo
	LEFT JOIN tb_materia_prima_equivalencia AS mpe ON od.id_equivalencia = mpe.id_equivalencia
    LEFT JOIN tb_medida AS m ON mpe.id_medida = m.id_medida
    LEFT JOIN tb_materia_prima AS mp2 ON mpe.id_materia_prima = mp2.id_materia_prima
    LEFT JOIN tb_alimento AS a ON od.id_tipo = 4 AND od.id_insumo = a.id_alimento 
    WHERE o.fecha_final >= ? AND o.fecha_final <= ? AND o.id_estado = ? ";

        if ($idLocal != 3) {
            $sql .= " AND o.id_local = ?";
        }

        $p = $pdo->prepare($sql);

        // Si no es el local 3, pasa el parámetro id_local en la ejecución de la consulta
        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, 5, $idLocal) : array($fechaInicial, $fechaFinal, 5);

        $p->execute($params);
        $ordenes = $p->fetchAll(PDO::FETCH_ASSOC);
        // Transformar los resultados y devolver como JSON
        $data = array();
        foreach ($ordenes as $o) {
            $sub_array = array(
                "id_orden" => $o["id_orden"],
                "fecha_final" => $o["fecha_final"],
                "descripcion" => $o["descripcion"],
                "cantidad" => $o["cantidad"],
                "id_tipo" => $o["id_tipo"],
                "item_descripcion" => $o["item_descripcion"],
                "item_precio" => $o["item_precio"],
                "total" => $o["total"],

            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
    }
    static function getInventarioEntradas()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $fechaInicial = $_GET["fechaInicial"];
        $fechaFinal = $_GET["fechaFinal"];
        $idLocal = $_GET["local"];

        $sql = "SELECT mpb.id_materia_prima, mp.materia_prima, mpb.ingreso, mpb.fecha, l.descripcion,
        mp.precio,(mpb.ingreso *  mp.precio) AS total
        FROM tb_materia_prima_bitacora as mpb
        LEFT JOIN tb_materia_prima AS mp ON mpb.id_materia_prima = mp.id_materia_prima
        LEFT JOIN tb_local AS l ON mp.id_local = l.id_local
        WHERE mpb.fecha >= ? AND mpb.fecha <= ?";

        if ($idLocal != 3) {
            $sql .= " AND mp.id_local = ?";
        }

        $p = $pdo->prepare($sql);

        // Si no es el local 3, pasa el parámetro id_local en la ejecución de la consulta
        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, $idLocal) : array($fechaInicial, $fechaFinal);

        $p->execute($params);
        $entradas = $p->fetchAll(PDO::FETCH_ASSOC);
        // Transformar los resultados y devolver como JSON
        $data = array();
        foreach ($entradas as $e) {
            $sub_array = array(
                "id_materia_prima" => $e["id_materia_prima"],
                "materia_prima" => $e["materia_prima"],
                "ingreso" => $e["ingreso"],
                "fecha" => $e["fecha"],
                "descripcion" => $e["descripcion"],
                "precio" => $e["precio"],
                "total" => $e["total"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
    }

    static function getGananciasMeseras()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $fechaInicial = $_GET["fechaInicial"];
        $fechaFinal = $_GET["fechaFinal"];
        $idLocal = $_GET["local"];

        $sql = "SELECT o.id_orden,(o.total*0.1) propina, CONCAT(e.nombre,' ',e.apellido) AS mesera , o.fecha_final, l.descripcion
        FROM tb_orden as o
        LEFT JOIN tb_empleados AS e ON o.id_mesero = e.id_empleado
        LEFT JOIN tb_local AS l ON o.id_local = l.id_local
        WHERE o.fecha_final >= ? AND o.fecha_final <= ? AND o.id_estado = ? ";

        if ($idLocal != 3) {
            $sql .= " AND o.id_local = ?";
        }

        $p = $pdo->prepare($sql);

        // Si no es el local 3, pasa el parámetro id_local en la ejecución de la consulta
        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal,5, $idLocal) : array($fechaInicial, $fechaFinal,5);

        $p->execute($params);
        $meseras = $p->fetchAll(PDO::FETCH_ASSOC);
        // Transformar los resultados y devolver como JSON
        $data = array();
        foreach ($meseras as $m) {
            $sub_array = array(
                "id_orden" => $m["id_orden"],
                "propina" => $m["propina"],
                "mesera" => $m["mesera"],
                "fecha_final" => $m["fecha_final"],
                "descripcion" => $m["descripcion"],
            );
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
            Inventario::getInventarioSalidas();
            break;
        case 2:
            Inventario::getInventarioEntradas();
            break;
        case 3:
            Inventario::getGananciasMeseras();
            break;
    }
}
