const ListadoComidas = httpVueLoader('./componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
const ListadoMateriasPrimas = httpVueLoader('./componentes/listadoMateriaPrima.vue');
const LitadoLocales = httpVueLoader('./componentes/ListadoLocales.vue');

const EventBus = new Vue();

let comidasList = new Vue({
    el: '#appComidas',
    data: {
        tituloModulo: 'Listado Cubetazos',
        tablaInsumos: '',
        nombreInsumos: 'Nuevo Cubetazo',
        insumo: '',
        materiaPrima: '',
        precio: '',
        descripcion: '',
        idModal: '',
        nombreMateriaPrima: '',
        cantidades: '',
        progreso: 0,
        filasInsumos: [],
        idModal: '',
        idLocal: '',
        evento: '',
        idLocalSesion: '',
    },
    components: {
        'listado-comidas': ListadoComidas,
        'listado-materias-primas': ListadoMateriasPrimas,
        'listado-locales': LitadoLocales,
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
        this.idModal = this.$refs.idModal.id;
        this.cargarTablaInsumos(1);
        this.baseTables();
    },
    computed: {
        camposCompletos() {
            console.log(this.insumo)
            console.log(this.precio)
            console.log(this.descripcion)
            console.log(this.filasInsumos)
            return (
                this.insumo !== '' &&
                this.precio !== '' &&
                this.descripcion !== '' &&
                this.filasInsumos !== ''
            );
        },
    },

    watch: {
        insumo(nuevoValor) {
            console.log('El valor del input de comidas ha cambiado:', nuevoValor);
        },
        materiaPrima(nuevoValor) {
            console.log('El valor del input de materia prima ha cambiado:', nuevoValor);
        },
        idLocal(nuevoValor) {
            this.evento.$emit('cambiar-insumos', nuevoValor);
            this.evento.$emit('cambiar-materia-prima', nuevoValor);
        }
    },
    methods: {
        actualizarInputs: function () {
            this.insumo = $("#idSelectComidas").val();
            this.materiaPrima = $("#idSelectMedidas").val();
            this.$forceUpdate();
        },
        setNuevoInsumo: function () {
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
                    axios.get('insumos/model/comidasList.php', {
                        params: {
                            opcion: 2,
                            comida: parseInt(this.insumo),
                            precio: parseFloat(this.precio),
                            filasInsumos: this.filasInsumos,
                            descripcion: this.descripcion,
                            local: this.idLocal
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
                            this.tablaInsumos.clear().destroy();
                            this.cargarTablaInsumos()
                            $("#setNuevoInsumo").modal("hide")
                            this.precio = ''
                            this.descripcion = ''
                            this.actualizarInputs()
                            this.filasInsumos = []
                            this.progreso = 0
                        } else {
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
                }
            })
        },
        cargarTablaInsumos: function (estado) {

            let thes = this;
            axios.get(`insumos/model/comidasList.php`, {
                params: {
                    opcion: 1,
                    id: this.idLocalSesion,
                    estado: estado
                }
            }).then(response => {
                console.log(response.data);
                if ($.fn.DataTable.isDataTable("#tblComidas")) {
                    $("#tblComidas").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaInsumos = $("#tblComidas").DataTable({
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
                                        <button class="btn btn-primary btn-xs" type="button" aria-haspopup="true" aria-expanded="false">
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
                                mData: 'comida'
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
                                text: 'Inhabilitada <i class="fa-sharp fa-solid fa-circle-xmark"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    thes.cargarTablaInsumos(2);
                                }
                            },
                            {
                                text: 'Activos <i class="fa-solid fa-check"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    thes.cargarTablaInsumos(1);
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
            $('#tblComidas').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setCatalogo(id, 1); // Checkbox marcado
                    setTimeout(() => {
                        that.cargarTablaInsumos(1);
                    }, "1000");
                } else {
                    that.setCatalogo(id, 2); // Checkbox no marcado
                    setTimeout(() => {
                        that.cargarTablaInsumos(2);
                    }, "1000");
                }
            });
        },

        setCatalogo: function (id, estado) {
            axios.get('insumos/model/comidasList.php', {
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
                } else {
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

        agregarFila: function () {
            // Obtiene los valores seleccionados y la cantidad
            let idInsumo = $('#materiasPrimas').val();
            let nombreInsumo = $('#materiasPrimas option:selected').text();
            let cantidad = this.cantidades;

            if (idInsumo == '' || idInsumo == null || nombreInsumo == '' || nombreInsumo == null || cantidad == '' || cantidad == null) {
                return;
            }

            // Verifica si el insumo ya está en la lista
            let insumoExistente = this.filasInsumos.find(fila => fila.idInsumo === idInsumo);

            // Si el insumo no está en la lista y se seleccionó una cantidad
            if (!insumoExistente && idInsumo && cantidad) {
                // Agrega una nueva fila al arreglo de filasInsumos
                this.filasInsumos.push({
                    idInsumo: idInsumo,
                    nombreInsumo: nombreInsumo,
                    cantidad: cantidad,
                });

                this.cantidades = ''
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
            console.log(this.filasInsumos);

        },

        actualizarCantidadTotal(index) {
            let fila = this.filasInsumos[index];
            if (fila && fila.cantidad && fila.precioInsumo) {
                fila.cantidadTotal = fila.cantidad * fila.precioInsumo;
            }
            console.log(this.filasInsumos);
        },
        modalNuevaComida() {
            if (this.idLocalSesion != 3) {
                this.evento.$emit('cambiar-insumos', this.idLocal);
                this.evento.$emit('cambiar-materia-prima', this.idLocal);
            }
            $("#setNuevoInsumo").modal("show")
            this.actualizarInputs()
        }
    },
});