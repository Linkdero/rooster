const ModalMesas = httpVueLoader('./mesas/src/components/modalMesas.vue');
const LitadoLocales = httpVueLoader('./componentes/listadoLocales.vue');
const ModalNuevaMesa = httpVueLoader('./mesas/src/components/modalNuevaMesa.vue');

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
        ordenDetalle: '',
        validarEquivalencia: false,
        estadoEquivalencia: false,
        idMateriaPrima: 0,
        equivalenciaSeleccionada: '',
        idAlimento: '',
        Toast: '',
        tragoChicas: '',
        idOrden: '',
        idMesaSeleccionada: '',
        key: 0,
        idTipo: 0
    },
    mounted() {
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();

        this.evento.$on('reiniciar-valores', () => {
            this.cargarTablaMesas();
            this.key++
        });

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
        this.cargarTablaMesas();
        this.baseTables();
    },
    components: {
        'modal-mesas': ModalMesas,
        'listado-locales': LitadoLocales,
        'modal-nueva-mesa': ModalNuevaMesa,

    },
    computed: {

    },
    methods: {

        cargarTablaMesas(id) {
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
                                        </button>
                                        
                                        <a href="#" class="badge badge-info text-white py-1 tragos" data-id="${row.id_mesa}" >Tragos<i class="fa-solid fa-glass ml-1"></i></a>`;
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

        baseTables() {
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
                that.getModalMesas(id, 1)

            });

            $('#tblmesaList').on('click', '.badge-danger', function () {
                let id = $(this).data('id');
                that.getModalMesas(id, 2)
            });

            $('#tblmesaList').on('click', '.ocupada', function () {
                let id = $(this).data('id');
                that.getModalMesas(id, 3)

            });

            $('#tblmesaList').on('click', '.tragos', function () {
                let id = $(this).data('id');
                that.getModalMesas(id, 4)
            });
        },
        getModalMesas(id, tipo) {
            this.idMesaSeleccionada = id;
            this.idTipo = tipo
            this.key++;

            setTimeout(() => {
                this.evento.$emit('iniciar-modal-mesas');
            }, 100);
        },

        modalNuevaMesa() {
            this.key++
            setTimeout(() => {
                this.evento.$emit('iniciar-modal-nueva-mesa');
            }, 100);
        },
    }
});