const LitadoLocales = httpVueLoader('./componentes/ListadoLocales.vue');
const LitadoMenus = httpVueLoader('./componentes/listadoMenus.vue');
const LitadoSubMenus = httpVueLoader('./componentes/listadoSubMenus.vue');

const EventBus = new Vue();

let categoriasList = new Vue({
    el: '#appCategorias',
    data: {
        tituloModulo: 'Listado Menús',
        descripcion: '',
        horaActual: '',
        tipoModal: '',
        tablaCategorias: '',
        tipoTabla: '',
        nombreCatalogo: '',
        nombreModal: '',
        idLocal: '',
        evento: '',
        idLocalSesion: '',
        tipoCategoria: '',
        idMenu: '',
        idSubMenu: ''
    },
    mounted: function () {
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();
        if (this.idLocalSesion != 3) {
            this.idLocal = $("#local").val();
        }
        this.evento.$on('cambiar-local', (nuevoValor) => {
            this.idLocal = nuevoValor
        });
        this.evento.$on('obtener-id-menu', (nuevoValor) => {
            this.idMenu = nuevoValor
        });
        this.evento.$on('obtener-id-subMenu', (nuevoValor) => {
            this.idSubMenu = nuevoValor
        });
        this.cargarTablaMenus(1);
        this.baseTables();
    },
    watch: {
        idLocal(nuevoValor, viejoValor) {
            this.evento.$emit('cambiar-menus', nuevoValor);
        },
    },
    components: {
        'listado-locales': LitadoLocales,
        'listado-menus': LitadoMenus,
        'listado-sub-menus': LitadoSubMenus,
    },
    computed: {
        camposCompletos() {
            if (this.tipoTabla == 1) {
                return this.descripcion.trim() !== '';
            } else if (this.tipoTabla == 2) {
                return this.descripcion.trim() !== '' && this.idMenu.trim() !== '';
            } else if (this.tipoTabla == 3) {
                return this.descripcion.trim() !== '' && this.idSubMenu.trim() !== '';
            }
        },
    },
    methods: {
        cargarTablaMenus: function (tipoTabla) {

            this.tipoTabla = tipoTabla;

            let thes = this;
            axios.get(`categorias/model/categoriasList.php`, {
                params: {
                    opcion: 1,
                    tipoTabla: tipoTabla
                }
            }).then(response => {
                console.log(response.data);
                this.tablaCategorias = response.data;

                if ($.fn.DataTable.isDataTable("#tblCatagorias")) {
                    $("#tblCatagorias").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaCategorias = $("#tblCatagorias").DataTable({
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
                            { "class": "text-center", mData: 'menu' },
                            {
                                "class": "text-center",
                                data: 'id',
                                render: function (data, type, row) {
                                    let nombre;
                                    if (tipoTabla == 1) {
                                        nombre = 'Sub Menús'
                                    } else if (tipoTabla == 2) {
                                        nombre = 'Comidas'

                                    } else if (tipoTabla == 3) {
                                        nombre = 'Insumos'
                                    }
                                    let encabezado = `
                                        <button class="btn btn-primary btn-xs getSubMenus" type="button" aria-haspopup="true" aria-expanded="false" data-id="${row.id}">
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
                                        return `<label class="switch">
                                        <input class="success" type="checkbox" checked data-id="${row.id}">
                                        <span class="slider round"></span>
                                      </label>`;
                                    } else {
                                        return `<label class="switch">
                                        <input class="danger" type="checkbox" data-id="${row.id}">
                                        <span class="slider round"></span>
                                      </label>`;
                                    }
                                },

                            },
                        ],
                        buttons: [
                            {
                                text: 'Nuevo <i class="fa-solid fa-square-plus"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    thes.datosModal()
                                    $("#setNuevaCategoria").modal("show")
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
            $('#tblCatagorias').on('click', '.getSubMenus', function () {
                let id = $(this).data('id');
                that.getCatalogo(id, that.tipoTabla);
            });

            $('#tblCatagorias').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setCatalogo(id, that.tipoTabla, 1);
                } else {
                    that.setCatalogo(id, that.tipoTabla, 2);
                }
            });
        },
        getCatalogo: function (id, tipoTabla) {
            this.cargarTablaCatalogos(id, tipoTabla)
            $("#getCatalogosModal").modal("show")
        },

        setCatalogo: function (id, tipoTabla, estado) {
            axios.get('categorias/model/categoriasList.php', {
                params: {
                    opcion: 3,
                    id: id,
                    tipoTabla: tipoTabla,
                    estado: estado,
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
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: response.data.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch((error) => {
                console.log(error);
            });
        },

        cargarTablaCatalogos: function (id, tipoTabla) {
            let thes = this;
            if (tipoTabla == 1) {
                this.nombreCatalogo = 'Sub Menús'
            } else if (tipoTabla == 2) {
                this.nombreCatalogo = 'Comidas'
            } else if (tipoTabla == 3) {
                this.nombreCatalogo = 'Insumos'
            }

            axios.get(`categorias/model/categoriasList.php`, {
                params: {
                    opcion: 2,
                    filtro: id,
                    tipoTabla: tipoTabla
                }
            }).then(response => {
                console.log(response.data);
                this.tablaCategorias = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblCatalogos")) {
                    $("#tblCatalogos").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaCategorias = $("#tblCatalogos").DataTable({
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
        datosModal: function () {
            if (this.tipoTabla == 1) {
                this.nombreModal = 'Nuevo Menú'
                this.tipoCategoria = 'Menú'
            } else if (this.tipoTabla == 2) {
                this.nombreModal = 'Nuevo Sub Menú'
                this.tipoCategoria = 'Sub Menú'
            } else if (this.tipoTabla == 3) {
                this.nombreModal = 'Nueva Comida'
                this.tipoCategoria = 'Comida'
            }
        },
        setNuevaCategoria: function () {
            Swal.fire({
                title: '¿Generar ' + this.nombreModal + '?',
                text: "Se agregara un " + this.nombreModal + " al Sistema!",
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
                    formData.append('opcion', 4);
                    formData.append('tipo', this.tipoTabla);
                    formData.append('descripcion', this.descripcion);
                    formData.append('local', this.idLocal);
                    if (this.tipoTabla == 2) {
                        formData.append('menu', this.idMenu);
                    } else if (this.tipoTabla == 3) {
                        formData.append('subMenu', this.idSubMenu);
                    }

                    // Realizar la solicitud POST al servidor
                    axios.post('./categorias/model/categoriasList.php', formData)
                        .then(response => {
                            console.log(response.data);
                            Swal.fire({
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            $("#setNuevaCategoria").modal("hide")
                            this.cargarTablaMenus(this.tipoTabla)
                            this.descripcion = ''
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        }
    },
});
