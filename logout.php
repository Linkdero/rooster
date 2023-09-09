<?php
// Inicia la sesión o reanuda la sesión actual si existe
session_start();

// Elimina todas las variables de sesión (opcional, pero recomendado)
session_unset();

// Destruye la sesión actual
session_destroy();

// Redirecciona a la página de inicio de sesión o cualquier otra página que desees
header("Location: login.php");
exit();
?>