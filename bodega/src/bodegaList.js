const ListadoMedidas = httpVueLoader('./componentes/listadoMedidas.vue');
const LitadoLocales = httpVueLoader('./componentes/ListadoLocales.vue');
const ListadoMateriasPrimas = httpVueLoader('./componentes/listadoMateriaPrima.vue');
// const ListadoPrecios = httpVueLoader('./componentes/listadoPrecios.vue');
const EventBus = new Vue();

let bodegaList = new Vue({
    el: '#appBodega',
    data: {
        tituloModulo: 'Listado Materia Prima',
        tablaBodega: '',
        nombreInsumos: 'Nueva Materia Prima',
        precio: '',
        medida: '',
        existencia: '',
        descripcion: '',
        idModal: '',
        idLocal: '',
        evento: '',
        idLocalSesion: '',
        tipoModal: 0,
        idMateriaPrima: ''
    },
    components: {
        'listado-medidas': ListadoMedidas,
        'listado-locales': LitadoLocales,
        'listado-materias-primas': ListadoMateriasPrimas,
    },
    mounted: function () {
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();
        if (this.idLocalSesion != 3) {
            this.idLocal = $("#local").val();
        }
        this.evento.$on('obtener-medida', (nuevoValor) => {
            this.medida = nuevoValor
        });
        this.evento.$on('cambiar-local', (nuevoValor) => {
            this.idLocal = nuevoValor
        });
        this.evento.$on('id-materia-prima', (nuevoValor) => {
            this.idMateriaPrima = nuevoValor
        });
        this.idModal = this.$refs.idModal.id;
        this.cargarTablaBodega(1);
        this.baseTables();
    },
    computed: {
        camposCompletos2() {
            return this.existencia.trim() !== '' && this.idMateriaPrima.trim() !== '';
        },
        camposCompletos() {
            return this.precio.trim() !== '' && this.medida.trim() !== '' && this.precio.trim() !== '' && this.existencia.trim() !== '' && this.descripcion.trim() !== '';
        },
    },
    watch: {
        precio(nuevoValor) {
            console.log('El valor del input de precios ha cambiado:', nuevoValor);
        },
        medida(nuevoValor) {
            console.log('El valor del input de medidas ha cambiado:', nuevoValor);
        },
        idLocal(nuevoValor) {
            this.evento.$emit('cambiar-materia-prima', nuevoValor);
            // this.evento.$emit('cambiar-materia-prima', nuevoValor);
        }
    },
    methods: {
        actualizarInputs: function () {
            this.medida = $("#idSelectMedidas").val();
            this.$forceUpdate();
        },
        generarInsumo: function () {
            Swal.fire({
                title: '¿Generar Nueva Materia Prima?',
                text: "¡Se agregara un nuevo insumo a la bodega!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, generar!',
                cancelmButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 2);
                    formData.append('tipo', this.tipoTabla);
                    formData.append('descripcion', this.descripcion);
                    formData.append('local', this.idLocal);
                    formData.append('existencia', this.existencia);
                    formData.append('precio', this.precio);
                    formData.append('medida', this.medida);

                    // Realizar la solicitud POST al servidor
                    axios.post('./bodega/model/bodegaList.php', formData)
                        .then(response => {
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
                                this.precio = ''
                                this.existencia = ''
                                this.descripcion = ''
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        },
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
                        buttons: [
                            {
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
            $('#tblBodega').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setCatalogo(id, 1); // Checkbox marcado
                } else {
                    that.setCatalogo(id, 2); // Checkbox no marcado
                }
            });
        },

        setCatalogo: function (id, estado) {
            axios.get('bodega/model/bodegaList.php', {
                params: {
                    opcion: 3,
                    id: id,
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
        modalNuevoIngreso: function () {
            $("#setNuevoInsumo").modal("show")
            this.tipoModal = 2
            setTimeout(() => {
                this.evento.$emit('cambiar-materia-prima', this.idLocal);
            }, 100);
        },
        ingresarBodega: function () {
            let nombreInsumo = $("#materiasPrimas").text();

            Swal.fire({
                title: `¿Agregar ingreso de: ${nombreInsumo}?`,
                text: `Se agregaran ${this.existencia}U a la bodega `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Agregar!',
                cancelmButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 4);
                    formData.append('existencia', this.existencia);
                    formData.append('id', this.idMateriaPrima);

                    // Realizar la solicitud POST al servidor
                    axios.post('./bodega/model/bodegaList.php', formData)
                        .then(response => {
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
                                this.existencia = ''
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        }
    },
});
