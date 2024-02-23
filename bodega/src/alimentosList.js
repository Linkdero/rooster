const EventBus = new Vue();

let bodegaList = new Vue({
    el: '#appAlimentos',
    data: {
        tituloModulo: 'Listado Alimentos',
    },
    components: {

    },
    mounted: function () {
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();
        this.cargarTablaBodega(1);
        this.baseTables();
    },
    computed: {
    },
    watch: {

    },
    methods: {
        cargarTablaBodega: function () {
            let thes = this;
            axios.get(`bodega/model/bodegaList.php`, {
                params: {
                    opcion: 1,
                    tipo: 2,
                    id: this.idLocalSesion
                }
            }).then(response => {
                console.log(response.data);
                if ($.fn.DataTable.isDataTable("#tblBodega")) {
                    $("#tblBodega").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaBodega = $("#tblBodega").DataTable({
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
                            emptyTable: "No hay solicitudes de Mennus para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando insumos, por favor espere</h3> "
                        },
                        "aoColumns": [{
                            "class": "text-center",
                            data: 'id',
                            render: function (data, type, row) {
                                let encabezado;
                                if (row.id_estado == 1) {
                                    encabezado = `
                                        <button class="btn btn-primary btn-xs equivalencia" type="button" aria-haspopup="true" aria-expanded="false" data-id="${data}">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    encabezado;
                                } else {
                                    encabezado = `
                                        <button class="btn btn-danger btn-xs" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                }
                                return encabezado;
                            },
                        },
                        {
                            "class": "text-center",
                            mData: 'medida'
                        },
                        {
                            "class": "text-center",
                            mData: 'nombre'
                        },
                        {
                            "class": "text-center",
                            data: 'precio',
                            render: function (data, type, row) {
                                let encabezado;
                                encabezado = `Q${data}`;

                                return encabezado;
                            },
                        },
                        {
                            "class": "text-center",
                            data: 'existencias',
                            render: function (data, type, row) {
                                let encabezado;
                                encabezado = `${data} U`;

                                return encabezado;
                            },
                        },
                        {
                            "class": "text-center",
                            data: 'id_estado',
                            render: function (data, type, row) {
                                if (data == 1) {
                                    return `<label class="switch">
                                            <input type="checkbox" checked data-id="${row.id}">
                                            <span class="slider round"></span>
                                        </label>`;
                                } else {
                                    return `<label class="switch">
                                            <input type="checkbox" data-id="${row.id}">
                                            <span class="slider round"></span>
                                        </label>`;
                                }
                            },
                        },
                        ],
                        buttons: [{
                            text: 'Nuevo <i class="fa-solid fa-square-plus"></i>',
                            className: 'bg-primary text-white btn-xs mx-1',
                            action: function (e, dt, node, config) {
                                $("#setNuevoInsumo").modal("show")
                                thes.tipoModal = 1
                                thes.actualizarInputs()
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
            $('#tblBodega').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setCatalogo(id, 1); // Checkbox marcado
                } else {
                    that.setCatalogo(id, 2); // Checkbox no marcado
                }
                setTimeout(() => {
                    that.cargarTablaBodega(1);
                }, "1000");
            });
            $('#tblBodega').on('click', '.equivalencia', function () {
                let id = $(this).data('id');
                that.idMateriaPrima = id
                $("#setNuevaEquivalencia").modal("show")

            });
        },
    },
});