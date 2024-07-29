const ListadoComidas = httpVueLoader('./componentes/listadoComidas.vue'); // Asegúrate de proporcionar la ruta correcta
const ListadoMateriasPrimas = httpVueLoader('./componentes/listadoMateriaPrima.vue');
const ListadoInsumos = httpVueLoader('./componentes/listadoInsumos.vue');
const ListadoCombos = httpVueLoader('./componentes/listadoCombos.vue');

const EventBus = new Vue();

let ordenesList = new Vue({
    el: '#appOrdenes',
    data: {
        tituloModulo: 'Listado Ordenes',
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
        selectComida2: 0,
        seleccionComidas: 0,
        idModal: '',
        idMenu: 0,
        evento: '',
        precio: '',
        idOrden: '',
        validarNombre: true,
        horaInicial: '',
        horaFinal: '',
        ordenDetalle: [],
        datosCliente: [],
        idLocal: 0,
        idLocalSesion: '',
        totalConsumido: 0,
        propina: 0,
        totalFinal: 0,
        totalNeto: 0,
        tragoChicas: '',
        totalTragos: '',
        validarPropina: ''
    },
    mounted: function () {
        this.idModal = this.$refs.idModal.id;
        this.evento = EventBus;
        this.idLocalSesion = $("#local").val();
        if (this.idLocalSesion != 3) {
            this.idLocal = $("#local").val();
        }
        this.obtenerHoras()
        this.cargarTablaOrdenes();
        this.baseTables();
    },
    components: {
        'listado-comidas': ListadoComidas,
        'listado-materias-primas': ListadoMateriasPrimas,
        'listado-insumos': ListadoInsumos,
        'listado-combos': ListadoCombos,
    },
    computed: {
        // camposCompletos1() {
        //     return (
        //         this.filasInsumos !== '' &&
        //         this.descripcion !== '' &&
        //         this.nombreCliente !== '');
        // },
    },
    watch: {
        horaInicial: function (nuevoValor, valorAnterior) {
            // Se ejecuta cuando horaInicial cambia
            this.cargarTablaOrdenes();
        },
        horaFinal: function (nuevoValor, valorAnterior) {
            // Se ejecuta cuando horaFinal cambia
            if (this.horaFinal < this.horaInicial) {
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

                Toast.fire({
                    icon: 'error',
                    title: 'Hora final mayor a la incial'
                });

                this.horaFinal = valorAnterior
            } else {
                this.cargarTablaOrdenes();
            }
        }
    },
    methods: {
        cargarTablaOrdenes: function (id) {
            let thes = this;
            if (id === false || id === undefined) {
                id = 1;
            }
            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 1,
                    filtro: id,
                    horaInicial: this.horaInicial.replace('T', ' ').slice(0, -1),
                    horaFinal: this.horaFinal.replace('T', ' ').slice(0, -1),
                    local: this.idLocalSesion
                }
            }).then(response => {
                console.log(response.data);
                this.tablaMesasData = response.data;
                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblOrdenes")) {
                    $("#tblOrdenes").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaMesas = $("#tblOrdenes").DataTable({
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
                                data: 'id_orden',
                                render: function (data, type, row) {
                                    let encabezado;

                                    if (row.id_estado == 5) {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs detalle" type="button" aria-haspopup="true" aria-expanded="false" data-id="${data}">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                        encabezado;
                                    } else {
                                        encabezado = `
                                        <button class="btn btn-danger btn-xs detalle" type="button" aria-haspopup="true" aria-expanded="false" data-id="${data}">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    }
                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'descripcion'
                            },
                            {
                                "class": "text-center",
                                mData: 'nom_cliente'
                            },
                            {
                                "class": "text-center",
                                data: 'total',
                                render: function (data, type, row) {
                                    let propina = data * 0.15;
                                    let final = parseInt(data) + parseInt(propina);
                                    return `${final.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })}`;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'fecha_final'
                            },
                            {
                                "class": "text-center",
                                data: 'id_estado',
                                render: function (data, type, row) {
                                    if (data == 5) {
                                        return `<a href="#" class="badge badge-success text-white py-1" data-id="${row.id_orden}">${row.estado} <i class="fa-solid fa-check-to-slot mx-1"></i></a>`;
                                    } else {
                                        return `<a href="#" class="badge badge-danger text-white py-1"data-id="${row.id_orden}" >${row.estado} <i class="fa-solid fa-street-view mx-1"></i></a>`;
                                    }
                                },

                            },
                        ],
                        buttons: [{
                                text: 'Todas <i class="fa fa-server" aria-hidden="true"></i>',
                                className: 'bg-primary text-white btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaOrdenes()
                                }
                            },
                            {
                                text: 'En Proceso <i class="fa-solid fa-circle-xmark"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaOrdenes(4)
                                },
                            },
                            {
                                text: 'Finalizadas <i class="fa fa-check-circle"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.tablaMesas.clear().destroy();
                                    thes.cargarTablaOrdenes(5)
                                }
                            },
                            {
                                extend: 'excel',
                                text: 'Excel <i class="fa-solid fa-file-excel"></i>',
                                className: 'bg-success text-white btn-xs',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'pdfHtml5',
                                text: 'PDF <i class="fa-solid fa-file-pdf"></i>',
                                className: 'bg-danger text-white btn-xs',
                                exportOptions: {
                                    columns: ':visible'
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

            $('#tblOrdenes').on('click', '.badge-success', function () {
                let id = $(this).data('id');
                that.setMesa(id, 1);
                that.validarNombre = true
                that.nombreCliente = ''
                setTimeout(() => {
                    $('#tipoSeleccion').select2({
                        placeholder: 'Tipo Seleccion',
                        allowClear: true,
                        width: '100%',
                        dropdownParent: $('#' + that.idModal + ''),
                    });

                    $('#tipoSeleccion').on('change', (event) => {
                        // Obtiene el valor seleccionado
                        const valorSeleccionado = $(event.target).val();
                        that.seleccionComidas = valorSeleccionado;
                        // Imprime el nombre seleccionado
                        console.log("Nuevo valor:", valorSeleccionado);
                    });
                }, 100);
            });

            $('#tblOrdenes').on('click', '.detalle', function () {
                let id = $(this).data('id');
                console.log(id)
                that.idOrden = id
                that.getDetalleOrden(that.idOrden)
                $("#getOrdenDetalle").modal("show")
            });
        },
        obtenerHoras() {
            const now = new Date();

            // Hora inicial a las 0 horas
            const horaInicial = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

            // Hora final antes de la medianoche
            const horaFinal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

            // Formatear las fechas para datetime-local
            const formattedHoraInicial = `${horaInicial.getFullYear()}-${String(horaInicial.getMonth() + 1).padStart(2, '0')}-${String(horaInicial.getDate()).padStart(2, '0')}T${String(horaInicial.getHours()).padStart(2, '0')}:${String(horaInicial.getMinutes()).padStart(2, '0')}`;
            const formattedHoraFinal = `${horaFinal.getFullYear()}-${String(horaFinal.getMonth() + 1).padStart(2, '0')}-${String(horaFinal.getDate()).padStart(2, '0')}T${String(horaFinal.getHours()).padStart(2, '0')}:${String(horaFinal.getMinutes()).padStart(2, '0')}`;

            // Asignar los valores al modelo
            this.horaInicial = formattedHoraInicial;
            this.horaFinal = formattedHoraFinal;

            // Restringir las fechas a hoy
            const maxDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(23).padStart(2, '0')}:${String(59).padStart(2, '0')}`;
            document.getElementById('horaInicial').setAttribute('max', maxDate);
            document.getElementById('horaFinal').setAttribute('max', maxDate);
        },
        getDetalleOrden: function (id) {
            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 7,
                    id: id
                }
            }).then(response => {
                                console.log(response.data)
                this.tragoChicas = response.data;

          
            }).catch(error => {
                console.error(error);
            });

            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 3,
                    id: id
                }
            }).then(response => {
                this.ordenDetalle = response.data;
                this.totalTragos = 0;
                if (this.ordenDetalle[0].total == 0) {
                    let totalNoVacio = 0;
                    this.ordenDetalle.map((datos, index) => {
                        totalNoVacio = totalNoVacio + (datos.cantidad * datos.precio)
                    });
                    this.ordenDetalle[0].total = totalNoVacio
                }

                this.tragoChicas.map((datos, index) => {
                    this.totalTragos = this.totalTragos + (datos.cantidad * datos.precio)
                });

                let datos = this.ordenDetalle[0];
                console.log(datos);
                this.propina = (this.totalTragos+datos.total) * 0.15;
                this.totalConsumido = (datos.total * 1);
                this.totalNeto = parseInt(this.totalTragos) + parseInt(this.totalConsumido);
                this.totalFinal = parseInt(this.totalConsumido) + parseInt(this.propina) + parseInt(this.totalTragos)

                // Calcular la propina (10% del total)
                this.propina = this.propina.toLocaleString('es-GT', {
                    style: 'currency',
                    currency: 'GTQ'
                });
                this.totalNeto = this.totalNeto.toLocaleString('es-GT', {
                    style: 'currency',
                    currency: 'GTQ'
                });

                // Formatear el total consumido en formato de moneda y con 2 decimales
                this.totalConsumido = this.totalConsumido.toLocaleString('es-GT', {
                    style: 'currency',
                    currency: 'GTQ'
                });
                this.totalFinal = this.totalFinal.toLocaleString('es-GT', {
                    style: 'currency',
                    currency: 'GTQ'
                });
                this.totalTragos = this.totalTragos.toLocaleString('es-GT', {
                    style: 'currency',
                    currency: 'GTQ'
                });

            }).catch(error => {
                console.error(error);
            });


            axios.get(`mesas/model/ordenesList.php`, {
                params: {
                    opcion: 4,
                    id: id
                }
            }).then(response => {
                console.log(response.data);
                this.datosCliente = response.data[0]
            }).catch(error => {
                console.error(error);
            });

        },
        imprimirTicket: function () {
            const imagePath = './src/images/rooster.jpg';

            // Función para convertir la imagen a base64
            function convertImageToBase64(imagePath) {
                return new Promise((resolve, reject) => {
                    const fileReader = new FileReader();

                    fileReader.onload = function () {
                        const base64Data = fileReader.result;
                        resolve('data:image/jpeg:base64,' + base64Data);
                    };

                    // Lee la imagen como un Blob
                    fetch(imagePath)
                        .then(response => response.blob())
                        .then(blob => fileReader.readAsDataURL(blob))
                        .catch(error => reject('Error al cargar la imagen: ' + error));
                });
            }

            // Llamada a la función utilizando una Promesa
            convertImageToBase64(imagePath)
                .then(image64 => {
                    console.log(image64);
                    var documentDefinition = {
                        pageSize: {
                            width: 297,
                            height: 840
                        }, // 80x297mm
                        header: {
                            columns: [{
                                stack: [{
                                        canvas: [{
                                            type: 'rect',
                                            alignment: 'left',
                                            w: 700,
                                            h: 35,
                                            color: '#336699', // Fondo azul
                                        }, ],
                                        absolutePosition: {
                                            x: 0,
                                            y: 0
                                        },
                                    },
                                    {
                                        text: 'ROOSTER`S SPORT BAR',
                                        fontSize: 25,
                                        bold: true,
                                        color: '#FFFFFF', // Texto en color blanco
                                    },
                                ],
                                alignment: 'center',
                            }, ],
                        },
                        content: [{
                                text: 'HOJA COMPROBANTE: DATOS DE FACTURACIÓN',
                                fontSize: 14,
                                alignment: 'center',
                            },
                            {
                                image: image64, // Reemplaza 'URL_DE_TU_LOGO' con la URL de tu logo
                                width: 30, // Ajusta el ancho según tu necesidad
                                height: 30, // Ajusta la altura según tu necesidad
                                alignment: 'right',
                                absolutePosition: {
                                    x: 0,
                                    y: 55
                                },
                            },
                            {
                                text: `Número de Pedido: 0${this.idOrden}\nFecha y Hora: ${this.datosCliente.fecha_final} `,
                                fontSize: 12,
                                alignment: 'center',
                                margin: [0, 0, 0, 10],
                            },
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0,
                                    y1: 0,
                                    x2: 215,
                                    y2: 0,
                                    lineWidth: 1,
                                    lineColor: '#336699', // Color de la línea
                                }, ],
                            },
                            {
                                text: `Mesera: ${this.datosCliente.mesera}`,
                                fontSize: 16,
                                margin: [0, 10, 0, 0],
                                alignment: 'left',
                            },
                            {
                                text: `Cliente: ${this.datosCliente.nombre} `,
                                fontSize: 16,
                                margin: [0, 5, 0, 0],
                                alignment: 'left',
                            },
                            {
                                text: `NIT: ${this.datosCliente.nit} `,
                                fontSize: 16,
                                margin: [0, 5, 0, 15],
                                alignment: 'left',
                            },
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0,
                                    y1: 0,
                                    x2: 215,
                                    y2: 0,
                                    lineWidth: 1,
                                    lineColor: '#336699', // Color de la línea
                                }, ],
                                margin: [0, 0, 0, 20],
                            },
                            {
                                table: {
                                    body: [
                                        [{
                                                text: 'Producto',
                                                alignment: 'center',
                                                fillColor: '#336699', // Color de fondo azul
                                                color: '#FFFFFF', // Texto en color blanco
                                                fontSize: 14,
                                                bold: true,
                                            },
                                            {
                                                text: 'Cantidad',
                                                alignment: 'center',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                            {
                                                text: 'Precio',
                                                alignment: 'center',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                            {
                                                text: 'Total',
                                                alignment: 'center',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                        ],
                                        ...this.ordenDetalle.map(item => {
                                            let descripcion = ''
                                            let cantidad = ''
                                            let precio = ''
                                            let total = ''
                                            if (item.estado_insumo == 1) {
                                                descripcion = item.descripcion ? item.descripcion : item.nombre_equivalencia;
                                                cantidad = item.cantidad + 'U';
                                                precio = 'Q' + (item.precio ? item.precio : item.precio_equivalencia);
                                                total = 'Q' + (item.precio ? item.precio : item.precio_equivalencia) * item.cantidad;
                                            }

                                            return [{
                                                    text: descripcion,
                                                    alignment: 'center',
                                                },
                                                {
                                                    text: cantidad,
                                                    alignment: 'center',
                                                },
                                                {
                                                    text: precio,
                                                    alignment: 'center',
                                                },
                                                {
                                                    text: total,
                                                    alignment: 'center',
                                                },
                                            ];
                                        }),
                                    ],
                                    widths: ['*', 'auto', 'auto', 'auto'],
                                    margin: [0, 10, 0, 10],
                                },
                            },
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 0,
                                    lineWidth: 1,
                                    lineColor: '#336699', // Color de la línea
                                }, ],
                                margin: [0, 0, 0, 10],
                            },
                            {
                                table: {
                                    body: [
                                        [{
                                                text: 'Chica',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                            {
                                                text: 'Trago',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                            {
                                                text: 'Consumido',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                            {
                                                text: 'Total',
                                                fillColor: '#336699',
                                                color: '#FFFFFF',
                                                fontSize: 14,
                                                bold: true,
                                            },
                                        ],
                                        ...this.tragoChicas.map(item => {
                                            let chica = ''
                                            let insumo = ''
                                            let precio = ''
                                            let cantidad = ''
                                            let total = ''
                                            let consumido = ''
                                            chica = item.nombre_mesera;
                                            insumo = item.materia_prima;
                                            cantidad = item.cantidad + 'U';
                                            precio = 'Q' + item.precio;
                                            total = 'Q' + (item.precio * item.cantidad);
                                            consumido = precio + ' * ' + cantidad
                                            return [{
                                                    text: chica,
                                                    alignment: 'center',
                                                },
                                                {
                                                    text: insumo,
                                                    alignment: 'center',
                                                },
                                                {
                                                    text: consumido,
                                                    alignment: 'center',
                                                },
                                                {
                                                    text: total,
                                                    alignment: 'center',
                                                },
                                            ];
                                        }),
                                    ],
                                    widths: ['*', 'auto', 'auto', 'auto'],
                                    margin: [0, 10, 0, 10],
                                },
                            },

                            {
                                text: `Total Consumido: ${this.totalConsumido} \nTragos Invitados: ${this.totalTragos} \nPropina: ${this.validarPropina == 1 ? this.propina : 0} `,
                                alignment: 'right',
                                fontSize: 16,
                                bold: true,
                                margin: [0, 20, 0, 10],
                            },
                            {
                                canvas: [{
                                    type: 'line',
                                    x1: 400,
                                    y1: 0,
                                    x2: 540,
                                    y2: 0,
                                    lineWidth: 1,
                                }, ],
                                margin: [0, 0, 0, 10],
                            },
                            {
                                text: `Total: ${this.validarPropina == 1 ? (this.totalFinal) : ( this.totalNeto)}`,
                                alignment: 'right',
                                fontSize: 20,
                                bold: true,
                                margin: [0, 0, 0, 10],
                            },
                            {
                                text: `
                                ¡GRACIAS POR CONSUMIR EN ROOSTERS!`,
                                fontSize: 8,
                                alignment: 'center',
                                bold: true,
                            },
                            {
                                text: `
                                Apreciamos sinceramente tu visita y confianza en nuestro establecimiento. En Roosters, nos esforzamos por brindar una magnifica experiencia. Esperamos que hayas disfrutado de cada momento que compartiste en nuestra mesa. Tu satisfacción es nuestra mayor recompensa. Gracias por elegirnos como tu destino. ¡Esperamos verte nuevamente pronto!
                                
                                Atentamente,
                                El equipo de Roosters`,
                                fontSize: 8,
                                bold: true,
                                margin: [0, 0, 0, 0],
                            }
                        ],
                        footer: {
                            columns: [{
                                stack: [{
                                    text: `Impresión generada por el sistema de restaurante Roosters
                                        Copyright © RESTAURANTE ROOSTER´S! 2024`,
                                    alignment: 'center',
                                    fontSize: 14,
                                }, ],
                            }, ],
                            margin: [0, 0, 0, 0], // Ajusta el margen inferior según tus necesidades
                        }
                    };


                    pdfMake.createPdf(documentDefinition).getBuffer((buffer) => {
                        // Crea un blob a partir del buffer
                        var blob = new Blob([buffer], {
                            type: 'application/pdf'
                        });

                        // Crea un objeto URL para el blob del PDF
                        var pdfUrl = URL.createObjectURL(blob);

                        // Abre un enlace en una nueva ventana
                        window.open(pdfUrl, '_blank');
                    });
                })
                .catch(error => console.error(error));
        },
    }
});

$(document).on('click', '[id^="btnImprimir_"]', function () {
    var data = $(this).attr('id').split('_')[1];
    parqueoList.imprimirTicket(data);
});