new Vue({
  el: '#appDashboard',

  data: {
    titulo: 'Reporteria General',
    horaInicio: '',
    horaFinal: '',
    totalOrdenes: '',
    sumaTotales: '',
    totalNeto: '',
    clientes: '',
    ordenes: '',
    observaciones: '',
    meseras: ''
  },
  mounted: function () {
    this.fechaHoy()
    this.datosReporteria()
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

    datosReporteria: function () {
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
            fechaFinal: this.horaFinal,
            idLocal: $("#local").val()
          }
        })
        .then(function (response) {
          console.log(response.data);

          thes.totalOrdenes = response.data.totalOrdenes;
          thes.sumaTotales = response.data.sumaTotales;
          thes.propinas = thes.sumaTotales * 0.1;
          thes.totalNeto = thes.sumaTotales + thes.propinas;

          thes.propinas = thes.propinas.toLocaleString('es-GT', {
            style: 'currency',
            currency: 'GTQ'
          });
          thes.sumaTotales = thes.sumaTotales.toLocaleString('es-GT', {
            style: 'currency',
            currency: 'GTQ'
          });
          thes.totalNeto = thes.totalNeto.toLocaleString('es-GT', {
            style: 'currency',
            currency: 'GTQ'
          });

          thes.clientes = response.data.clientes;
          thes.ordenes = response.data.ordenes;
          thes.observaciones = response.data.observaciones;
          thes.meseras = response.data.meseras;

          thes.grafica()
          thes.graficaMeserasProductivas()
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    grafica() {
      // Extrae los ID de las órdenes y los totales para el gráfico
      const idsOrdenes = this.ordenes.map((orden) => orden.id_orden);
      const totalesOrdenes = this.ordenes.map((orden) => orden.total);

      // Configuración del gráfico lineal sin relleno
      const ctx = this.$refs.chartOrdenes.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: idsOrdenes,
          datasets: [{
            label: 'Total por Orden',
            borderColor: 'rgba(26, 188, 156, 1)',
            borderWidth: 1,
            fill: false, // Desactiva el relleno
            data: totalesOrdenes,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'ID de Orden',
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Total',
              },
            }],
          },
        },
      });
    },
    graficaMeserasProductivas() {
      const idsMeseras = this.meseras.map((mesera) => mesera.mesera);
      const totalesVentasMeseras = this.meseras.map((mesera) => mesera.suma_propinas);

      const cantidadIdsMeseras = idsMeseras.length;

      console.log(`Cantidad de registros en idsMeseras: ${cantidadIdsMeseras}`);

      // Colores personalizados para cada mesera
      const coloresMeseras = [];

      for (let i = 0; i < cantidadIdsMeseras; i++) {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        coloresMeseras.push(color);
      }

      console.log('Colores para cada mesera:', coloresMeseras);

      // Configuración del gráfico de barras horizontales
      const ctx = this.$refs.chartMeserosProductivos.getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: idsMeseras,
          datasets: [{
            label: 'Ventas Totales por Mesera',
            backgroundColor: coloresMeseras,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: totalesVentasMeseras,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Ventas Totales',
              },
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'ID de Mesera',
              },
            }],
          },
        },
      });
    },

  },
})