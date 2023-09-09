new Vue({
    el: '#login',

    data: {
        titulo: 'Iniciar Sesión',
        tableEventos: "",
        usuario: '',
        contrasena: '',
    },
    computed: {
        camposCompletos() {
            return this.usuario.trim() !== '' && this.contrasena.trim() !== '';
        },
    },
    //Asi generamos funciones en VUE
    methods: {
        validarLogin: function () {
            let username = this.usuario
            let password = this.contrasena

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

            axios.get(`inc/processLogin.php`,{
            params: {
                username: username,
                password:password
              }
            }).then(response => {
                console.log(response.data)
                if (response.data.id == 1){
                    
                    Toast.fire({
                        icon: 'success',
                        title: response.data.msg
                    });

                }else{
                      Toast.fire({
                        icon: 'error',
                        title: response.data.msg
                      })
                      return
                }
                console.log("Redireccionando...");
                window.location.href = 'index.php';

                })
                .catch(error => {
                    console.error(error);
                });

        },

    },
})