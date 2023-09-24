const ListadoComidas = httpVueLoader('./componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
const ListadoMedidas = httpVueLoader('./componentes/listadoMedidas.vue');

let bodegaList = new Vue({
    el: '#appBodega',
    data: {
        tituloModulo: 'Listado Bodea',
        tablaBodega: '',
        nombreInsumos: 'Nuevo Insumo',
        insumo: '',
        medida: '',
        precio: '',
        existencia: '',
        descripcion: ''

    },
    components: {
        'listado-comidas': ListadoComidas,
        'listado-medidas': ListadoMedidas,
    },
    mounted: function () {
        this.cargarTablaBodega(1);
        this.baseTables();
    },
    computed: {
        camposCompletos() {
            return this.insumo.trim() !== '' && this.medida.trim() !== '' && this.precio.trim() !== '' && this.existencia.trim() !== '' && this.descripcion.trim() !== '';
        },
    },
    watch: {
        insumo(nuevoValor) {
            console.log('El valor del input de comidas ha cambiado:', nuevoValor);
        },
        medida(nuevoValor) {
            console.log('El valor del input de medidas ha cambiado:', nuevoValor);
        }
    },
    methods: {
        actualizarInputs: function () {
            this.insumo = $("#idSelectComidas").val();
            this.medida = $("#idSelectMedidas").val();
            this.$forceUpdate();
        },
        generarInsumo: function () {
            this.actualizarInputs()
            Swal.fire({
                title: '¿Generar Nuevo Insumo?',
                text: "¡Se agregara un nuevo insumo a la bodega!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, generar!',
                cancelmButtonText: 'Cancelar'

            }).then((result) => {
                if (result.isConfirmed) {
                    axios.get('bodega/model/bodegaList.php', {
                        params: {
                            opcion: 2,
                            comida: parseInt(this.insumo),
                            medida: parseInt(this.medida),
                            precio: parseFloat(this.precio),
                            existencia: parseInt(this.existencia),
                            descripcion: this.descripcion,
                        }
                    }).then((response) => {
                        console.log(response.data);
                        if (response.data.id == 1) {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })

                            this.tablaBodega.clear().destroy();
                            this.cargarTablaBodega()
                            $("#setNuevoInsumo").modal("hide")
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
        },
        cargarTablaBodega: function () {

            let thes = this;
            axios.get(`bodega/model/bodegaList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data);
                this.tablaMenus = response.data;

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
                            { "class": "text-center", mData: 'comida' },
                            { "class": "text-center", mData: 'medida' },
                            { "class": "text-center", mData: 'nombre' },
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
                                    $("#setNuevoInsumo").modal("show")
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
        },
    },
});
