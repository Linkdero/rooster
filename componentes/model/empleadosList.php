<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Empleado
{
    //Opcion 1
    static function getEmpleados()
    {
        $local = $_GET["local"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id_empleado as id, CONCAT(nombre, ' ', apellido) as nombre
        FROM tb_empleados
        WHERE id_estado = ? ";
        if ($local != 3) {
            $sql .= "AND id_local = ? ";
        }
        $p = $pdo->prepare($sql);

        if ($local != 3) {
            $p->execute(array(1, $local));
        } else {
            $p->execute(array(1));
        }
        $locales = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($locales as $l) {
            $sub_array = array(
                "id" => $l["id"],
                "nombre" => $l["nombre"],
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
            Empleado::getEmpleados();
            break;
    }
}
