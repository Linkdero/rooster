function actualizarEstado(id) {
    axios.get(`./usuarios/model/formularioUsuario.php`, {
        params: {
            opcion: 3,
            id: id,
            idUsuario: $("#idUsuario").val()
        }
    }).then(response => {
        console.log(response.data)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        if (response.data.id == 1) {
            Toast.fire({
                icon: 'success',
                title: response.data.msg
            });
            if (response.data.refresh == true) {
                window.location.href = 'logout.php';
            }
        } else {
            Toast.fire({
                icon: 'error',
                title: response.data.msg
            });
        }
    }).catch(error => {
        console.error(error);
    });
}

function actualizarRoll(id) {
    axios.get(`./usuarios/model/formularioUsuario.php`, {
        params: {
            opcion: 4,
            id: id,
            idUsuario: $("#idUsuario").val()
        }
    }).then(response => {
        console.log(response.data)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        if (response.data.id == 1) {
            Toast.fire({
                icon: 'success',
                title: response.data.msg
            });

            let enlace = document.getElementById("configuracion2");
            enlace.click();
            if (response.data.refresh == true) {
                window.location.href = 'logout.php';
            }
        } else {
            Toast.fire({
                icon: 'error',
                title: response.data.msg
            });
        }
    }).catch(error => {
        console.error(error);
    });
}