const ListadoPlazas = httpVueLoader('./componentes/listadoPlazas.vue');
const LitadoLocales = httpVueLoader('./componentes/ListadoLocales.vue');

const EventBus = new Vue();
let mesasList = new Vue({
    el: '#appMeseras',
    data: {
        tituloModulo: 'Listado Empleados',
        tituloModal: 'Informacion Empleado',
        evento: '',
        tablaMeseras: '',
        direccion: '',
        idModal: '',
        nombre: '',
        apellido: '',
        idPlaza: '',
        foto: '',
        base64Image: '',
        idPermiso: '',
        idLocal: '',
        Toast: '',
        tipoModal: 1,
        plazaActual: '',
        localActual: '',
    },
    components: {
        'listado-plazas': ListadoPlazas,
        'listado-locales': LitadoLocales,

    },
    computed: {
        camposCompletos() {
            return this.nombre.trim() !== '' && this.apellido.trim() !== '' && this.base64Image.trim() !== '' && this.idPlaza !== '' && this.direccion.trim() !== '';
        },
    },
    mounted: function () {
        this.Toast = Swal.mixin({
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
        this.idPermiso = $("#permiso").val();
        this.idModal = this.$refs.idModal.id;
        this.evento = EventBus;
        this.idLocal = $("#local").val();

        this.evento.$on('cambiar-plaza', (nuevoValor) => {
            this.idPlaza = nuevoValor
        });
        this.evento.$on('cambiar-local', (nuevoValor) => {
            this.idLocal = nuevoValor
        });
        this.cargarTablaEmpleados();
        this.baseTables();
    },
    watch: {
        tipoModal(valor) {
            if (valor == 2) {
                this.cargarInformacionEmpleado()
            }
        }
    },

    methods: {
        cargarTablaEmpleados: function (id) {
            let thes = this;
            if (id === false || id === undefined) {
                id = 0;
            }

            axios.get(`empleados/model/empleadosList.php`, {
                params: {
                    opcion: 1,
                    filtro: id,
                    local: this.idLocal,

                }
            }).then(response => {
                console.log(response.data);
                this.tablaMeseras = response.data;
                if ($.fn.DataTable.isDataTable("#tblEmpleados")) {
                    $("#tblEmpleados").DataTable().destroy();
                }

                if (response.data) {
                    this.tablaEmpleados = $("#tblEmpleados").DataTable({
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
                            emptyTable: "No hay solicitudes de Empleados para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [
                            {
                                "class": "text-center",
                                data: 'foto',
                                render: function (data, type, row) {
                                    return `<img src="${data} " alt="Imagen del Cliente" class="img-circle img-fluid" style="width: 80px; height: 80px; border: 5px solid #fff; border-radius: 50%;">
                                    `;
                                },

                            },
                            {
                                "class": "text-center",
                                data: 'id',
                                render: function (data, type, row) {
                                    let encabezado;

                                    if (row.id_estado == 1) {
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
                            { "class": "text-center", mData: 'nombre' },
                            { "class": "text-center", mData: 'direccion' },
                            { "class": "text-center", mData: 'locales' },
                            {
                                "class": "text-center",
                                data: 'id_estado',
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
                                text: 'Todos <i class="fa fa-server" aria-hidden="true"></i>',
                                className: 'bg-primary text-white btn-xs ',
                                action: function (e, dt, node, config) {
                                    thes.cargarTablaEmpleados()
                                }
                            },
                            {
                                text: 'Inactivos <i class="fa-solid fa-circle-xmark"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.cargarTablaEmpleados(2)
                                },
                            },
                            {
                                text: 'Activos <i class="fa fa-check-circle"></i>',
                                className: 'bg-primary text-white btn btn-xs',
                                action: function (e, dt, node, config) {
                                    thes.cargarTablaEmpleados(1)
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

            $('#tblEmpleados').on('click', '.badge-success', function () {
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

            $('#tblEmpleados').on('click', '.detalle', function () {
                let id = $(this).data('id');
                that.tipoModal = 2
                that.idEmpleado = id
                $("#setNuevoEmpleado").modal("show")
            });

            $('#tblEmpleados').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setEmpleado(id, 1);
                } else {
                    that.setEmpleado(id, 2);
                }
            });
        },
        modalNuevoEmpleado: function () {
            this.tipoModal = 1
            this.nombre = ''
            this.apellido = ''
            this.direccion = ''
            this.foto = ''
            this.base64Image = ''
            this.idPlaza = ''
            this.idLocal = ''
            this.plazaActual = ''
            this.localActual = ''
            $("#setNuevoEmpleado").modal("show")
        },
        openImageUploader() {
            Swal.fire({
                title: 'Seleccionar imagen',
                input: 'file',
                inputAttributes: {
                    accept: 'image/*',
                    'aria-label': 'Seleccionar imagen'
                },
                showCancelButton: true,
                showConfirmButton: true,
                preConfirm: (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();

                        reader.onload = (e) => {
                            const image = new Image();
                            image.src = e.target.result;
                            Swal.fire({
                                title: 'Imagen a Utilizar',
                                html: `
                              <img id="preview" src="${image.src}" class="rounded-circle" style="width: 350px; height: 350px;">
                              <div>
                                <img id="cropperjs" src="${image.src}" style="display: block; max-width: 100%;">
                              </div>
                            `,
                                showCancelButton: true,
                                showConfirmButton: true,
                                onBeforeOpen: () => {
                                    const cropper = new Cropper(document.getElementById('cropperjs'), {
                                        aspectRatio: 1,
                                        viewMode: 1,
                                        crop: throttle(function () {
                                            const croppedCanvas = cropper.getCroppedCanvas();
                                            const preview = document.getElementById('preview');
                                            preview.src = croppedCanvas.toDataURL();
                                        }, 25)
                                    });
                                },
                                preConfirm: () => {
                                    const preview = document.getElementById('preview');
                                    resolve(preview.src);
                                    $('#previa').attr('src', preview.src);
                                    this.base64Image = preview.src;
                                    console.log(this.base64Image);
                                }
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                }
            });
        },
        crearEmpleado: function () {
            if (this.idPermiso != 1) {
                this.idLocal = $("#local").val();
            }
            let titulo;
            let descripcion;
            if (this.tipoModal == 1) {
                titulo = '¿Generar nuevo Empleado?'
                descripcion = "Se agregara un nuevo Empleado al Sistema!"
            } else {
                titulo = '¿Actualizar Empleado?'
                descripcion = "¡Se actualizara el Empleado!"
            }
            Swal.fire({
                title: titulo,
                text: descripcion,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Confirmar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 2);
                    formData.append('nombre', this.nombre);
                    formData.append('apellido', this.apellido);
                    formData.append('direccion', this.direccion);
                    formData.append('plaza', this.idPlaza);
                    formData.append('local', this.idLocal);
                    formData.append('foto', this.base64Image);
                    formData.append('tipoModal', this.tipoModal);
                    formData.append('idEmpleado', this.idEmpleado);

                    // Realizar la solicitud POST al servidor
                    axios.post('./empleados/model/empleadosList.php', formData)
                        .then(response => {
                            console.log(response.data);

                            if (response.data.id == 1) {
                                this.Toast.fire({
                                    icon: 'success',
                                    title: response.data.msg
                                });
                                this.idLocal = $("#local").val();
                                $("#setNuevoEmpleado").modal("hide")
                                this.cargarTablaEmpleados(0)
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
            });
        },
        setEmpleado: function (id, estado) {
            var formData = new FormData();
            formData.append('opcion', 3);
            formData.append('id', id);
            formData.append('estado', estado);

            // Realizar la solicitud POST al servidor
            axios.post('./empleados/model/empleadosList.php', formData)
                .then(response => {
                    console.log(response.data);

                    if (response.data.id == 1) {
                        this.Toast.fire({
                            icon: 'success',
                            title: response.data.msg
                        });
                        this.cargarTablaEmpleados()
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
        },
        cargarInformacionEmpleado() {
            axios.get('empleados/model/empleadosList.php', {
                params: {
                    opcion: 4,
                    idEmpleado: this.idEmpleado
                }
            }).then((response) => {
                console.log(response.data);
                this.nombre = response.data.nombre
                this.apellido = response.data.apellido
                this.direccion = response.data.direccion
                this.foto = response.data.foto
                this.base64Image = response.data.foto
                this.idPlaza = response.data.id_plaza
                this.idLocal = response.data.id_local
                this.plazaActual = response.data.plaza
                this.localActual = response.data.descripcion
            }).catch((error) => {
                console.log(error);
            });
        }
    }
});

$(document).on('click', '[id^="btnImprimir_"]', function () {
    var data = $(this).attr('id').split('_')[1];
    parqueoList.imprimirTicket(data);
});