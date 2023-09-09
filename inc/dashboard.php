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

        $data = array(
            "conteo" => array(),
            "gananciasParticulares" => array()
        );

        $sql = "SELECT
        SUM(CASE WHEN id_placa = 1 THEN 1 ELSE 0 END) AS conteo_placa_1,
        SUM(CASE WHEN id_placa = 2 THEN 1 ELSE 0 END) AS conteo_placa_2,
        SUM(CASE WHEN id_placa = 3 THEN 1 ELSE 0 END) AS conteo_placa_3,
        SUM(CASE WHEN id_placa = 4 THEN 1 ELSE 0 END) AS conteo_placa_4
        FROM parqueo
        WHERE fecha_final >= ? AND fecha_final <= ?;";

        $p = $pdo->prepare($sql);
        $p->execute(array($fechaInicial, $fechaFinal));
        $conteo = $p->fetchAll(PDO::FETCH_ASSOC);

        foreach ($conteo as $c) {
            $data["conteo"][] = array(
                "conteo_placa_1" => $c["conteo_placa_1"] ?? 0,
                "conteo_placa_2" => $c["conteo_placa_2"] ?? 0,
                "conteo_placa_3" => $c["conteo_placa_3"] ?? 0,
                "conteo_placa_4" => $c["conteo_placa_4"] ?? 0,
            );

        }

        $sql = "SELECT
        id_parqueado,
        pla.id_placa,
        pla.nombre_placa,
        nro_placa,
        par.descripcion,
        fecha_inicio,
        fecha_final,
        TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_final) AS horas_diferencia,
        TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_final) % 60 AS minutos_diferencia,
        id_estado,
        est.nombre
        FROM parqueo as par
        LEFT JOIN placas as pla on par.id_placa = pla.id_placa
        LEFT JOIN estados as est on par.id_estado = est.id
        WHERE fecha_final >= ? AND fecha_final <= ?;";

        $p = $pdo->prepare($sql);
        $p->execute(array($fechaInicial, $fechaFinal));
        $totalPagar = $p->fetchAll(PDO::FETCH_ASSOC);

        $totalPlaca1 = 0;
        $totalPlaca2 = 0;
        $totalPlaca3 = 0;
        $totalPlaca4 = 0;

        foreach ($totalPagar as $tp) {
            $horas_diferencia = $tp["horas_diferencia"];
            $minutos_diferencia = $tp["minutos_diferencia"];

            if ($tp['id_placa'] == 4) {
                $total_pagar = $horas_diferencia * 5;

                if ($minutos_diferencia > 0) {
                    $total_pagar += 5;
                }

                $totalPlaca4 += $total_pagar;
            } else if ($tp['id_placa'] == 3) {
                $total_pagar = $horas_diferencia * 20;

                if ($minutos_diferencia > 0) {
                    $total_pagar += 10;
                }
                $totalPlaca3 += $total_pagar;

            } else if ($tp['id_placa'] == 2) {
                $total_pagar = $horas_diferencia * 10;

                if ($minutos_diferencia > 0) {
                    $total_pagar += 5;
                }
                $totalPlaca2 += $total_pagar;

            } else {
                $total_pagar = $horas_diferencia * 10;

                if ($minutos_diferencia > 0) {
                    $total_pagar += 5;
                }
                $totalPlaca1 += $total_pagar;

            }
        }

        $data["gananciasParticulares"][] = array(
            "total1" => $totalPlaca1,
            "total2" => $totalPlaca2,
            "total3" => $totalPlaca3,
            "total4" => $totalPlaca4
        );

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