const ListadoComidas = httpVueLoader('./componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
const ListadoMateriasPrimas = httpVueLoader('./componentes/listadoMateriaPrima.vue');
const ListadoInsumos = httpVueLoader('./componentes/listadoInsumos.vue');
const ListadoCombos = httpVueLoader('./componentes/listadoCombos.vue');
const ListadoEmpleados = httpVueLoader('./componentes/listadoEmpleados.vue');
const LitadoLocales = httpVueLoader('./componentes/ListadoLocales.vue');

const EventBus = new Vue();

let mesasList = new Vue({
    el: '#appMesas',
    data: {
        tituloModulo: 'Listado Mesas',
        descripcion: '',
        tablaMesas: '',
        horaActual: '',
        nroMesa: '',
        referenciaMesa: '',
        nombreCliente: '',
        nitCliente: '',
        direccionCliente: '',
        tipoModal: '',
        comidas: '',
        insumos: '',
        filasInsumos: [],
        selectedInsumo: null,
        precio: null,
        progreso: 0,
        selectComida: '',
        selectComida2: 0,
        seleccionComidas: 0,
        idModal: '',
        idMenu: 0,
        evento: '',
        precio: '',
        idMesa: '',
        validarNombre: true,
        idLocal: '',
        idLocalSesion: '',
        idEmpleado: '',
        ordenDetalle: ''
    },
    mounted: function () {
        this.idModal = this.$refs.idModal.id;
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();
        if (this.idLocalSesion != 3) {
            this.idLocal = $("#local").val();
        }
        this.evento.$on('id-empleado', (nuevoValor) => {
            this.idEmpleado = nuevoValor
        });
        this.evento.$on('cambiar-local', (nuevoValor) => {
            this.idLocal = nuevoValor
        });
        this.cargarTablaMesas();
        this.baseTables();
    },
    components: {
        'listado-comidas': ListadoComidas,
        'listado-materias-primas': ListadoMateriasPrimas,
        'listado-insumos': ListadoInsumos,
        'listado-combos': ListadoCombos,
        'listado-empleados': ListadoEmpleados,
        'listado-locales': LitadoLocales,
    },
    watch: {
        selectComida(newValue) {
            // Esta función se ejecutará cada vez que selectComida cambie
            this.getInsumos(this.selectComida);
        },
        idLocal(nuevoValor) {
            this.evento.$emit('cambiar-materia-prima', nuevoValor);
            this.evento.$emit('cambiar-insumos', nuevoValor);
            this.evento.$emit('cambiar-empleado', nuevoValor);
            // this.evento.$emit('cambiar-materia-prima', nuevoValor);
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
                this.descripcion.trim() !== '');
        },
        camposCompletos2() {
            return (
                this.nitCliente.trim() !== '' && this.direccionCliente.trim() !== '');
        },
        camposCompletos1() {
            return (
                this.filasInsumos !== '' &&
                this.descripcion !== '' &&
                this.nombreCliente !== '' &&
                this.idEmpleado !== ''
            );
        },
    },
    methods: {
        setMesa: function (id, estado) {
            // Obtener la hora actual en el formato HH:mm
            const now = new Date();
            const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            // Asignar la hora actual al modelo
            this.horaActual = formattedTime;

            this.tablaMesasData.forEach(mesa => {
                if (mesa.id_mesa == id) {
                    this.nroMesa = mesa.nro_mesa;
                    this.referenciaMesa = mesa.referencia;
                    if (this.idLocalSesion == 3) {
                        this.idLocal = mesa.id_local
                    }
                }
            });
            if (estado == 1) {
                $("#setMesasModal").modal("show")
                this.tipoModal = 1
            } else if (estado == 2) {
                $("#setMesasModal").modal("show")
                this.tipoModal = 2
            } else if (estado == 3) {
                $("#setMesasModal").modal("show")
                this.tipoModal = 3
                axios.get(`mesas/model/ordenesList.php`, {
                    params: {
                        opcion: 5,
                        id: id
                    }
                }).then(response => {
                    console.log(response.data)
                    let idOrden = response.data
                    axios.get(`mesas/model/ordenesList.php`, {
                        params: {
                            opcion: 3,
                            id: idOrden
                        }
                    }).then(response => {
                        console.log(response.data)
                        this.ordenDetalle = response.data;
                    }).catch(error => {
                        console.error(error);
                    });

                }).catch(error => {
                    console.error(error);
                });

            }
            this.idMesa = id
        },

        cargarTablaMesas: function (id) {
            let thes = this;
            if (id === false || id === undefined) {
                id = 1;
            }

            axios.get(`mesas/model/mesasList.php`, {
                params: {
                    opcion: 1,
                    filtro: id,
                    local: this.idLocalSesion
                }
            }).then(response => {
                console.log(response.data);
                this.tablaMesasData = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblmesaList")) {
                    $("#tblmesaList").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaMesas = $("#tblmesaList").DataTable({
                        "ordering": false,
                        "pageLength": 10,
                        "bProcessing": true,
                        "lengthChange": true,
                        "paging": true,
                        "info": true,
                        select: false,
                        scrollX: true,
                        scrollY: '50vh',
                        language: {
                            emptyTable: "No hay solicitudes de Mesas para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [{
                                "class": "text-center",
                                data: 'nro_mesa',
                                render: function (data, type, row) {
                                    let encabezado;
                                    if (row.estado_mesa == 3) {
                                        encabezado = `
                                        <button class="btn btn-success btn-xs disponible" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                        encabezado;
                                    } else {
                                        encabezado = `
                                        <button class="btn btn-danger btn-xs ocupada" data-id="${data}" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    }
                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'referencia'
                            },
                            {
                                "class": "text-center",
                                mData: 'restaurante'
                            },
                            {
                                "class": "text-center",
                                data: 'estado_mesa',
                                render: function (data, type, row) {
                                    if (data == 3) {
                                        return `<a href="#" class="badge badge-success text-white py-1" data-id="${row.id_mesa}"">${row.estado} <i class="fa-solid fa-check-to-slot mx-1"></i></a>`;
                                    } else {
                                        return `<a href="#" class="badge badge-danger text-white py-1" data-id="${row.id_mesa}" >${row.estado} <i class="fa-solid fa-street-view mx-1"></i></a>`;
                                    }
                                },

                            },
                        ],
                        buttons: [{
                                text: 'Todas <i class="fa fa-server" aria-hidden="true"></i>',
                                className: 'bg-primary text-white btn-xs ',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaMesas()
                                }
                            },
                            {
                                text: 'Ocupadas <i class="fa-solid fa-circle-xmark"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaMesas(4)
                                },
                            },
                            {
                                text: 'Libres <i class="fa fa-check-circle"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaMesas(3)
                                }
                            },
                        ],
                        data: response.data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        baseTables: function () {
            let that = this;
            // DataTables Bootstrap integration
            this.bsDataTables = jQuery.fn.dataTable;
            // Set the defaults for DataTables init
            jQuery.extend(true, this.bsDataTables.defaults, {
                dom: "<'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                buttons: [
                    'csv', 'excel', 'pdf'
                ],
                renderer: 'bootstrap',
                oLanguage: {
                    sProcessing: "Procesando...",
                    sLengthMenu: "Mostrar _MENU_ registros",
                    sZeroRecords: "No se encontraron resultados",
                    sEmptyTable: "Ningún dato disponible en esta tabla",
                    sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                    sInfoPostFix: "",
                    sSearch: "Buscar:",
                    sUrl: "",
                    sInfoThousands: ",",
                    sLoadingRecords: "Cargando...",
                    oPaginate: {
                        sFirst: "Primero",
                        sLast: "Último",
                        sNext: "<i class='fa fa-chevron-right'></i>",
                        sPrevious: "<i class='fa fa-chevron-left'></i>"
                    },
                    oAria: {
                        sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                        sSortDescending: ": Activar para ordenar la columna de manera descendente"
                    }
                }
            });
            // Default class modification
            jQuery.extend(this.bsDataTables.ext.classes, {
                //sWrapper: " dt-bootstrap",
                sFilterInput: "form-control form-control-sm",
                sLengthSelect: "form-control form-control-sm"
            });
            // TableTools Bootstrap compatibility - Required TableTools 2.1+
            if (this.bsDataTables.TableTools) {
                // Set the classes that TableTools uses to something suitable for Bootstrap
                jQuery.extend(true, this.bsDataTables.TableTools.classes, {
                    "container": "DTTT btn-group",
                    "buttons": {
                        "normal": "btn btn-default",
                        "disabled": "disabled"
                    },
                    "collection": {
                        "container": "DTTT_dropdown dropdown-menu",
                        "buttons": {
                            "normal": "",
                            "disabled": "disabled"
                        }
                    },
                    "print": {
                        "info": "DTTT_print_info"
                    },
                    "select": {

                        "row": "active"
                    }
                });
                // Have the collection use a bootstrap compatible drop down
                jQuery.extend(true, this.bsDataTables.TableTools.DEFAULTS.oTags, {
                    "collection": {
                        "container": "ul",
                        "button": "li",
                        "liner": "a"
                    }
                });
            }
            $('#tblmesaList').on('click', '.badge-success', function () {
                let id = $(this).data('id');
                that.setMesa(id, 1);
                that.validarNombre = true
                that.nombreCliente = ''
                that.select2()
            });

            $('#tblmesaList').on('click', '.badge-danger', function () {
                let id = $(this).data('id');
                that.setMesa(id, 2);
                that.getNombreCliente(id)
            });

            $('#tblmesaList').on('click', '.ocupada', function () {
                let id = $(this).data('id');
                that.setMesa(id, 3);
                that.select2()
            });
        },
        getNombreCliente: function (id) {
            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 2,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.nombreCliente = response.data[0].nombre
                this.validarNombre = false
            }).catch(error => {
                console.error(error);
            });
        },

        finalizarMesa: function () {
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

            Swal.fire({
                title: `¿Finalizar orden de la mesa: #${this.nroMesa}`,
                text: "¡Se finalizara la orden y el consumo se dara por concluido!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, finalizar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    axios.get(`mesas/model/mesasList.php`, {
                            params: {
                                opcion: 5,
                                id: this.idMesa,
                                nit: this.nitCliente,
                                direccion: this.direccionCliente,
                                observacion: this.descripcion,
                            }
                        }).then(response => {
                            console.log(response.data)
                            if (response.data.id == 1) {

                                Toast.fire({
                                    icon: 'success',
                                    title: response.data.msg
                                });
                                this.cargarTablaMesas()
                                $("#setMesasModal").modal("hide")
                                this.nitCliente = ''
                                this.direccionCliente = ''
                                this.descripcion = ''
                            } else {
                                Toast.fire({
                                    icon: 'error',
                                    title: response.data.msg
                                })
                                return
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });

                }
            })

        },
        actualizarMesa: function () {
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

            Swal.fire({
                title: `Actualizar orden de la mesa: #${this.nroMesa}`,
                text: "¡Se actualizara la orden!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, actualizar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    var formData = new FormData();
                    formData.append('opcion', 7);
                    formData.append('filasInsumos', JSON.stringify(this.filasInsumos));
                    formData.append('mesa', this.idMesa);
                    axios.post('./mesas/model/mesasList.php', formData)
                        .then(response => {
                            console.log(response.data);
                            Swal.fire({
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            $("#setMesasModal").modal("hide")
                            this.filasInsumos = []
                            this.progreso = 0
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            })

        },
        agregarFila: function () {
            let idInsumo;
            let nombreInsumo;
            let precioInsumo;

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
            }
            let cantidad = $('#cantidades').val();

            if (idInsumo == '' || idInsumo == null || nombreInsumo == '' || nombreInsumo == null || cantidad == '' || cantidad == null) {
                return;
            }

            precioInsumo = $("#precio").val();
            let precioTotal = precioInsumo * cantidad;

            // Verifica si el insumo ya está en la lista
            let insumoExistente = this.filasInsumos.find(fila => fila.idInsumo === idInsumo && fila.tipoMenu === this.seleccionComidas);

            // Si el insumo no está en la lista y se seleccionó una cantidad
            if (!insumoExistente && idInsumo && cantidad) {
                // Agrega una nueva fila al arreglo de filasInsumos
                this.filasInsumos.push({
                    idInsumo: idInsumo,
                    nombreInsumo: nombreInsumo,
                    cantidad: cantidad,
                    precioInsumo: precioInsumo,
                    precioTotal: precioTotal,
                    tipoMenu: this.seleccionComidas
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
        },

        eliminarFila: function (index) {
            // Elimina la fila en el índice especificado
            this.filasInsumos.splice(index, 1);
            this.progreso -= 5; // Aumenta en un 10% cada vez que se agrega una fila
        },
        actualizarPrecioTotal(index) {
            let fila = this.filasInsumos[index];
            fila.precioTotal = fila.precioInsumo * fila.cantidad;
        },

        generarOrden: function () {
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
                            idMesa: this.idMesa,
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
                            this.cargarTablaMesas()
                            $("#setMesasModal").modal("hide")
                            this.descripcion = ''
                            this.filasInsumos = []
                            this.progreso = 0
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
        modalNuevaMesa: function () {
            $("#setNuevaMesa").modal("show")
        },
        setNuevaMedida: function () {
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
                    formData.append('id', this.idLocal);
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
                            $("#setNuevaMesa").modal("hide")
                            this.cargarTablaMesas()
                            this.descripcion = ''
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        },
        select2: function () {
            setTimeout(() => {
                $('#tipoSeleccion').select2({
                    placeholder: 'Tipo Seleccion',
                    allowClear: false,
                    width: '100%',
                    dropdownParent: $(`#${this.idModal}`),
                });

                $('#tipoSeleccion').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    this.seleccionComidas = valorSeleccionado;
                    // Imprime el nombre seleccionado
                    console.log("Nuevo valor:", valorSeleccionado);
                    setTimeout(() => {
                        this.evento.$emit('cambiar-materia-prima', this.idLocal);
                        this.evento.$emit('cambiar-insumos', this.idLocal);
                        this.evento.$emit('cambiar-empleado', this.idLocal);
                    }, 100);
                });
            }, 100);
        }
    }
});

$(document).on('click', '[id^="btnImprimir_"]', function () {
    var data = $(this).attr('id').split('_')[1];
    parqueoList.imprimirTicket(data);
});