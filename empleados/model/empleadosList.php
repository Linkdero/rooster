<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Empleados
{
    //Opcion 1
    static function getEmpleados()
    {
        // Parsear los parámetros
        $estado = isset($_GET["filtro"]) ? $_GET["filtro"] : null;
        $local = isset($_GET["local"]) ? $_GET["local"] : null;

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Construir la consulta SQL
        $sql = "SELECT
            id_empleado as id,
            CONCAT(em.nombre, ' ', em.apellido) as nombre,
            em.direccion,
            foto,
            em.id_estado,
            e.estado,
            l.descripcion as locales
            FROM tb_empleados as em
            LEFT JOIN tb_estado as e ON em.id_estado = e.id_estado
            LEFT JOIN tb_local as l ON em.id_local = l.id_local
        WHERE 1=1 ";

        $params = array();

        if ($estado && $estado != 0) {
            $sql .= " AND em.id_estado = ? ";
            $params[] = $estado;
        }

        if ($local && $local != 3) {
            $sql .= " AND em.id_local = ?";
            $params[] = $local;
        }

        // Ejecutar la consulta
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $empleados = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Transformar los resultados y devolver como JSON
        $data = array();
        foreach ($empleados as $empleado) {
            $sub_array = array(
                "id" => $empleado["id"],
                "nombre" => $empleado["nombre"],
                "foto" => $empleado["foto"],
                "id_estado" => $empleado["id_estado"],
                "estado" => $empleado["estado"],
                "locales" => $empleado["locales"],
                "direccion" => $empleado["direccion"],
            );
            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }


    static function setEmpleado()
    {
        // Obtener los datos de la solicitud POST
        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $direccion = $_POST["direccion"];
        $plaza = $_POST["plaza"];
        $local = $_POST["local"];
        $foto_base64 = $_POST["foto"]; // Cadena base64 de la imagen
        $tipoModal = $_POST["tipoModal"];
        $respuesta = '';
        try {
            $db = new Database();
            $pdo = $db->connect();

            if ($tipoModal == 1) {
                $sql = "INSERT INTO tb_empleados(nombre,apellido,direccion,foto,id_plaza,id_estado,id_local)
                VALUES (?,?,?,?,?,?,?)";
                $respuesta = 'Empleado Agregado';
            } else {
                $idEmpleado = $_POST["idEmpleado"];

                $sql = "UPDATE tb_empleados SET nombre = ?, apellido = ?, direccion = ?, foto = ?,
                id_plaza = ?, id_estado = ?, id_local = ? WHERE id_empleado = " . $idEmpleado . "";
                $respuesta = 'Empleado Actualizado';
            }


            $p = $pdo->prepare($sql);

            $p->execute(array($nombre, $apellido, $direccion, $foto_base64, $plaza, 1, $local));

            $pdo = null;
            echo json_encode(['msg' => $respuesta, 'id' => 1]);
        } catch (PDOException $e) {
            echo json_encode(['msg' => 'ERROR: ' . $e->getMessage()]);
        }
    }

    static function setDesactivarEmpleado()
    {
        // Obtener los datos de la solicitud POST
        $id = $_POST["id"];
        $estado = $_POST["estado"];
        $descripcion = '';
        if ($estado == 1) {
            $descripcion = '!Empleado Activado!';
        } else {
            $descripcion = '!Empleado Desactivado!';
        }
        try {
            $db = new Database();
            $pdo = $db->connect();

            $sql = "UPDATE tb_empleados SET id_estado = ? 
            WHERE id_empleado = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($estado, $id));

            $pdo = null;
            echo json_encode(['msg' => $descripcion, 'id' => 1]);
        } catch (PDOException $e) {
            echo json_encode(['msg' => 'ERROR: ' . $e->getMessage()]);
        }
    }

    static function getInformacionEmpleado()
    {
        $idEmpleado = $_GET["idEmpleado"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT e.id_empleado, e.nombre, e.apellido, e.direccion, e.foto, e.id_plaza,p.plaza, e.id_estado, e.id_local, l.descripcion
        FROM tb_empleados AS e
        LEFT OUTER JOIN tb_plaza AS p ON e.id_plaza = p.id_plaza
        LEFT OUTER JOIN tb_local AS l ON e.id_local = l.id_local

        WHERE id_empleado = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($idEmpleado));
        $empleado = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($empleado as $e) {
            $sub_array = array(
                "id_empleado" => $e["id_empleado"],
                "nombre" => $e["nombre"],
                "apellido" => $e["apellido"],
                "direccion" => $e["direccion"],
                "foto" => $e["foto"],
                "id_plaza" => $e["id_plaza"],
                "plaza" => $e["plaza"],
                "id_estado" => $e["id_estado"],
                "id_local" => $e["id_local"],
                "descripcion" => $e["descripcion"]
            );
        }

        echo json_encode($sub_array);
        return $sub_array;
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Empleados::getEmpleados();
            break;
        case 2:
            Empleados::setEmpleado();
            break;
        case 3:
            Empleados::setDesactivarEmpleado();
            break;

        case 4:
            Empleados::getInformacionEmpleado();
            break;
    }
}
