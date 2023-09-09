var parqueoList = new Vue({
    el: '#appConfiguracion',
    data: {
        tituloModulo: '',
        tipoConfiguracion: 1,
        foto: '',
        base64Image: '',
        rollsList: '',
        usuario: '',
        password: '',
        rollsModel: '',
        idRoll: '',
        idUsuario: '',
        tablaUsuarios: '',
        tipoRoll : ''
    },
    mounted: function () {
        this.baseTables()
        this.configuracion()
        this.tipoRoll = $("#idRoll").val()
    },
    computed: {
        camposCompletos() {
            return this.usuario.trim() !== '' && this.rollsModel.trim() !== '' && this.base64Image.trim() !== '';
        },
    },
    methods: {
        configuracion: function (id) {
            this.idRoll = $("#idRoll").val()

            if (id == undefined) {
                id = this.tipoConfiguracion
            }

            if (id == 1) {
                this.tituloModulo = 'Editar Perfil'
                this.tipoConfiguracion = id
                this.idUsuario = $("#idUsuario").val()
                this.obtenerUsuario(this.idUsuario)
                this.rolls()
            } else if (id == 2) {
                this.tipoConfiguracion = id
                this.tituloModulo = 'Editar Perfiles'
                this.cargarTablaUsuarios()
            }

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
        rolls: function () {
            axios.get(`./usuarios/model/formularioUsuario.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data)
                this.rollsList = response.data

            }).catch(error => {
                console.error(error);
            });
        },
        actualizarUsuario: function () {
            let tipo = 4

            const Toast = Swal.mixin({
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

            Swal.fire({
                title: 'Actualizar datos de Usuario?',
                text: "Se actualizaran los datos del Usuario al Sistema!",
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
                    formData.append('opcion', 2);
                    formData.append('tipo', tipo);
                    formData.append('usuario', this.usuario);
                    formData.append('password', this.password);
                    formData.append('roll', this.rollsModel);
                    formData.append('foto', this.base64Image);
                    formData.append('id', this.idUsuario);

                    // Realizar la solicitud POST al servidor
                    axios.post('./usuarios/model/formularioUsuario.php', formData).then(response => {
                        console.log(response.data);

                        if (response.data.id == 1) {
                            Toast.fire({
                                icon: 'success',
                                title: response.data.msg
                            });
                            location.reload()
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: response.data.msg
                            });
                        }
                    }).catch(error => {
                        console.error(error);
                    });
                }
            });
        },
        obtenerUsuario: function (id) {
            axios.get(`./configuracion/model/configuracion.php`, {
                params: {
                    opcion: 1,
                    usuario: id
                }
            }).then(response => {
                console.log(response.data)
                let datos = response.data[0]
                this.usuario = datos.usuario;
                this.rollsModel = datos.id_roll;
                this.foto = datos.imagen;
                this.base64Image = datos.imagen;
            }).catch(error => {
                console.error(error);
            });
        },

        cargarTablaUsuarios: function () {
            axios.get(`./configuracion/model/configuracion.php`, {
                params: {
                    opcion: 2,
                }
            }).then(response => {
                console.log(response.data);

                // Clear any previous DataTable instance
                if ($.fn.DataTable.isDataTable("#tblUsuariosList")) {
                    $("#tblUsuariosList").DataTable().destroy();
                }

                // Initialize DataTables only if data is available
                if (response.data) {
                    // DataTable initialization
                    this.tablaParqueo = $("#tblUsuariosList").DataTable({
                        "ordering": false,
                        "pageLength": 25,
                        "bProcessing": true,
                        "lengthChange": true,
                        "paging": true,
                        "info": true,
                        select: false,
                        scrollX: true,
                        scrollY: '50vh',
                        language: {
                            emptyTable: "No hay solicitudes de Vehículos para mostrar",
                            sProcessing: " <h3 class=''><i class='fa fa-sync fa-spin'></i> Cargando la información, por favor espere</h3> "
                        },
                        "aoColumns": [
                            {
                                "class": "text-center",
                                data: 'id',
                                render: function (data, type, row) {
                                    return `<a href="#" class="badge badge-info text-white py-1 px-2" data-id="${row.id}""><i class="fa-solid fa-hashtag"></i> ${row.id}</a>`;
                                },

                            },
                            { "class": "text-center", mData: 'usuario' },
                            {
                                "class": "text-center",
                                data: 'roll',
                                render: function (data, type, row) {
                                    if (row.idroll == 1) {
                                        return `<a href="#" onclick="actualizarRoll(${row.id})" class="badge badge-primary text-white py-1 px-2" data-id="${row.id}"">${data}</a>`;
                                    } else {
                                        return `<a href="#" onclick="actualizarRoll(${row.id})" class="badge badge-success text-white py-1 px-2" data-id="${row.id}"">${data}</a>`;
                                    }
                                },

                            },
                            {
                                "class": "text-center",
                                data: 'id_estado',
                                render: function (data, type, row) {
                                    if (row.id_estado == 1) {
                                        return `
                                            <div class="text-center">
                                                <label class="switch">
                                                    <input onclick="actualizarEstado(${row.id})" id="toggle-${row.id}" type="checkbox" checked>
                                                    <span class="slider round"></span>
                                                </label>
                                            </div>
                                        `;
                                    } else if (row.id_estado == 2) {
                                        return `
                                            <div class="text-center">
                                                <label class="switch">
                                                    <input onclick="actualizarEstado(${row.id})" id="toggle-${row.id}" type="checkbox">
                                                    <span class="slider round"></span>
                                                </label>   
                                            </div>
                                        `;
                                    }
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
    }
});

