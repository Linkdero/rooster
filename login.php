<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (isset($_SESSION['id'])) {
  // El usuario no ha iniciado sesión, redirigir al formulario de inicio de sesión
  header("Location: index.php");
  exit(); // Asegurarse de que el script se detenga después de redireccionar
}

include_once 'src.php'; ?>

<body class="login">
  <div>
    <a class="hiddenanchor" id="signup"></a>
    <a class="hiddenanchor" id="signin"></a>

    <div class="login_wrapper" id="login">
      <div class="animate form login_form">
        <section class="login_content">
          <form>
            <h1>{{titulo}} <i class="fa-solid fa-user-shield"></i></h1>
            <div>
              <input v-model="usuario" type="text" class="form-control" placeholder="Usuario" required />
            </div>
            <div>
              <input v-model="contrasena" type="password" class="form-control" placeholder="Contraseña" required />
            </div>
            <div>
              <button class="btn btn-primary btn-xs" :disabled="!camposCompletos" @click="validarLogin()"
                style="cursor:pointer;">Iniciar Sesión <i class="fa-solid fa-right-to-bracket"></i></button>
            </div>

            <div class="clearfix"></div>

            <div class="separator">
              <p class="change_link">¿Olvidaste la Contraseña?
                <a href="#" class="to_register"> Llama a Informatica </a>
              </p>

              <br />

              <div>
                <h1><i class="fa-solid fa-turkey"></i> Bienvenido a Rooster´s!</h1>
                <p>©2023 Todos los derechos del sistema reservados al Restaurante Rooster´s!
                </p>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
</body>

</html>

<script src="src/js/validarLogin.js"> </script>