<?php
include '../../../../inc/database.php';
date_default_timezone_set("America/Guatemala");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class DatosMesa
{
    //Opcion 1
    static function getDatosMesa()
    {
        $mesa = $_GET["mesa"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Construir la consulta SQL
        $sql = "SELECT nro_mesa, referencia, fecha_inicio, nom_cliente,id_local
                FROM tb_mesa AS m
                LEFT OUTER JOIN (SELECT id_orden, id_mesa, fecha_inicio
                    FROM tb_orden
                    WHERE id_estado = 4) AS o ON m.id_mesa = o.id_mesa
                LEFT OUTER JOIN (SELECT id_orden, nom_cliente
                    FROM tb_cliente) AS c ON o.id_orden = c.id_orden
                WHERE m.id_mesa = ?";

        $p = $pdo->prepare($sql);
        $p->execute([$mesa]);

        $datos = $p->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($datos[0]);
        return $datos;
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            DatosMesa::getDatosMesa();
            break;
    }
}
