<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Equivalencia
{
    //Opcion 1
    static function geEquivalencias()
    {
        $materiaPrima = $_GET["materiaPrima"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id_equivalencia as id,m.medida as nombre, equivalencia, precio
        FROM tb_materia_prima_equivalencia as mpe
        LEFT JOIN tb_medida as m on mpe.id_medida = m.id_medida
        WHERE mpe.id_materia_prima = ? ";

        $p = $pdo->prepare($sql);
        $p->execute(array($materiaPrima));

        $equivalencias = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($equivalencias as $e) {
            $sub_array = array(
                "id" => $e["id"],
                "nombre" => $e["nombre"],
                "equivalencia" => $e["equivalencia"],
                "precio" => $e["precio"],
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
            Equivalencia::geEquivalencias();
            break;
    }
}
