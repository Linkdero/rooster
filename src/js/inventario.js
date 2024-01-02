const EventBus = new Vue();

let salidas = new Vue({
    el: '#appInventario',

    data: {
        tituloModulo: 'Inventario General',
        idLocalSesion: '',
        idLocal: '',
        evento: '',
        tablaInventarioSalidas: '',
        horaInicio: '',
        horaFinal: '',
        tipoTabla: 1

    },
    mounted: function () {
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();
        if (this.idLocalSesion != 3) {
            this.idLocal = $("#local").val();
        }
        this.fechaHoy()
        this.cargarTablaInventarioSalidas();
        this.cargarTablaInventarioEntradas();
        this.cargarTablaInventarioMeseras();
        this.baseTables();
    },
    computed: {

    },

    methods: {
        fechaHoy: function () {
            var fecha = new Date(); //Fecha actual
            var mes = fecha.getMonth() + 1; //obteniendo mes
            var dia = fecha.getDate(); //obteniendo dia
            var ano = fecha.getFullYear(); //obteniendo año
            if (dia < 10) {
                dia = '0' + dia; //agrega cero si el menor de 10
            }
            if (mes < 10) {
                mes = '0' + mes //agrega cero si el menor de 10
            }

            let hora = fecha.getHours()
            let minuto = fecha.getMinutes();

            if (minuto < 10) {
                minuto = '0' + minuto //agrega cero si el menor de 10
            }

            if (hora < 10) {
                hora = '0' + hora //agrega cero si el menor de 10
            }

            let fechah = ano + "-" + mes + "-" + dia
            let horaH = hora + ':' + minuto
            let fechaHora = fechah + "T" + horaH
            this.horaFinal = fechaHora
            fechaHora = fechah + "T" + '00:00'
            this.horaInicio = fechaHora
        },
        cargarTablaInventarioSalidas(tipo) {
            if (this.horaFinal < this.horaInicio) {
                Swal.fire({
                    icon: 'error',
                    title: 'La fecha final no puede ser menor a la inicial',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            let thes = this;
            if (tipo === false || tipo === undefined) {
                tipo = 4;
            }

            axios.get(`inc/inventario.php`, {
                params: {
                    opcion: 1,
                    tipo: tipo,
                    local: this.idLocalSesion,
                    fechaInicial: this.horaInicio,
                    fechaFinal: this.horaFinal,
                }
            }).then(response => {
                console.log(response.data);
                this.tablaInventarioSalidas = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblSalidas")) {
                    $("#tblSalidas").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaInventarioSalidas = $("#tblSalidas").DataTable({
                        "ordering": true,
                        "pageLength": 10,
                        "bProcessing": true,
                        "lengthChange": true,
                        "paging": true,
                        "info": true,
                        select: false,
                        scrollX: true,
                        scrollY: '50vh',
                        language: {
                            emptyTable: "No hay solicitudes de Inventarios para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [{
                                "class": "text-center",
                                data: 'id_orden',
                                render: function (data, type, row) {
                                    let encabezado = `
                                        <button class="btn btn-success btn-xs disponible" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'fecha_final'
                            },
                            {
                                "class": "text-center",
                                data: 'id_tipo',
                                render: function (data, type, row) {
                                    let encabezado
                                    if (data == 1) {
                                        encabezado = `Materia Prima`;
                                    } else if (data == 2) {
                                        encabezado = `Insumo`;
                                    } else {
                                        encabezado = `Combo`;
                                    }

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'item_descripcion'
                            },
                            {
                                "class": "text-center",
                                data: 'cantidad',
                                render: function (data, type, row) {
                                    let encabezado = `${data} U`;

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                data: 'item_precio',
                                render: function (data, type, row) {
                                    data = data.toLocaleString('es-GT', {
                                        style: 'currency',
                                        currency: 'GTQ'
                                    });
                                    return data;
                                },
                            },
                            {
                                "class": "text-center",
                                data: 'total',
                                render: function (data, type, row) {
                                    data = data.toLocaleString('es-GT', {
                                        style: 'currency',
                                        currency: 'GTQ'
                                    });
                                    return data;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'descripcion'
                            },

                        ],
                        buttons: [{
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
                            },
                            {
                                extend: 'print',
                                text: 'Imprimir <i class="fa-solid fa-print"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                text: 'Recargar Datos <i class="fa-solid fa-sync"></i>',
                                className: 'bg-warning text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    let thes = this
                                    salidas.cargarTablaInventarioSalidas()
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
        cargarTablaInventarioEntradas(tipo) {
            if (this.horaFinal < this.horaInicio) {
                Swal.fire({
                    icon: 'error',
                    title: 'La fecha final no puede ser menor a la inicial',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            let thes = this;
            if (tipo === false || tipo === undefined) {
                tipo = 4;
            }

            axios.get(`inc/inventario.php`, {
                params: {
                    opcion: 2,
                    local: this.idLocalSesion,
                    fechaInicial: this.horaInicio,
                    fechaFinal: this.horaFinal,
                }
            }).then(response => {
                console.log(response.data);
                this.tablaInventarioSalidas = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblEntradas")) {
                    $("#tblEntradas").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaInventarioSalidas = $("#tblEntradas").DataTable({
                        "ordering": true,
                        "pageLength": 10,
                        "bProcessing": true,
                        "lengthChange": true,
                        "paging": true,
                        "info": true,
                        select: false,
                        scrollX: true,
                        scrollY: '50vh',
                        language: {
                            emptyTable: "No hay solicitudes de Inventarios para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [{
                                "class": "text-center",
                                data: 'id_materia_prima',
                                render: function (data, type, row) {
                                    let encabezado = `
                                        <button class="btn btn-success btn-xs disponible" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'fecha'
                            },
                            {
                                "class": "text-center",
                                mData: 'materia_prima'
                            },
                            {
                                "class": "text-center",
                                data: 'ingreso',
                                render: function (data, type, row) {
                                    let encabezado = `${data} U`;

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                data: 'precio',
                                render: function (data, type, row) {
                                    data = data.toLocaleString('es-GT', {
                                        style: 'currency',
                                        currency: 'GTQ'
                                    });
                                    return data;
                                },
                            },
                            {
                                "class": "text-center",
                                data: 'total',
                                render: function (data, type, row) {
                                    data = data.toLocaleString('es-GT', {
                                        style: 'currency',
                                        currency: 'GTQ'
                                    });
                                    return data;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'descripcion'
                            },

                        ],
                        buttons: [{
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
                            },
                            {
                                extend: 'print',
                                text: 'Imprimir <i class="fa-solid fa-print"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                text: 'Recargar Datos <i class="fa-solid fa-sync"></i>',
                                className: 'bg-warning text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    let thes = this
                                    salidas.cargarTablaInventarioEntradas()
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
        cargarTablaInventarioMeseras(tipo) {
            if (this.horaFinal < this.horaInicio) {
                Swal.fire({
                    icon: 'error',
                    title: 'La fecha final no puede ser menor a la inicial',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }

            let thes = this;
            if (tipo === false || tipo === undefined) {
                tipo = 4;
            }

            axios.get(`inc/inventario.php`, {
                params: {
                    opcion: 3,
                    local: this.idLocalSesion,
                    fechaInicial: this.horaInicio,
                    fechaFinal: this.horaFinal,
                }
            }).then(response => {
                console.log(response.data);
                this.tablaInventarioSalidas = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblMeseras")) {
                    $("#tblMeseras").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaInventarioSalidas = $("#tblMeseras").DataTable({
                        "ordering": true,
                        "pageLength": 10,
                        "bProcessing": true,
                        "lengthChange": true,
                        "paging": true,
                        "info": true,
                        select: false,
                        scrollX: true,
                        scrollY: '50vh',
                        language: {
                            emptyTable: "No hay solicitudes de Meseras para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [{
                                "class": "text-center",
                                data: 'id_orden',
                                render: function (data, type, row) {
                                    let encabezado = `
                                        <button class="btn btn-success btn-xs disponible" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;

                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'fecha_final'
                            },
                            {
                                "class": "text-center",
                                mData: 'mesera'
                            },
                            {
                                "class": "text-center",
                                data: 'propina',
                                render: function (data, type, row) {
                                    data = data.toLocaleString('es-GT', {
                                        style: 'currency',
                                        currency: 'GTQ'
                                    });
                                    return data;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'descripcion'
                            },

                        ],
                        buttons: [{
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
                            },
                            {
                                extend: 'print',
                                text: 'Imprimir <i class="fa-solid fa-print"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                text: 'Recargar Datos <i class="fa-solid fa-sync"></i>',
                                className: 'bg-warning text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    let thes = this
                                    salidas.cargarTablaInventarioMeseras()
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
        },
        cambiarTipoTabla: function (tipo) {
            this.tipoTabla = tipo
        },
        cambiarTabla: function () {
            if (this.tipoTabla == 1) {
                this.cargarTablaInventarioSalidas();
            } else if (this.tipoTabla == 2) {
                this.cargarTablaInventarioEntradas();
            } else if (this.tipoTabla == 3){
                this.cargarTablaInventarioMeseras()
            }
        }
    },
})