<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Alimento
{
    //Opcion 1
    static function getAlimentos()
    {
        $local = $_GET["id"];
        $estado = $_GET["estado"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $tipo = $_GET["tipo"];
        if ($tipo == 1) {
            $sql = "SELECT id_alimento as id, alimento_nombre as nombre, precio_alimento as precio
                    FROM tb_alimento
                    WHERE id_estado = ? AND id_local = ?";
        } else {
            $sql = "SELECT id_alimento as id ,alimento_nombre as nombre, alimento_descripcion,precio_alimento as precio, id_estado
            FROM tb_alimento
            WHERE id_estado = ? ";
            if ($local != 3) {
                $sql .= " AND id_local = ?";
            }
        }

        $p = $pdo->prepare($sql);
        if ($tipo == 1) {
            $p->execute(array(1, $local));
        } else {
            if ($local != 3) {
                $p->execute(array($estado, $local));
            } else {
                $p->execute(array($estado));
            }
        }
        $alimentos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();

        foreach ($alimentos as $a) {
            $sub_array = [
                "id_alimento" => $a["id"],
                "alimento_nombre" => $a["nombre"],
                "precio_alimento" => $a["precio"],
            ];

            if ($tipo != 1) {
                $sub_array["alimento_descripcion"] = $a["alimento_descripcion"];
                $sub_array["id_estado"] = $a["id_estado"];
            }

            $data[] = $sub_array;
        }
        echo json_encode($data);
    }

    static function setNuevoAlimento()
    {
        $local = $_POST["local"];
        $nombre = $_POST["nombre"];
        $descripcion = $_POST["descripcion"];
        $precio = $_POST["precio"];

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "INSERT INTO tb_alimento(alimento_nombre, alimento_descripcion, precio_alimento, id_estado, id_local)
            VALUES (?,?,?,?,?)";

            $p = $pdo->prepare($sql);

            $p->execute(array($nombre, $descripcion, $precio, 1, $local));

            $respuesta = ['msg' => 'Ingreso Exitoso', 'id' => 1];
        } catch (PDOException $e) {
            $respuesta = array('msg' => 'ERROR', 'id' => $e);
            try {
                $pdo->rollBack();
            } catch (Exception $e2) {
                $respuesta = array('msg' => 'ERROR', 'id' => $e2);
            }
        }
        $pdo = null;
        echo json_encode($respuesta);
    }

    static function getAlimentoDetalle()
    {
        $id = $_GET["id"];

        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT id_alimento as id, alimento_nombre as nombre, precio_alimento as precio, alimento_descripcion as descripcion
                FROM tb_alimento
                WHERE id_alimento = ?";


        $p = $pdo->prepare($sql);
        $p->execute(array($id));

        $alimentos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();

        foreach ($alimentos as $a) {
            $data = [
                "id_alimento" => $a["id"],
                "alimento_nombre" => $a["nombre"],
                "precio_alimento" => $a["precio"],
                "alimento_descripcion" => $a["descripcion"],
            ];
        }
        echo json_encode($data);
    }

    static function setActualizarAlimento()
    {
        $local = $_POST["local"];
        $nombre = $_POST["nombre"];
        $descripcion = $_POST["descripcion"];
        $precio = $_POST["precio"];
        $idAlimento = $_POST["idAlimento"];

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "UPDATE tb_alimento
            SET alimento_nombre= ? ,alimento_descripcion= ?, precio_alimento= ?, id_local= ?
            WHERE id_alimento = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($nombre, $descripcion, $precio, $local, $idAlimento));

            $respuesta = ['msg' => '¡Actualización Exitosa!', 'id' => 1];
        } catch (PDOException $e) {
            $respuesta = array('msg' => 'ERROR', 'id' => $e);
            try {
                $pdo->rollBack();
            } catch (Exception $e2) {
                $respuesta = array('msg' => 'ERROR', 'id' => $e2);
            }
        }
        $pdo = null;
        echo json_encode($respuesta);
    }

    static function setEstadoAlimento()
    {
        $idAlimento = $_POST["idAlimento"];
        $estado = $_POST["estado"];

        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "UPDATE tb_alimento
            SET id_estado = ?
            WHERE id_alimento = ?";

            $p = $pdo->prepare($sql);
            $p->execute(array($estado, $idAlimento));

            $respuesta = ['msg' => '¡Actualización Exitosa!', 'id' => 1];
        } catch (PDOException $e) {
            $respuesta = array('msg' => 'ERROR', 'id' => $e);
            try {
                $pdo->rollBack();
            } catch (Exception $e2) {
                $respuesta = array('msg' => 'ERROR', 'id' => $e2);
            }
        }
        $pdo = null;
        echo json_encode($respuesta);
    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Alimento::getAlimentos();
            break;
        case 2:
            Alimento::setNuevoAlimento();
            break;
        case 3:
            Alimento::getAlimentoDetalle();
            break;
        case 4:
            Alimento::setActualizarAlimento();
            break;
        case 5:
            Alimento::setEstadoAlimento();
            break;
    }
}
