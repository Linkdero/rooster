<?php
include '../../inc/database.php';
date_default_timezone_set("America/Guatemala");

class Categoria
{
    //Opcion 1
    static function getMenus()
    {
        $tipoTabla = $_GET["tipoTabla"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if ($tipoTabla ==  1) {
            $sql = "SELECT m.id as id, m.menu as nombre, m.estado as estado,e.estado as descripcion
            FROM tb_menu as m
            LEFT JOIN tb_estado as e ON m.estado = e.id_estado";
        } else if ($tipoTabla ==  2) {
            $sql = "SELECT id_sub_menu as id, sub_menu as nombre, id_menu as idPadre, sm.estado as estado, e.estado as descripcion
            FROM tb_sub_menu as sm
            LEFT JOIN tb_estado as e ON sm.estado = e.id_estado";
        } else if ($tipoTabla ==  3) {
            $sql = "SELECT id_comida as id, comida as nombre, id_sub_menu as idPadre, c.estado as estado,e.estado as descripcion
            FROM tb_comida as c
            LEFT JOIN tb_estado as e ON c.estado = e.id_estado";
        }

        $p = $pdo->prepare($sql);

        $p->execute();

        $menu = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($menu as $m) {
            $sub_array = array(
                "id" => $m["id"],
                "menu" => $m["nombre"],
                "estado" => $m["estado"],
                "descripcion" => $m["descripcion"],
            );

            // Agregar el campo idPadre si está presente en la consulta
            if (isset($m["idPadre"])) {
                $sub_array["idPadre"] = $m["idPadre"];
            }

            $data[] = $sub_array;
        }

        echo json_encode($data);
        return $data;
    }
    //Opcion 2
    static function getCatalogo()
    {
        $filtro = $_GET["filtro"];
        $tipoTabla = $_GET["tipoTabla"];
        $db = new Database();
        $pdo = $db->connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        if ($tipoTabla == 1) {
            $sql = "SELECT sm.id_sub_menu as id, sm.sub_menu as nombre, sm.id_menu as idPadre, sm.estado, e.estado as descripcion
            FROM tb_sub_menu as sm 
            LEFT JOIN tb_estado as e ON sm.estado = e.id_estado
            WHERE sm.id_menu = ?";
        } else if ($tipoTabla == 2) {
            $sql = "SELECT c.id_comida as id, c.comida as nombre, c.id_sub_menu as idPadre, c.estado, e.estado as descripcion
            FROM tb_comida as c
            LEFT JOIN tb_estado as e ON c.estado = e.id_estado
            WHERE c.id_sub_menu = ?";
        } else if ($tipoTabla == 3) {
            $sql = "SELECT id_insumo as id, i.descripcion as nombre, id_comida as idPadre, i.id_estado as estado, e.estado as descripcion
            FROM tb_insumo as i
            LEFT JOIN tb_estado as e ON i.id_estado = e.id_estado
            WHERE id_comida = ?";
        }

        $p = $pdo->prepare($sql);

        $p->execute(array($filtro));

        $catalogos = $p->fetchAll(PDO::FETCH_ASSOC);
        $data = array();
        foreach ($catalogos as $c) {
            $sub_array = array(
                "id" => $c["id"],
                "nombre" => $c["nombre"],
                "idPadre" => $c["idPadre"],
                "descripcion" => $c["descripcion"],
                "estado" => $c["estado"],
            );
            $data[] = $sub_array;
        }
        echo json_encode($data);
        return $data;
    }

    //Opcion 3
    static function setCategorias()
    {
        $id = $_GET["id"];
        $tipoTabla = $_GET["tipoTabla"];
        $estado = $_GET["estado"];

        if ($estado == 1) {
            $titulo = 'Insumos Activados';
        } else {
            $titulo = 'Insumos Inhabilitados';
        }
        try {
            $db = new Database();
            $pdo = $db->connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->beginTransaction();
            if ($tipoTabla == 1) {
                $sql = "UPDATE tb_insumo
                SET id_estado = ?
                WHERE id_menu = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($estado, $id));

                $sql = "UPDATE tb_menu
                SET estado = ?
                WHERE id = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($estado, $id));

                $sql = "UPDATE tb_sub_menu
                SET estado = ?
                WHERE id_menu = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($estado, $id));

                $sql = "SELECT id_sub_menu
                FROM tb_sub_menu
                WHERE id_menu = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($id));
                $id_sub_menu = $p->fetchAll(PDO::FETCH_COLUMN);

