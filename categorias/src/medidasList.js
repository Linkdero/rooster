let medidasList = new Vue({
    el: '#appMedidas',
    data: {
        tituloModulo: 'Listado Medidas',
        descripcion: '',
        horaActual: '',
        tipoModal: '',
        nombreCatalogo: ''
    },
    mounted: function () {
        this.cargarTablaMedidas();
        this.baseTables();
    },
    methods: {
        cargarTablaMedidas: function () {

            let thes = this;
            axios.get(`categorias/model/medidasList.php`, {
                params: {
                    opcion: 1,
                    tipo: 2
                }
            }).then(response => {
                console.log(response.data);

                if ($.fn.DataTable.isDataTable("#tblMedidas")) {
                    $("#tblMedidas").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaMedidas = $("#tblMedidas").DataTable({
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
                            emptyTable: "No hay solicitudes de Medidas para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [
                            {
                                "class": "text-center",
                                data: 'id',
                                render: function (data, type, row) {
                                    let encabezado;

                                    if (row.data == 1) {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                        encabezado;
                                    } else {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    }
                                    return encabezado;
                                },
                            },
                            { "class": "text-center", mData: 'nombre' },
                            {
                                "class": "text-center",
                                data: 'id',
                                render: function (data, type, row) {
                                    let nombre = 'Catalogos';
                                    let encabezado = `
                                        <button class="btn btn-primary btn-xs getCategorias" type="button" aria-haspopup="true" aria-expanded="false" data-id="${row.id}">
                                        ${nombre} <i class="fa-solid fa-rectangle-list"></i>
                                        </button>`;
                                    encabezado;

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                data: 'estado',
                                render: function (data, type, row) {
                                    if (data == 1) {
                                        return `<a href="#" class="badge badge-success text-white py-1" data-id="${row.id}"">${row.descripcion} <i class="fa-solid fa-check mx-1"></i></a>`;
                                    } else {
                                        return `<a href="#" class="badge badge-danger text-white py-1"data-id="${row.id}" >${row.descripcion} <i class="fa-solid fa-x mx-1"></i></a>`;
                                    }
                                },

                            },
                        ],
                        buttons: [
                            {
                                text: 'Nuevo <i class="fa-solid fa-square-plus"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaMesas();
                                }
                            },
                            {
                                extend: 'excel',
                                text: 'Excel <i class="fa-solid fa-file-excel"></i>',
                                className: 'bg-success text-white btn-xs mx-1',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'pdfHtml5',
                                text: 'PDF <i class="fa-solid fa-file-pdf"></i>',
                                className: 'bg-danger text-white btn-xs mx-1',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
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
            $('#tblMedidas').on('click', '.getCategorias', function () {
                let id = $(this).data('id');
                that.getCatalogo(id);
            });
        },

        getCatalogo: function (id) {
            this.nombreCatalogo = 'Listado Insumos'
            this.cargarTablaCatalogos(id)
            $("#getCatalogosModal").modal("show")
        },

        cargarTablaCatalogos: function (id) {
            axios.get(`categorias/model/medidasList.php`, {
                params: {
                    opcion: 2,
                    filtro: id,
                }
            }).then(response => {
                console.log(response.data);
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblCatalogos")) {
                    $("#tblCatalogos").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaCatalogo = $("#tblCatalogos").DataTable({
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
                            emptyTable: "No hay solicitudes de Catalogos para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [
                            {
                                "class": "text-center",
                                data: 'id',
                                render: function (data, type, row) {
                                    let encabezado;

                                    if (row.data == 1) {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                        encabezado;
                                    } else {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    }
                                    return encabezado;
                                },
                            },
                            { "class": "text-center", mData: 'nombre' },
                            {
                                "class": "text-center",
                                data: 'estado',
                                render: function (data, type, row) {
                                    if (data == 1) {
                                        return `<a href="#" class="badge badge-success text-white py-1" data-id="${row.id}"">${row.descripcion} <i class="fa-solid fa-check mx-1"></i></a>`;
                                    } else {
                                        return `<a href="#" class="badge badge-danger text-white py-1"data-id="${row.id}" >${row.descripcion} <i class="fa-solid fa-x mx-1"></i></a>`;
                                    }
                                },

                            },
                        ],

                        data: response.data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },
    },
});