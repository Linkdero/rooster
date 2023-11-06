let medidasList = new Vue({
    el: '#appMedidas',
    data: {
        tituloModulo: 'Listado Medidas',
        descripcion: '',
        horaActual: '',
        tipoModal: '',
        nombreCatalogo: '',
        descripcion: '',
        nombreModal: 'Nueva Medida'
    },
    mounted: function () {
        this.cargarTablaMedidas();
        this.baseTables();
    },
    computed: {
        camposCompletos() {
            return this.descripcion.trim() !== '';
        },
    },
    methods: {
        cargarTablaMedidas: function () {
            let thes = this;
            axios.get(`categorias/model/medidasList.php`, {
                params: {
                    opcion: 1,
                    tipo: 2
                }
            }).then(response => {
                console.log(response.data);

                if ($.fn.DataTable.isDataTable("#tblMedidas")) {
                    $("#tblMedidas").DataTable().destroy();
                }

                if (response.data) {
                    // DataTable initialization
                    this.tablaMedidas = $("#tblMedidas").DataTable({
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
                            emptyTable: "No hay solicitudes de Medidas para mostrar",
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
                                data: 'id',
                                render: function (data, type, row) {
                                    let nombre = 'Catalogos';
                                    let encabezado = `
                                        <button class="btn btn-primary btn-xs getCategorias" type="button" aria-haspopup="true" aria-expanded="false" data-id="${row.id}">
                                        ${nombre} <i class="fa-solid fa-rectangle-list"></i>
                                        </button>`;
                                    encabezado;

                                    return encabezado;
                                },
                            },
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
                                text: 'Nuevo <i class="fa-solid fa-square-plus"></i>',
                                className: 'bg-primary text-white btn-xs mx-1',
                                action: function (e, dt, node, config) {
                                    $("#setNuevaMedida").modal("show")
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
            $('#tblMedidas').on('change', '.switch input', function () {
                let id = $(this).data('id');
                let isChecked = $(this).is(':checked');

                if (isChecked) {
                    that.setMedida(id, 1);
                } else {
                    that.setMedida(id, 2);
                }
            });
        },
        setNuevaMedida: function () {
            Swal.fire({
                title: '¿Generar Nueva Medida?',
                text: "Se agregara una medida al Sistema!",
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
                    formData.append('opcion', 3);
                    formData.append('descripcion', this.descripcion);
                    // Realizar la solicitud POST al servidor
                    axios.post('./categorias/model/medidasList.php', formData)
                        .then(response => {
                            console.log(response.data);
                            Swal.fire({
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            $("#setNuevaMedida").modal("hide")
                            this.cargarTablaMedidas()
                            this.descripcion = ''
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        },
        setMedida: function (id, estado) {
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
            let titulo;
            let descripcion;
            if (estado == 1) {
                titulo = '¿Activar Medida?'
                descripcion = '!Se activara nuevamente esta medida al sistema!'
            } else {
                titulo = '¿Desactivar Medida?'
                descripcion = '!Se dara de baja a la medida en el sistema!'
            }
            Swal.fire({
                title: titulo,
                text: descripcion,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Desactivar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crear un objeto FormData para enviar los datos al servidor
                    var formData = new FormData();
                    formData.append('opcion', 4);
                    formData.append('id', id);
                    formData.append('estado', estado);

                    // Realizar la solicitud POST al servidor
                    axios.post('./categorias/model/medidasList.php', formData)
                        .then(response => {
                            console.log(response.data);

                            if (response.data.id == 1) {
                                Toast.fire({
                                    icon: 'success',
                                    title: response.data.msg
                                });
                                this.cargarTablaMedidas()
                            } else {
                                Toast.fire({
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
        }
    },
});
