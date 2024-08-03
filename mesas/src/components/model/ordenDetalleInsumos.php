<?php
include '../../../../inc/database.php';
date_default_timezone_set("America/Guatemala");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class OrdenDetalle
{
    //Opcion 1
    static function getOrdenDetalleInsumos()
    {
        $idOrden = null;
        $id = $_GET["id"];
        $tipo = $_GET["tipo"];

        if ($tipo == 1) {
            $idOrden = OrdenDetalle::obtenerOrden($id);
        } else {
            $idOrden = $id;
        }

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

        $p->execute([$idOrden]);

        $ordenDetalle = $p->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($ordenDetalle);
        return $ordenDetalle;
    }

    static function obtenerOrden($idMesa)
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_orden
        FROM tb_orden
        WHERE id_mesa = ? AND id_estado = ?";

        $p = $pdo->prepare($sql);

        $p->execute(array($idMesa, 4));
        $idOrden = $p->fetch();
        $idOrden = $idOrden["id_orden"];
        return $idOrden;
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            OrdenDetalle::getOrdenDetalleInsumos();
            break;
    }
}
