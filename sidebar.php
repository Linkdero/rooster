<div class="col-md-3 left_col">
  <div class="left_col scroll-view">
    <div class="navbar nav_title" style="border: 0;">
      <a href="#" class="site_title"><i class="fa-solid fa-cars mr-2"></i><span style="font-size: 20px;">Morenita
          Mixqueña!</span></a>
    </div>

    <div class="clearfix"></div>
    <!-- menu profile quick info -->
    <div class="profile clearfix">
      <div class="profile_pic">
        <img class="img-circle profile_img" src="<?php echo $_SESSION["imagen"] ?>">
      </div>
      <div class="profile_info">
        <span>Bienvenido</span>
        <h2>
          <?php echo $_SESSION["nombre"] . ' ' . $_SESSION["apellido"] ?>
        </h2>
      </div>
    </div>
    <!-- /menu profile quick info -->
    <br />
    <!-- sidebar menu -->
    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
      <div class="menu_section">
        <h3>Opciones Rapidas</h3>
        <ul class="nav side-menu">
          <li><a><i class="fa fa-home"></i> Dashboard <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=1">Dashboard</a></li>
            </ul>
          </li>
          <li><a><i class="fa fa-edit"></i> Rooster <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=2">Listado Mesas</a></li>
              <li><a href="?ref=2">Bodegas</a></li>
            </ul>
          </li>
        </ul>
      </div>

    </div>
    <!-- /sidebar menu -->
    <!-- /menu footer buttons -->

    <div class="sidebar-footer hidden-small">
      <a data-toggle="tooltip" data-placement="top" title="Ajustes">
        <i class="fa-duotone fa-gear fa-spin"></i>
      </a>
      <a data-toggle="tooltip" data-placement="top" title="Pantalla Completa">
        <i class="fa-solid fa-expand"></i> </a>
      <a data-toggle="tooltip" data-placement="top" title="Lock">
        <i class="fa-solid fa-lock"></i> </a>
      <a data-toggle="tooltip" data-placement="top" title="Cerrar Sesión" href="logout.php">
        <i class="fa-solid fa-right-from-bracket"></i> </a>
    </div>
    <!-- /menu footer buttons -->
  </div>
</div>