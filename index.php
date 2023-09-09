<?php
require 'main.php';
include_once 'styles.php';
?>

<div class="container body">
  <div class="main_container">
    <div>
      <?php
      include_once 'sidebar.php';
      include_once 'navbar.php';

      // Verificar si el índice "ref" está definido en $_GET
      if (isset($_GET["ref"])) {
        if ($_GET["ref"] == 1 || $_GET["ref"] == "" || $_GET["ref"] == null) {
          include_once 'dashboard.php';
        } else if ($_GET["ref"] == 2) {
          include_once 'mesas/views/mesasList.php';
        } else if ($_GET["ref"] == 3) {
          include_once 'usuarios/views/formularioUsuario.php';
        } else if ($_GET["ref"] == 4) {
          include_once 'configuracion/views/editarPerfil.php';
        }
      } else {
        // Si "ref" no está definido en la URL, muestra por defecto el dashboard
        include_once 'dashboard.php';
      }
      ?>
    </div>
    <?php include_once 'footer.php' ?>
  </div>
</div>
<?php
include_once 'scripts.php';
?>

</body>

</html>