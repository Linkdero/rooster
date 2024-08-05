const LitadoLocales = httpVueLoader('../../../componentes/listadoLocales.vue');

module.exports = {
    props: ['evento', 'local'],

    data() {
        return {
            key: 0,
            idLocal: 0,
            descripcion: '',
            Toast: '',
        }
    },

    mounted() {
        this.Toast = Swal.mixin({
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
        this.evento.$on('cambiar-local', (nuevoValor) => {
            this.idLocal = nuevoValor
        });
    },
    watch: {

    },
    computed: {
        camposCompletos() {
            console.log('Local:', this.local);
            console.log('Descripción:', this.descripcion);
            console.log('ID Local:', this.idLocal);
            if (this.local == 3)
                return (this.descripcion != '' && this.idLocal != 0);
            else
                return (this.descripcion != '');
        },
    },
    components: {
        'listado-locales': LitadoLocales,
    },
    methods: {
        setNuevaMesa() {
            let local;

            if (this.local == 3)
                local = this.idLocal
            else
                local = this.local

            Swal.fire({
                title: '¿Generar Nueva Mesa?',
                text: "Se agregara una mesa al Sistema!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Generar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 6);
                    formData.append('descripcion', this.descripcion);
                    formData.append('id', local);
                    // Realizar la solicitud POST al servidor
                    axios.post('./mesas/model/mesasList.php', formData)
                        .then(response => {
                            console.log(response.data);
                            Swal.fire({
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.evento.$emit('reiniciar-valores');
                            $("#setNuevaMesa").modal("hide")
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        },
    }
}