<!-- top navigation -->
<div class="top_nav">
  <div class="nav_menu">
    <div class="nav toggle">
      <a id="menu_toggle"><i class="fa fa-bars"></i></a>
    </div>
    <nav class="nav navbar-nav">
      <ul class=" navbar-right">
        <li class="nav-item dropdown open" style="padding-left: 15px;">
          <a href="javascript:;" class="user-profile dropdown-toggle" aria-haspopup="true" id="navbarDropdown"
            data-toggle="dropdown" aria-expanded="false">
            <img class="img-circle profile_img" src="<?php echo $_SESSION["imagen"] ?>">
          </a>
          <div class="dropdown-menu dropdown-usermenu pull-right" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="?ref=2"><i
                class="fa-sharp fa-solid fa-gear fa-spin pull-right"></i>Configurar</a>
            <?php if ($_SESSION["id_roll"] == 1) {
              echo '<a class="dropdown-item"  href="?ref=3"><i class="fa-solid fa-person-circle-plus pull-right"></i>Crear Usuario</a>';
            } ?>
            <a class="dropdown-item" href="logout.php"><i class="fa fa-sign-out pull-right"></i> Salir</a>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</div>