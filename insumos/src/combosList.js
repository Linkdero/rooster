const ListadoInsumos = httpVueLoader('./componentes/listadoInsumos.vue'); // Asegúrate de proporcionar la ruta correcta
let combosList = new Vue({
    el: '#appCombos',
    data: {
        tituloModulo: 'Listado Combos',
        tablaCombos: '',
        nombreCombo: 'Nuevo Combo',
        progreso: 0,
        cantidades: 0,
        filasInsumos: [],
        cantidades: 0,
        descripcion: '',
        precio: 0,
        idModal: ''
    },
    components: {
        'listado-insumos': ListadoInsumos,
    },
    mounted: function () {
        this.idModal = this.$refs.idModal.id;
        this.cargarTablaCombos(1);
        this.baseTables();
    },
    computed: {
        camposCompletos() {
            return (
                this.precio !== '' &&
                this.descripcion !== '' &&
                this.filasInsumos !== ''
            );
        },
    },
    methods: {
        setNuevoCombo: function () {
            Swal.fire({
                title: '¿Generar Nuevo Combo?',
                text: "¡Se agregara un nuevo combo a la bodega!",
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
                            opcion: 6,
                            precio: parseFloat(this.precio),
                            filasInsumos: this.filasInsumos,
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
                            this.tablaCombos.clear().destroy();
                            this.cargarTablaCombos()
                            $("#setNuevoCombo").modal("hide")
                            this.precio = ''
                            this.descripcion = ''
                            this.filasInsumos = []
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
                }
            })
        },
        cargarTablaCombos: function () {

            let thes = this;
            axios.get(`insumos/model/combosList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data);
                if ($.fn.DataTable.isDataTable("#tblCombos")) {
                    $("#tblCombos").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaCombos = $("#tblCombos").DataTable({
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
                            emptyTable: "No hay solicitudes de Combos para mostrar",
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
                                    $("#setNuevoCombo").modal("show")
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
            $('#tblCombos').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setCatalogo(id, 1); // Checkbox marcado
                } else {
                    that.setCatalogo(id, 2); // Checkbox no marcado
                }
            });
        },
        agregarFila: function () {
            // Obtiene los valores seleccionados y la cantidad
            let idInsumo = $('#insumos').val();
            let nombreInsumo = $('#insumos option:selected').text();
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
    },
});
