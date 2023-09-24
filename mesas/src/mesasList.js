const ListadoComidas = httpVueLoader('./componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
import  EventBus  from '../../componentes/eventBus.js';

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
        precio: null,
        progreso: 0,
        selectComida: '',
        selectComida2: 0
    },
    mounted: function () {
        // Agrega un evento 'change' al select
        this.cargarTablaMesas();
        this.baseTables();
        EventBus.$on('cambiar-select', (nuevoValor) => {
            this.selectComida2 = nuevoValor;
        });
    },
    components: {
        'listado-comidas': ListadoComidas,
    },
    watch: {
        selectComida(newValue) {
            // Esta función se ejecutará cada vez que selectComida cambie
            this.getInsumos(this.selectComida);
        }
    },
    computed: {
        camposCompletos() {
            return this.nombreCliente.trim() !== '' && this.nitCliente.trim() !== '' && this.direccionCliente.trim() !== '';
        },
    },
    methods: {
        setMesa: function (id, estado) {
            // Obtener la hora actual en el formato HH:mm
            const now = new Date();
            const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            // Asignar la hora actual al modelo
            this.horaActual = formattedTime;

            this.tablaMesasData.forEach(mesa => {
                if (mesa.id_mesa == id) {
                    this.nroMesa = mesa.nro_mesa;
                    this.referenciaMesa = mesa.referencia;
                }
            });

            if (estado == 1) {
                $("#setMesasModal").modal("show")
                this.tipoModal = 1

            } else if (estado == 2) {
                $("#setMesasModal").modal("show")
                this.tipoModal = 2
            }

        },

        cargarTablaMesas: function (id) {
            let thes = this;
            if (id === false || id === undefined) {
                id = 1;
            }

            axios.get(`mesas/model/mesasList.php`, {
                params: {
                    opcion: 1,
                    filtro: id
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
                        "aoColumns": [
                            {
                                "class": "text-center",
                                data: 'nro_mesa',
                                render: function (data, type, row) {
                                    let encabezado;

                                    if (row.id_estado == 4) {
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
                            { "class": "text-center", mData: 'referencia' },
                            { "class": "text-center", mData: 'restaurante' },
                            {
                                "class": "text-center",
                                data: 'estado_mesa',
                                render: function (data, type, row) {
                                    if (data == 3) {
                                        return `<a href="#" class="badge badge-success text-white py-1" data-id="${row.id_mesa}"">${row.descripcion} <i class="fa-solid fa-check-to-slot mx-1"></i></a>`;
                                    } else {
                                        return `<a href="#" class="badge badge-danger text-white py-1"data-id="${row.id_mesa}" >${row.descripcion} <i class="fa-solid fa-street-view mx-1"></i></a>`;
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

            $('#tblmesaList').on('click', '.badge-success', function () {
                let id = $(this).data('id');
                that.setMesa(id, 1);
            });

            $('#tblmesaList').on('click', '.badge-danger', function () {
                let id = $(this).data('id');
                that.setMesa(id, 2);
            });
        },

        finalizarMesa: function (id) {
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

            Swal.fire({
                title: '¿Finalizar tiempo de parqueo?',
                text: "¡Se finalizara el tiempo del Vehículo!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, finalizar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    axios.get(`parqueo/model/parqueoList.php`, {
                        params: {
                            opcion: 3,
                            id: id
                        }
                    }).then(response => {
                        console.log(response.data)
                        if (response.data.id == 1) {

                            Toast.fire({
                                icon: 'success',
                                title: response.data.msg
                            });
                            this.tablaParqueo.clear().destroy();
                            this.cargarTablaMesas()
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: response.data.msg
                            })
                            return
                        }
                    })
                        .catch(error => {
                            console.error(error);
                        });

                }
            })

        },

        getInsumos: function (id) {
            axios.get(`mesas/model/mesasList.php`, {
                params: {
                    opcion: 3,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.insumos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#insumos').select2({
                    placeholder: 'Menú',
                    allowClear: true,
                    width: '100%',
                });
            }).catch(error => {
                console.error(error);
            });
        },

        agregarFila: function () {
            // Obtiene los valores seleccionados y la cantidad
            let idInsumo = $('#insumos').val();
            let nombreInsumo = $('#insumos option:selected').text();
            let cantidad = $('#cantidades').val();
            if (idInsumo == '' || idInsumo == null || nombreInsumo == '' || nombreInsumo == null || cantidad == '' || cantidad == null) {
                return;
            }
            let precioInsumo;

            for (let i = 0; i < this.insumos.length; i++) {
                if (idInsumo == this.insumos[i].id) {
                    precioInsumo = this.insumos[i].precio;
                    console.log('Precio del insumo: ' + precioInsumo);
                    break;
                }
            }

            let precioTotal = precioInsumo * cantidad;

            // Verifica si el insumo ya está en la lista
            let insumoExistente = this.filasInsumos.find(fila => fila.idInsumo === idInsumo);

            // Si el insumo no está en la lista y se seleccionó una cantidad
            if (!insumoExistente && idInsumo && cantidad) {
                // Agrega una nueva fila al arreglo de filasInsumos
                this.filasInsumos.push({
                    idInsumo: idInsumo,
                    nombreInsumo: nombreInsumo,
                    cantidad: cantidad,
                    precioInsumo: precioInsumo,
                    precioTotal: precioTotal
                });

                $('#cantidades').val('');
                console.log(this.filasInsumos)
                this.progreso += 10; // Aumenta en un 10% cada vez que se agrega una fila

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
        },
        actualizarPrecioTotal(index) {
            let fila = this.filasInsumos[index];
            fila.precioTotal = fila.precioInsumo * fila.cantidad;
        },

    }
});

$(document).on('click', '[id^="btnImprimir_"]', function () {
    var data = $(this).attr('id').split('_')[1];
    parqueoList.imprimirTicket(data);
});