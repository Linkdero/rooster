<?php
include '../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Dashboard
{
    static function getReporteria()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $fechaInicial = $_GET["fechaInicial"];
        $fechaFinal = $_GET["fechaFinal"];
        $idLocal = $_GET["idLocal"];

        $data = array(
            "totalOrdenes" => 0,
            "sumaTotales" => 0,  // Inicializar la suma totales en 0
            "clientes" => array(),
            "ordenes" => array(),
            "observaciones" => array(),
            "meseras" => array(),
        );

        $sql = "SELECT COUNT(`id_orden`) AS total_ordenes, SUM(`total`) AS suma_totales
                FROM `tb_orden`
                WHERE fecha_inicio >= ? AND fecha_final <= ? AND id_estado = ?";

        if ($idLocal != 3) {
            $sql .= " AND id_local = ?";
        }

        $p = $pdo->prepare($sql);

        // Si no es el local 3, pasa el parámetro id_local en la ejecución de la consulta
        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, 5, $idLocal) : array($fechaInicial, $fechaFinal, 5);

        $p->execute($params);
        $ordenes = $p->fetchAll(PDO::FETCH_ASSOC);

        foreach ($ordenes as $o) {
            $data["totalOrdenes"] += $o["total_ordenes"];
            $data["sumaTotales"] += $o["suma_totales"];
        }

        //Codigo para obtener las descripciones de las ordenes
        $sql = "SELECT o.id_orden, o.total, o.fecha_final, c.nom_cliente, o.descripcion
        FROM tb_orden o
        LEFT JOIN tb_cliente c ON o.id_orden = c.id_orden
        WHERE  o.fecha_inicio >= ? AND o.fecha_final <= ? AND o.id_estado = ?;";

        if ($idLocal != 3) {
            $sql .= " AND o.id_local = ?";
        }
        $p = $pdo->prepare($sql);

        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, 5, $idLocal) : array($fechaInicial, $fechaFinal, 5);

        $p->execute($params);
        $clientes = $p->fetchAll(PDO::FETCH_ASSOC);

        foreach ($clientes as $c) {
            $sub_array[] = array(
                "idOrden" => $c["id_orden"],
                "total" => $c["total"],
                "fecha_final" => $c["fecha_final"],
                "nom_cliente" => $c["nom_cliente"],
                "descripcion" => $c["descripcion"],

            );
            $data["clientes"] = $sub_array;
        }

        $sub_array = null;

        //Codigo para obtener todas las ordenes
        $sql = "SELECT id_orden, total
        FROM tb_orden
        WHERE fecha_inicio >= ? AND fecha_final <= ? AND id_estado = ?;";

        if ($idLocal != 3) {
            $sql .= " AND id_local = ?";
        }
        $p = $pdo->prepare($sql);

        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, 5, $idLocal) : array($fechaInicial, $fechaFinal, 5);

        $p->execute($params);
        $datosGrafica = $p->fetchAll(PDO::FETCH_ASSOC);

        foreach ($datosGrafica as $d) {
            $sub_array[] = array(
                "id_orden" => $d["id_orden"],
                "total" => $d["total"],
            );
            $data["ordenes"] = $sub_array;
        }
        $sub_array = null;

        //Codigo para obtener las observaciones de los clientes
        $sql = "SELECT 
        o.id_orden, 
        o.total * 0.1 AS propina,
        o.fecha_final, 
        c.observacion,
        c.nom_cliente,
        CONCAT(e.nombre, ' ', e.apellido) AS mesera
        FROM tb_orden AS o
        LEFT JOIN tb_empleados AS e ON o.id_mesero = e.id_empleado
        LEFT JOIN tb_cliente AS c ON o.id_orden = c.id_orden
        WHERE o.fecha_inicio >= ? AND o.fecha_final <= ? AND o.id_estado = ?;";

        if ($idLocal != 3) {
            $sql .= " AND o.id_local = ?";
        }

        $p = $pdo->prepare($sql);

        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, 5, $idLocal) : array($fechaInicial, $fechaFinal, 5);

        $p->execute($params);
        $clientes = $p->fetchAll(PDO::FETCH_ASSOC);

        foreach ($clientes as $c) {
            $sub_array[] = array(
                "id_orden" => $c["id_orden"],
                "propina" => $c["propina"],
                "fecha_final" => $c["fecha_final"],
                "nom_cliente" => $c["nom_cliente"],
                "observacion" => $c["observacion"],
                "mesera" => $c["mesera"],
            );
            $data["observaciones"] = $sub_array;
        }

        $sub_array = null;

        //Codigo para obtener las meseras populares
        $sql = "SELECT e.id_empleado,
        CONCAT(e.nombre, ' ', e.apellido) AS mesera,
        SUM(o.total * 0.1) AS suma_propinas
        FROM tb_orden AS o
        LEFT JOIN tb_empleados AS e ON o.id_mesero = e.id_empleado
        WHERE o.fecha_inicio >= ? AND o.fecha_final <= ? AND o.id_estado = ?
        GROUP BY e.id_empleado, mesera;";

        if ($idLocal != 3) {
            $sql .= " AND o.id_local = ?";
        }

        $p = $pdo->prepare($sql);

        $params = ($idLocal != 3) ? array($fechaInicial, $fechaFinal, 5, $idLocal) : array($fechaInicial, $fechaFinal, 5);

        $p->execute($params);
        $clientes = $p->fetchAll(PDO::FETCH_ASSOC);

        foreach ($clientes as $c) {
            $sub_array[] = array(
                "id_empleado" => $c["id_empleado"],
                "mesera" => $c["mesera"],
                "suma_propinas" => $c["suma_propinas"],
            );
            $data["meseras"] = $sub_array;
        }

        $sub_array = null;

        echo json_encode($data);
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Dashboard::getReporteria();
            break;
    }
}
