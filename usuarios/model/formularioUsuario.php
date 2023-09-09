<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Usuario
{
    //Opcion 1
    static function getRolls()
    {
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT id, nombre
        FROM rolls
        WHERE id_estado = 1";

        $p = $pdo->prepare($sql);
        $p->execute();
        $rolls = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($rolls as $r) {
            $sub_array = array(
                "id" => $r["id"],
                "nombre" => $r["nombre"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    static function setUsuario()
    {
        // Obtener los datos de la solicitud POST
        $tipo = $_POST["tipo"];
        $usuario = $_POST["usuario"];
        $password = $_POST["password"];
        $roll = $_POST["roll"];
        $foto_base64 = $_POST["foto"]; // Cadena base64 de la imagen

        if (!empty($password)) {
            $password = md5($password);

        }

        try {
            $db = new Database();
            $pdo = $db->connect();

            if ($tipo == 3) {
                $sql = "INSERT INTO usuarios (usuario, id_roll, id_estado, password, imagen) VALUES (?, ?, ?, ?, ?)";

                $p = $pdo->prepare($sql);

                $p->execute(array($usuario, $roll, 1, $password, $foto_base64));

                $pdo = null;
                echo json_encode(['msg' => 'Usuario Agregado', 'id' => 1]);

            } else if ($tipo == 4) {
                $id = $_POST["id"];
                if (empty($password)) {
                    $sql = "UPDATE usuarios SET usuario = ?, id_roll = ?, id_estado = ?, imagen = ? WHERE id = ?";

                    $p = $pdo->prepare($sql);

                    $p->execute(array($usuario, $roll, 1, $foto_base64, $id));
                } else {
                    $sql = "UPDATE usuarios SET usuario = ?, id_roll = ?, id_estado = ?, password = ?, imagen = ? WHERE id = ?";

                    $p = $pdo->prepare($sql);

                    $p->execute(array($usuario, $roll, 1, $password, $foto_base64, $id));
                }
                $pdo = null;

                // Inicia la sesión o reanuda la sesión actual si existe
                session_start();

                // Elimina todas las variables de sesión (opcional, pero recomendado)
                session_unset();

                // Destruye la sesión actual
                session_destroy();
                echo json_encode(['msg' => 'Usuario Actualizado', 'id' => 1]);

                exit(); // Asegúrate de detener la ejecución del script después de la redirección
            }

        } catch (PDOException $e) {
            echo json_encode(['msg' => 'ERROR: ' . $e->getMessage()]);
        }


    }

    static function setEstado()
    {
        // Obtener los datos de la solicitud POST
        $idUsuario = $_GET["id"];
        $idUsuarioOperador = $_GET["idUsuario"];
        $estadoCambiante = "";
        $mensaje = "";
        $actualizar = false;
        try {
            $db = new Database();
            $pdo = $db->connect();

            $sql = "SELECT id_estado,usuario FROM usuarios WHERE id = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($idUsuario));
            $estado = $p->fetchAll(PDO::FETCH_ASSOC);
            $idEstado = $estado[0]["id_estado"];
            $usuario = $estado[0]["usuario"];
            if ($idEstado == 1) {
                $estadoCambiante = 2;
                $mensaje = $usuario . " desactivado";
            } else {
                $estadoCambiante = 1;
                $mensaje = $usuario . " activado";
            }
            $sql = "UPDATE usuarios
            SET id_estado = ?
            WHERE id = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($estadoCambiante, $idUsuario));
            $pdo = null;

            if ($idUsuario == $idUsuarioOperador) {
                if ($idUsuario == $idUsuarioOperador) {
                    $actualizar = true;
                }
            }
            echo json_encode(['msg' => $mensaje, 'id' => 1, 'refresh' => $actualizar]);

        } catch (PDOException $e) {
            echo json_encode(['msg' => 'ERROR: ' . $e->getMessage()]);
        }


    }

    static function setRoll()
    {
        // Obtener los datos de la solicitud POST
        $idUsuario = $_GET["id"];
        $idUsuarioOperador = $_GET["idUsuario"];
        $rollCambiante = "";
        $mensaje = "";
        $actualizar = false;
        try {
            $db = new Database();
            $pdo = $db->connect();

            $sql = "SELECT id_roll, usuario FROM usuarios WHERE id = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($idUsuario));
            $roll = $p->fetchAll(PDO::FETCH_ASSOC);
            $idRoll = $roll[0]["id_roll"];
            $usuario = $roll[0]["usuario"];
            if ($idRoll == 1) {
                $rollCambiante = 2;
                $mensaje = $usuario . " con permisos de operador";
            } else {
                $rollCambiante = 1;
                $mensaje = $usuario . " con permisos de administrador";
            }
            $sql = "UPDATE usuarios
            SET id_roll = ?
            WHERE id = ?";

            $p = $pdo->prepare($sql);

            $p->execute(array($rollCambiante, $idUsuario));
            $pdo = null;

            if ($idUsuario == $idUsuarioOperador) {
                if ($idUsuario == $idUsuarioOperador) {
                    $actualizar = true;
                }
            }
            echo json_encode(['msg' => $mensaje, 'id' => 1, 'refresh' => $actualizar]);

        } catch (PDOException $e) {
            echo json_encode(['msg' => 'ERROR: ' . $e->getMessage()]);
        }


    }
}

//case
if (isset($_POST['opcion']) || isset($_GET['opcion'])) {
    $opcion = (!empty($_POST['opcion'])) ? $_POST['opcion'] : $_GET['opcion'];

    switch ($opcion) {
        case 1:
            Usuario::getRolls();
            break;

        case 2:
            Usuario::setUsuario();
            break;

        case 3:
            Usuario::setEstado();
            break;

        case 4:
            Usuario::setRoll();
            break;
    }
}