                $sql = "UPDATE tb_comida
                SET estado= ?
                WHERE id_sub_menu = ?";
                $p = $pdo->prepare($sql);

                foreach ($id_sub_menu as $id_sub) {
                    $p->execute(array($estado, $id_sub));
                }
            } else if ($tipoTabla == 2) {
                $sql = "UPDATE tb_sub_menu
                SET estado=?
                WHERE id_sub_menu = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($estado, $id));

                $sql = "UPDATE tb_comida
                SET estado= ?
                WHERE id_sub_menu = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($estado, $id));

                $sql = "SELECT id_comida
                FROM tb_comida
                WHERE id_sub_menu = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($id));
                $id_comida = $p->fetchAll(PDO::FETCH_COLUMN);

                $sql = "UPDATE tb_insumo
                SET id_estado= ?
                WHERE id_comida = ?";
                $p = $pdo->prepare($sql);

                foreach ($id_comida as $id_com) {
                    $p->execute(array($estado, $id_com));
                }
            } else {
                $sql = "UPDATE tb_comida
                SET estado= ?
                WHERE id_comida = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($estado, $id));

                $sql = "SELECT id_comida
                FROM tb_comida
                WHERE id_comida = ?";
                $p = $pdo->prepare($sql);
                $p->execute(array($id));
                $id_comida = $p->fetchAll(PDO::FETCH_COLUMN);

                $sql = "UPDATE tb_insumo
                SET id_estado= ?
                WHERE id_comida = ?";
                $p = $pdo->prepare($sql);

                foreach ($id_comida as $id_com) {
                    $p->execute(array($estado, $id_com));
                }
            }
            $pdo->commit();

            $respuesta =  ['msg' => $titulo, 'id' => 1];
        } catch (PDOException $e) {
            // Si hay una excepción, realiza un rollback
            $pdo->rollBack();
            $respuesta = ['msg' => 'ERROR', 'id' => ['errorInfo' => $e->getMessage()]];
        } finally {
            // Asegúrate de cerrar la conexión al finalizar
            $pdo = null;
        }
        $pdo = null;
        echo json_encode($respuesta);
    }

    //Opcion 4
    static function setNuevaCategoria()
    {
        // Obtener los datos de la solicitud POST
        $tipo = $_POST["tipo"];
        $descripcion = $_POST["descripcion"];
        $local = $_POST["local"];

        if ($tipo == 2) {
            $menu = $_POST["menu"];
        } else if ($tipo == 3) {
            $subMenu = $_POST["subMenu"];
        }

        try {
            $db = new Database();
            $pdo = $db->connect();

            if ($tipo == 1) {
                $sql = "INSERT INTO tb_menu(menu, id_local, estado)
                VALUES (?,?,?)";

                $p = $pdo->prepare($sql);

                $p->execute(array($descripcion, $local, 1));

                echo json_encode(['msg' => 'Menú Agregado', 'id' => 1]);
            } else if ($tipo == 2) {
                $sql = "INSERT INTO tb_sub_menu(sub_menu, id_menu, estado) 
                VALUES (?,?,?)";

                $p = $pdo->prepare($sql);

                $p->execute(array($descripcion, $menu, 1));

                echo json_encode(['msg' => 'Sub Menú Agregado', 'id' => 1]);
            } else if ($tipo == 3) {
                $sql = "INSERT INTO tb_comida(comida, id_sub_menu, estado)
                    VALUES (?,?,?)";

                $p = $pdo->prepare($sql);

                $p->execute(array($descripcion, $subMenu, 1));

                echo json_encode(['msg' => 'Comida Agregada', 'id' => 1]);
            }
            $pdo = null;

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
            Categoria::getMenus();
            break;

        case 2:
            Categoria::getCatalogo();
            break;

        case 3:
            Categoria::setCategorias();
            break;

        case 4:
            Categoria::setNuevaCategoria();
    }
}
