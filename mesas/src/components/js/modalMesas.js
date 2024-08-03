
const DatosMesa = httpVueLoader('./datosMesa.vue');
const TipoSeleccion = httpVueLoader('./tipoSeleccion.vue');
const ListadoMateriasPrimas = httpVueLoader('../../../componentes/listadoMateriaPrima.vue');
const ListadoEquivalencias = httpVueLoader('../../../componentes/listadoEquivalencias.vue');
const ListadoEmpleados = httpVueLoader('../../../componentes/listadoEmpleados.vue');
const ListadoInsumos = httpVueLoader('../../../componentes/listadoInsumos.vue');
const ListadoComidas = httpVueLoader('../../../componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
const ListadoAlimentos = httpVueLoader('../../../componentes/listadoAlimentos.vue');
const ListadoCombos = httpVueLoader('../../../componentes/listadoCombos.vue');

module.exports = {
    props: ['tipo', 'modal', 'evento', 'mesa', 'tipo'], // Aquí defines el prop miProp

    data: function () {
        return {
            key: 0,
            nombreCliente: '',
            seleccionComidas: 0,
            idModal: '',
            validarEquivalencia: false,
            estadoEquivalencia: false,
            filasInsumos: [],
            descripcion: '',
            nitCliente: '',
            direccionCliente: '',
            idEmpleado: '',
            precio: '',
            progreso: 0,
            idLocal: 0,
            idMateriaPrima: '',
            equivalenciaSeleccionada: ''
        }
    },

    mounted() {
        this.idModal = this.$refs.idModal.id;
        this.evento.$on('iniciar-modal-mesas', () => {
            $("#setMesasModal").modal("show");
        });
        this.evento.$on('nombre-cliente', (valor) => {
            this.nombreCliente = valor
        });
        this.evento.$on('tipo-selección', (valor) => {
            this.seleccionComidas = valor
        });
        this.evento.$on('datos-mesa-seleccionada', (valorLocal,valorNroMesa) => {
            this.idLocal = valorLocal
            this.nroMesa = valorNroMesa
        });
        this.evento.$on('validar-equivalencia', (valor) => {
            this.validarEquivalencia = valor
            if (valor == false)
                this.estadoEquivalencia = false
        });
        this.evento.$on('id-materia-prima', (valor) => {
            this.idMateriaPrima = valor
            this.evento.$emit('cargar-equivalencias', valor);
        });
        this.evento.$on('precio-insumo', (valor) => {
            this.precio = valor
        });
        this.evento.$on('equivalencia-seleccionada', (valor) => {
            this.equivalenciaSeleccionada = valor
        });
        this.evento.$on('id-empleado', (valor) => {
            this.idEmpleado = valor
        });
    },
    watch: {
        seleccionComidas(valor) {
            if (valor == 2 || valor == 3) {
                this.validarEquivalencia = false
                this.estadoEquivalencia = false
            }
        }
    },
    computed: {
        camposCompletos4() {
            return (
                this.filasInsumos !== ''
            );
        },
        camposCompletos3() {
            return (
                this.descripcion !== '');
        },
        camposCompletos2() {
            return (
                this.nitCliente !== '' && this.direccionCliente !== '');
        },
        camposCompletos1() {
            return (
                this.filasInsumos !== '' &&
                this.descripcion !== '' &&
                this.idEmpleado !== ''
            );
        },
    },
    components: {
        'datos-mesa': DatosMesa,
        'tipo-seleccion': TipoSeleccion,
        'listado-materias-primas': ListadoMateriasPrimas,
        'listado-equivalencias': ListadoEquivalencias,
        'listado-empleados': ListadoEmpleados,
        'listado-comidas': ListadoComidas,
        'listado-insumos': ListadoInsumos,
        'listado-combos': ListadoCombos,
        'listado-alimentos': ListadoAlimentos,

    },
    methods: {
        agregarFila: function () {
            let idInsumo;
            let nombreInsumo;
            let precioInsumo;
            let insumoExistente
            // Obtiene los valores seleccionados y la cantidad
            if (this.seleccionComidas == 1) {
                idInsumo = $('#materiasPrimas').val();
                nombreInsumo = $('#materiasPrimas option:selected').text();
            } else if (this.seleccionComidas == 2) {
                idInsumo = $('#insumos').val();
                nombreInsumo = $('#insumos option:selected').text();
            } else if (this.seleccionComidas == 3) {
                idInsumo = $('#combos').val();
                nombreInsumo = $('#combos option:selected').text();
            } else if (this.seleccionComidas == 4) {
                idInsumo = $('#alimentos').val();
                nombreInsumo = $('#alimentos option:selected').text();
            }

            let cantidad = $('#cantidades').val();

            precioInsumo = $("#precio").val();
            let precioTotal = precioInsumo * cantidad;
            let idEquivalencia = 0;
            if (this.estadoEquivalencia) {
                nombreInsumo += ` - ${this.equivalenciaSeleccionada.nombre}`
                cantidad = this.equivalenciaSeleccionada.equivalencia
                precioInsumo = this.equivalenciaSeleccionada.precio
                precioTotal = this.equivalenciaSeleccionada.precio
                precioTotal = this.equivalenciaSeleccionada.precio
                idEquivalencia = this.equivalenciaSeleccionada.id
            }

            if (idInsumo == '' || idInsumo == null || nombreInsumo == '' || nombreInsumo == null || cantidad == '' || cantidad == null) {
                return;
            }

            if (this.tipoModal != 4) {
                // Verifica si el insumo ya está en la lista
                insumoExistente = this.filasInsumos.find(fila =>
                    fila.idInsumo === idInsumo &&
                    fila.tipoMenu === this.seleccionComidas &&
                    fila.equivalencia === this.estadoEquivalencia);

                // Si el insumo no está en la lista y se seleccionó una cantidad
                if ((!insumoExistente && idInsumo && cantidad || this.estadoEquivalencia)) {
                    // Agrega una nueva fila al arreglo de filasInsumos
                    this.filasInsumos.push({
                        idInsumo: idInsumo,
                        nombreInsumo: nombreInsumo,
                        cantidad: cantidad,
                        precioInsumo: precioInsumo,
                        precioTotal: precioTotal,
                        tipoMenu: this.seleccionComidas,
                        equivalencia: this.estadoEquivalencia,
                        idEquivalencia: idEquivalencia

                    });

                    $('#cantidades').val('');
                    console.log(this.filasInsumos)
                    this.progreso += 5; // Aumenta en un 10% cada vez que se agrega una fila

                    console.log(this.filasInsumos);
                } else if (insumoExistente) {
                    // Si el insumo ya está en la lista, muestra una alerta con SweetAlert
                    Swal.fire({
                        title: 'Insumo ya agregado',
                        text: 'Este insumo ya ha sido agregado a la lista.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } else if (this.tipoModal == 4) {
                let nombreMesera = $('#empleados option:selected').text();
                // Verifica si el insumo ya está en la lista
                let insumoExistente = this.tragoChicas.find(fila =>
                    parseInt(fila.id_materia_prima) === parseInt(idInsumo) &&
                    parseInt(fila.id_empleado) === parseInt(this.idEmpleado));
                console.log(insumoExistente)
                // Si el insumo no está en la lista y se seleccionó una cantidad
                if (!insumoExistente && idInsumo && cantidad && this.idEmpleado) {
                    // Agrega una nueva fila al arreglo de filasInsumos
                    this.tragoChicas.push({
                        id_materia_prima: idInsumo,
                        materia_prima: nombreInsumo,
                        cantidad: cantidad,
                        precio: precioInsumo,
                        id_empleado: this.idEmpleado,
                        nombre_mesera: nombreMesera,
                        correlativo: this.tragoChicas.length + 1,
                    });

                    $('#cantidades').val('');
                    console.log(this.tragoChicas)
                    this.progreso += 5; // Aumenta en un 10% cada vez que se agrega una fila

                    console.log(this.tragoChicas);
                } else if (insumoExistente) {
                    // Si el insumo ya está en la lista, muestra una alerta con SweetAlert
                    Swal.fire({
                        title: 'Insumo ya agregado',
                        text: 'Este insumo ya ha sido agregado a la lista.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }

        },
        eliminarFila(index) {
            // Elimina la fila en el índice especificado
            this.filasInsumos.splice(index, 1);
            this.progreso -= 5; // Aumenta en un 10% cada vez que se agrega una fila
        },
        generarOrden () {
            Swal.fire({
                title: '¿Desea iniciar una nueva orden?',
                text: `¡Se iniciara la orden con la mesa ${this.nroMesa}!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Generar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.get(`mesas/model/mesasList.php`, {
                        params: {
                            opcion: 4,
                            filasInsumos: this.filasInsumos,
                            descripcion: this.descripcion,
                            idMesa: this.mesa,
                            nombreCliente: this.nombreCliente,
                            idEmpleado: this.idEmpleado,
                            idLocal: this.idLocal
                        }
                    }).then(response => {
                        console.log(response.data);
                        if (response.data.id == 1) {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            $("#setMesasModal").modal("hide")
                            this.evento.$emit('reiniciar-valores');
                        } else if (response.data.id == 2) {
                            Swal.fire({
                                icon: 'error',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            return
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }).catch(error => {
                        console.error(error);
                    });

                }
            })
        },
    }
}