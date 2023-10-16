const ListadoComidas = httpVueLoader('./componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
const ListadoMateriasPrimas = httpVueLoader('./componentes/listadoMateriaPrima.vue');
const ListadoInsumos = httpVueLoader('./componentes/listadoInsumos.vue');
const ListadoCombos = httpVueLoader('./componentes/listadoCombos.vue');

const EventBus = new Vue();

let mesasList = new Vue({
    el: '#appOrdenes',
    data: {
        tituloModulo: 'Listado Ordenes',
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
        idOrden: '',
        validarNombre: true,
        horaInicial: '',
        horaFinal: '',
        ordenDetalle: [],
        datosCliente: [],
        idLocal: 0,

    },
    mounted: function () {
        this.idModal = this.$refs.idModal.id;
        this.evento = EventBus;
        this.idLocal = $("#local").val();
        this.obtenerHoras()
        this.cargarTablaOrdenes();
        this.baseTables();
    },
    components: {
        'listado-comidas': ListadoComidas,
        'listado-materias-primas': ListadoMateriasPrimas,
        'listado-insumos': ListadoInsumos,
        'listado-combos': ListadoCombos,
    },
    computed: {
        // camposCompletos1() {
        //     return (
        //         this.filasInsumos !== '' &&
        //         this.descripcion !== '' &&
        //         this.nombreCliente !== '');
        // },
    },
    watch: {
        horaInicial: function (nuevoValor, valorAnterior) {
            // Se ejecuta cuando horaInicial cambia
            this.cargarTablaOrdenes();
        },
        horaFinal: function (nuevoValor, valorAnterior) {
            // Se ejecuta cuando horaFinal cambia
            if (this.horaFinal < this.horaInicial) {
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

                Toast.fire({
                    icon: 'error',
                    title: 'Hora final mayor a la incial'
                });

                this.horaFinal = valorAnterior
            } else {
                this.cargarTablaOrdenes();
            }
        }
    },
    methods: {
        cargarTablaOrdenes: function (id) {
            let thes = this;
            if (id === false || id === undefined) {
                id = 1;
            }

            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 1,
                    filtro: id,
                    horaInicial: this.horaInicial.replace('T', ' ').slice(0, -1),
                    horaFinal: this.horaFinal.replace('T', ' ').slice(0, -1),
                    local: this.idLocal
                }
            }).then(response => {
                console.log(response.data);
                this.tablaMesasData = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblOrdenes")) {
                    $("#tblOrdenes").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaMesas = $("#tblOrdenes").DataTable({
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
                        "aoColumns": [
                            {
                                "class": "text-center",
                                data: 'id_orden',
                                render: function (data, type, row) {
                                    let encabezado;

                                    if (row.id_estado == 5) {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs detalle" type="button" aria-haspopup="true" aria-expanded="false" data-id="${data}">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                        encabezado;
                                    } else {
                                        encabezado = `
                                        <button class="btn btn-danger btn-xs detalle" type="button" aria-haspopup="true" aria-expanded="false" data-id="${data}">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    }
                                    return encabezado;
                                },
                            },
                            { "class": "text-center", mData: 'descripcion' },
                            { "class": "text-center", mData: 'nom_cliente' },
                            { "class": "text-center", mData: 'total' },
                            { "class": "text-center", mData: 'fecha_final' },
                            {
                                "class": "text-center",
                                data: 'id_estado',
                                render: function (data, type, row) {
                                    if (data == 5) {
                                        return `<a href="#" class="badge badge-success text-white py-1" data-id="${row.id_orden}">${row.estado} <i class="fa-solid fa-check-to-slot mx-1"></i></a>`;
                                    } else {
                                        return `<a href="#" class="badge badge-danger text-white py-1"data-id="${row.id_orden}" >${row.estado} <i class="fa-solid fa-street-view mx-1"></i></a>`;
                                    }
                                },

                            },
                        ],
                        buttons: [
                            {
                                text: 'Todas <i class="fa fa-server" aria-hidden="true"></i>',
                                className: 'bg-primary text-white btn-xs ',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaOrdenes()
                                }
                            },
                            {
                                text: 'En Proeso <i class="fa-solid fa-circle-xmark"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaOrdenes(4)
                                },
                            },
                            {
                                text: 'Finalizadas <i class="fa fa-check-circle"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaOrdenes(5)
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
                dom:
                    "<'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'f>>" +
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

            $('#tblOrdenes').on('click', '.badge-success', function () {
                let id = $(this).data('id');
                that.setMesa(id, 1);
                that.validarNombre = true
                that.nombreCliente = ''
                setTimeout(() => {
                    $('#tipoSeleccion').select2({
                        placeholder: 'Tipo Seleccion',
                        allowClear: true,
                        width: '100%',
                        dropdownParent: $('#' + that.idModal + ''),
                    });

                    $('#tipoSeleccion').on('change', (event) => {
                        // Obtiene el valor seleccionado
                        const valorSeleccionado = $(event.target).val();
                        that.seleccionComidas = valorSeleccionado;
                        // Imprime el nombre seleccionado
                        console.log("Nuevo valor:", valorSeleccionado);
                    });
                }, 100);
            });

            $('#tblOrdenes').on('click', '.detalle', function () {
                let id = $(this).data('id');
                console.log(id)
                $("#getOrdenDetalle").modal("show")
                that.idOrden = id
                that.getDetalleOrden(that.idOrden)
            });
        },
        obtenerHoras() {
            const now = new Date();

            // Hora inicial a las 0 horas
            const horaInicial = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

            // Hora final antes de la medianoche
            const horaFinal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

            // Formatear las fechas para datetime-local
            const formattedHoraInicial = `${horaInicial.getFullYear()}-${String(horaInicial.getMonth() + 1).padStart(2, '0')}-${String(horaInicial.getDate()).padStart(2, '0')}T${String(horaInicial.getHours()).padStart(2, '0')}:${String(horaInicial.getMinutes()).padStart(2, '0')}`;
            const formattedHoraFinal = `${horaFinal.getFullYear()}-${String(horaFinal.getMonth() + 1).padStart(2, '0')}-${String(horaFinal.getDate()).padStart(2, '0')}T${String(horaFinal.getHours()).padStart(2, '0')}:${String(horaFinal.getMinutes()).padStart(2, '0')}`;

            // Asignar los valores al modelo
            this.horaInicial = formattedHoraInicial;
            this.horaFinal = formattedHoraFinal;

            // Restringir las fechas a hoy
            const maxDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(23).padStart(2, '0')}:${String(59).padStart(2, '0')}`;
            document.getElementById('horaInicial').setAttribute('max', maxDate);
            document.getElementById('horaFinal').setAttribute('max', maxDate);
        },
        getDetalleOrden: function (id) {
            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 3,
                    id: id
                }
            }).then(response => {
                console.log(response.data);
                this.ordenDetalle = response.data

            }).catch(error => {
                console.error(error);
            });

            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 4,
                    id: id
                }
            }).then(response => {
                console.log(response.data);
                this.datosCliente = response.data[0]

            }).catch(error => {
                console.error(error);
            });
        }

    }
});

$(document).on('click', '[id^="btnImprimir_"]', function () {
    var data = $(this).attr('id').split('_')[1];
    parqueoList.imprimirTicket(data);
});