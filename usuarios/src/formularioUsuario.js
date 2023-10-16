const LitadoLocales = httpVueLoader('./componentes/ListadoLocales.vue');
const ListadoPermisos = httpVueLoader('./componentes/ListadoPermisos.vue');

const EventBus = new Vue();
let usuarioModel = new Vue({
  el: '#appUsuarios',
  data: {
    tituloModulo: '',
    foto: '',
    base64Image: '',
    rollsList: '',
    usuario: '',
    password: '',
    rollsModel: '',
    nombre: '',
    apellido: '',
    evento: '',
    idPermiso: 1,
    idLocal: 0

  },
  components: {
    'listado-locales': LitadoLocales,
    'listado-permisos': ListadoPermisos,
  },
  mounted: function () {
    this.evento = EventBus;
    this.evento.$on('cambiar-permiso', (nuevoValor) => {
      this.idPermiso = nuevoValor
    });
    this.evento.$on('cambiar-local', (nuevoValor) => {
      this.idLocal = nuevoValor
    });
    this.bases()
    this.rolls()
  },
  computed: {
    camposCompletos() {
      return this.usuario.trim() !== '' && this.nombre.trim() !== '' && this.apellido.trim() !== '' && this.password.trim() !== '' && this.idPermiso.trim() !== '' && this.base64Image.trim() !== '';
    },
  },
  methods: {
    bases: function () {
      if ($("#tipo").val() == 3) {
        this.tituloModulo = 'Creación de Usuario'
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

      })
        .catch(error => {
          console.error(error);
        });
    },
    actualizarUsuario: function () {
      let tipo = $("#tipo").val();

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
        title: '¿Generar nuevo Usuario?',
        text: "Se agregara un nuevo Usuario al Sistema!",
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
          formData.append('nombre', this.nombre);
          formData.append('apellido', this.apellido);
          formData.append('password', this.password);
          formData.append('roll', this.idPermiso);
          formData.append('local', this.idLocal);
          formData.append('foto', this.base64Image);

          // Realizar la solicitud POST al servidor
          axios.post('./usuarios/model/formularioUsuario.php', formData)
            .then(response => {
              console.log(response.data);

              if (response.data.id == 1) {
                Toast.fire({
                  icon: 'success',
                  title: response.data.msg
                });
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

  }
});

function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const context = this;
    const currentTime = Date.now();

    if (currentTime < lastExecTime + delay) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        lastExecTime = currentTime;
        func.apply(context, args);
      }, delay);
    } else {
      lastExecTime = currentTime;
      func.apply(context, args);
    }
  };
}