new Vue({
  el: '#appDashboard',

  data: {
    titulo: 'Reporteria General',
    horaInicio: '',
    horaFinal: '',
    conteoPlacas: '',
    totalGanancias: ''
  },
  mounted: function () {
    this.fechaHoy()
    this.datosVehiculos()
  },
  computed: {

  },

  methods: {
    fechaHoy: function () {
      var fecha = new Date(); //Fecha actual
      var mes = fecha.getMonth() + 1; //obteniendo mes
      var dia = fecha.getDate(); //obteniendo dia
      var ano = fecha.getFullYear(); //obteniendo año
      if (dia < 10) {
        dia = '0' + dia; //agrega cero si el menor de 10
      }
      if (mes < 10) {
        mes = '0' + mes //agrega cero si el menor de 10
      }

      let hora = fecha.getHours()
      let minuto = fecha.getMinutes();

      if (minuto < 10) {
        minuto = '0' + minuto //agrega cero si el menor de 10
      }

      if (hora < 10) {
        hora = '0' + hora //agrega cero si el menor de 10
      }

      let fechah = ano + "-" + mes + "-" + dia
      let horaH = hora + ':' + minuto
      let fechaHora = fechah + "T" + horaH
      this.horaFinal = fechaHora
      fechaHora = fechah + "T" + '00:00'
      this.horaInicio = fechaHora
    },

    datosVehiculos: function () {
      let thes = this;
      if (this.horaFinal < this.horaInicio) {
        Swal.fire({
          icon: 'error',
          title: 'La fecha final no puede ser menor a la inicial',
          showConfirmButton: false,
          timer: 1500
        });
        return;
      }

      axios.get('./inc/dashboard.php', {
        params: {
          opcion: 1,
          fechaInicial: this.horaInicio,
          fechaFinal: this.horaFinal
        }
      })
        .then(function (response) {
          thes.conteoPlacas = response.data.conteo[0];
          thes.totalGanancias = response.data.gananciasParticulares[0];

          // Convertir los valores de conteoPlacas a un array
          const valoresConteoPlacas = [
            thes.conteoPlacas.conteo_placa_1,
            thes.conteoPlacas.conteo_placa_2,
            thes.conteoPlacas.conteo_placa_3,
            thes.conteoPlacas.conteo_placa_4
          ];

          // Configuración y creación de la gráfica de conteo de placas
          const conteoPlacasCtx = document.getElementById('vehiculosComparacionPlacas').getContext('2d');
          new Chart(conteoPlacasCtx, {
            type: 'horizontalBar',
            data: {
              labels: ['Particulares', 'Taxis', 'Camiones', 'Motos'],
              datasets: [{
                label: 'Conteo de Placas',
                data: valoresConteoPlacas,
                backgroundColor: ['red', 'blue', 'green', 'yellow']
              }]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true
                }
              }
            }
          });

          // Convertir los valores de totalGanancias a un array
          const valoresGanancias = [
            thes.totalGanancias.total1,
            thes.totalGanancias.total2,
            thes.totalGanancias.total3,
            thes.totalGanancias.total4
          ];

          // Configuración y creación de la gráfica de ganancias
          const gananciasCtx = document.getElementById('vehiculosComparacionGanancias').getContext('2d');
          new Chart(gananciasCtx, {
            type: 'bar',
            data: {
              labels: ['Particulares', 'Taxis', 'Camiones', 'Motos'],
              datasets: [{
                label: 'Total Ganancias',
                data: valoresGanancias,
                backgroundColor: ['red', 'blue', 'green', 'yellow']
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          })

          // Función para convertir un valor a moneda guatemalteca
          function convertirAMoneda(valor) {
            return valor.toLocaleString('es-GT', {
              style: 'currency',
              currency: 'GTQ'
            });
          }

          // Convertir los valores a moneda guatemalteca
          for (let i = 1; i <= 4; i++) {
            thes.totalGanancias['total' + i] = convertirAMoneda(thes.totalGanancias['total' + i]);
          }

          console.log(thes.conteoPlacas);
          console.log(thes.totalGanancias);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }

  },
})