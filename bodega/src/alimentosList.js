const EventBus = new Vue();
const LitadoLocales = httpVueLoader('./componentes/listadoLocales.vue');

let bodegaList = new Vue({
    el: '#appAlimentos',
    data: {
        tituloModulo: 'Listado Alimentos',
        idLocalSesion: '',
        estado: '',
        nombreModal: '',
        idLocal: '',
        nombre: '',
        descripcion: '',
        precio: '',
        idLocal: '',
        idAlimento: '',
        tipoModal: 0,
        Toast: ''

    },
    components: {
        'listado-locales': LitadoLocales,
    },
    mounted: function () {
        this.evento = EventBus;
        this.Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        this.idLocalSesion = $("#local").val();
        this.estado = 1
        this.idLocalSesion = $("#local").val();
        if (this.idLocalSesion != 3) {
            this.idLocal = $("#local").val();
        }
        this.evento.$on('cambiar-local', (nuevoValor) => {
            this.idLocal = nuevoValor
        });
        this.cargarTablaAlimentos(1);
        this.baseTables();
    },
    computed: {
        camposCompletos() {
            return this.idLocal.trim() !== '' && this.nombre.trim() !== '' && this.descripcion.trim() !== '' && this.precio.trim() !== '';
        },
    },
    watch: {
        tipoModal(valor) {
            if (valor == 1) {
                this.nombreModal = 'Nuevo Alimento'
            }
            if (valor == 2) {
                this.nombreModal = 'Editar Alimento'
            }
        }
    },
    methods: {
        cargarTablaAlimentos: function () {
            let thes = this;
            axios.get(`bodega/model/alimentosList.php`, {
                params: {
                    opcion: 1,
                    tipo: 2,
                    id: this.idLocalSesion,
                    estado: this.estado
                }
            }).then(response => {
                console.log(response.data);
                if ($.fn.DataTable.isDataTable("#tblAlimentos")) {
                    $("#tblAlimentos").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaBodega = $("#tblAlimentos").DataTable({
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
                            emptyTable: "No hay solicitudes de Alimentos para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando insumos, por favor espere</h3> "
                        },
                        "aoColumns": [{
                                "class": "text-center",
                                data: 'id_alimento',
                                render: function (data, type, row) {
                                    let encabezado;
                                    if (row.id_estado == 1) {
                                        encabezado = `
                                        <button class="btn btn-primary btn-xs editar" type="button" aria-haspopup="true" aria-expanded="false" data-id="${data}">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                        encabezado;
                                    } else {
                                        encabezado = `
                                        <button class="btn btn-danger btn-xs editar" type="button" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-sharp fa-solid fa-badge-check"></i> ${data}
                                        </button>`;
                                    }
                                    return encabezado;
                                },
                            },
                            {
                                "class": "text-center",
                                mData: 'alimento_nombre'
                            },
                            {
                                "class": "text-center",
                                mData: 'alimento_descripcion'
                            },
                            {
                                "class": "text-center",
                                data: 'precio_alimento',
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
                                            <input type="checkbox" checked data-id="${row.id_alimento}">
                                            <span class="slider round"></span>
                                        </label>`;
                                    } else {
                                        return `<label class="switch">
                                            <input type="checkbox" data-id="${row.id_alimento}">
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
                                text: 'Inhabilitadas <i class="fa-sharp fa-solid fa-circle-xmark"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    thes.estado = 2
                                    thes.cargarTablaAlimentos();
                                }
                            },
                            {
                                text: 'Activos <i class="fa-solid fa-check"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    thes.estado = 1
                                    thes.cargarTablaAlimentos();
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

            $('#tblAlimentos').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');
                that.idAlimento = id

                if (isChecked) {
                    that.estado = 1
                    that.setEstadoAlimento(); // Checkbox marcado
                } else {
                    that.estado = 2
                    that.setEstadoAlimento(); // Checkbox no marcado
                }
            });

            $('#tblAlimentos').on('click', '.editar', function () {
                let id = $(this).data('id');
                that.idAlimento = id
                that.tipoModal = 2
                that.getAlimentoDetalle()
                $("#setNuevoAlimento").modal("show")
            });

            $('[data-dismiss="modal"]').on('click', function () {
                that.idAlimento = ''
                that.nombre = ''
                that.descripcion = ''
                that.precio = ''
                that.idLocal = ''
                that.$forceUpdate();
            });
        },
        setNuevoAlimento() {
            Swal.fire({
                title: '¿Generar Nuevo Alimento?',
                text: "¡Se agregara un nuevo alimento (Independiente de la bodega)!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Generar!',
                cancelmButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 2);
                    formData.append('nombre', this.nombre);
                    formData.append('descripcion', this.descripcion);
                    formData.append('local', this.idLocal);
                    formData.append('precio', this.precio);

                    // Realizar la solicitud POST al servidor
                    axios.post('./bodega/model/alimentosList.php', formData)
                        .then(response => {
                            console.log(response.data);
                            if (response.data.id == 1) {
                                Swal.fire({
                                    icon: 'success',
                                    title: response.data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                this.cargarTablaAlimentos()
                                $("#setNuevoAlimento").modal("hide")
                                this.precio = ''
                                this.nombre = ''
                                this.descripcion = ''
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        },
        modalNuevoAlimento() {
            this.tipoModal = 1
            $("#setNuevoAlimento").modal("show")
        },
        getAlimentoDetalle() {
            axios.get('bodega/model/alimentosList.php', {
                params: {
                    opcion: 3,
                    id: this.idAlimento,
                }
            }).then((response) => {
                console.log(response.data);
                let alimento = response.data

                this.nombre = alimento.alimento_nombre
                this.descripcion = alimento.alimento_descripcion
                this.precio = alimento.precio_alimento
            }).catch((error) => {
                console.log(error);
            });
        },
        setActualizarAlimento() {
            Swal.fire({
                title: `Actualizar ${this.idAlimento}-${this.nombre}`,
                text: "Se actualizara la información del alimento",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Actualizar!',
                cancelmButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 4);
                    formData.append('nombre', this.nombre);
                    formData.append('descripcion', this.descripcion);
                    formData.append('local', this.idLocal);
                    formData.append('precio', this.precio);
                    formData.append('idAlimento', this.idAlimento);

                    // Realizar la solicitud POST al servidor
                    axios.post('./bodega/model/alimentosList.php', formData)
                        .then(response => {
                            console.log(response.data);
                            if (response.data.id == 1) {
                                Swal.fire({
                                    icon: 'success',
                                    title: response.data.msg,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                this.cargarTablaAlimentos()
                                $("#setNuevoAlimento").modal("hide")
                                this.nombre = ''
                                this.descripcion = ''
                                this.idLocal = ''
                                this.precio = ''
                                this.idAlimento = ''
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        },
        setEstadoAlimento() {
            var formData = new FormData();
            formData.append('opcion', 5);
            formData.append('estado', this.estado);
            formData.append('idAlimento', this.idAlimento);
            axios.post('./bodega/model/alimentosList.php', formData)
                .then(response => {
                    console.log(response.data);
                    if (response.data.id == 1) {
                        this.Toast.fire({
                            icon: 'success',
                            title: response.data.msg
                        });
                        this.cargarTablaAlimentos()
                    } else {
                        this.Toast.fire({
                            icon: 'error',
                            title: response.data.msg
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                });

        }
    },
});