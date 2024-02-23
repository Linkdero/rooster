<div class="col-md-3 left_col">
  <div class="left_col scroll-view">
    <div class="navbar nav_title" style="border: 0;">
      <a href="#" class="site_title"><i class="fa-solid fa-fork-knife mr-2"></i><span style="font-size: 20px;">Rooster Restaurant!</span></a>
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
    <br />
    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
      <div class="menu_section">
        <h3>Opciones Rapidas</h3>
        <ul class="nav side-menu">
          <li><a><i class="fa-duotone fa-chart-line"></i> Dashboard <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=1">Dashboard</a></li>
              <li><a href="?ref=4">Inventario</a></li>
            </ul>
          </li>
          <li><a><i class="fa-duotone fa-table-picnic"></i> Mesas <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=11">Listado Mesas</a></li>
              <li><a href="?ref=12">Listado Ordenes</a></li>
            </ul>
          </li>
          <li><a><i class="fa-sharp fa-solid fa-list"></i> Catalogos <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=21">Categorias</a></li>
              <li><a href="?ref=22">Medidas</a></li>
            </ul>
          </li>
          <li><a><i class="fa-sharp fa-solid fa-shop-lock"></i> Bodega <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=31">Materia Prima</a></li>
              <li><a href="?ref=32">Comidas</a></li>
            </ul>
          </li>
          <li><a><i class="fa-sharp fa-solid fa-burger-soda"></i> Insumos <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=41">Cubetazo</a></li>
              <li><a href="?ref=42">Combos</a></li>
            </ul>
          </li>
          <li><a><i class="fa-solid fa-users"></i> Empleados <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="?ref=51">Empleados</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <div class="sidebar-footer hidden-small">
      <a data-toggle="tooltip" data-placement="top" title="Ajustes">
        <i class="fa-duotone fa-gear fa-spin"></i>
      </a>
      <a data-toggle="tooltip" data-placement="top">
      </a>
      <a data-toggle="tooltip" data-placement="top">
      </a>
      <a data-toggle="tooltip" data-placement="top" title="Cerrar Sesión" href="logout.php">
        <i class="fa-solid fa-right-from-bracket"></i> </a>
    </div>
  </div>
</div>