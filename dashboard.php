<div id="appDashboard">
  <div class="right_col" role="main">
    <div class="x_title">
      <h2>{{titulo}}</h2>
      <ul class="nav navbar-right panel_toolbox">
        <li style="margin-left:2.5rem;">
          <div class="col-md-6">
            <input id="fechaInicial" name="fechaInicial" class="js-datepicker form-control" data-date-language="es-ES"
              data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autocomplete="off" type="datetime-local"
              @blur="datosVehiculos()" v-model="horaInicio">
          </div>
          <div class="col-md-6">
            <input id="fechaFinal" name="fechaFinal" class="js-datepicker form-control form-icon-input-left form-corto"
              data-date-language="es-ES" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autocomplete="off"
              type="datetime-local" @blur="datosVehiculos()" v-model="horaFinal">
          </div>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <div class="row" style="display: inline-block;">
      <div class="tile_count">
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-car mr-2"></i>Total Particulares</span>
          <div class="count">{{conteoPlacas.conteo_placa_1}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-taxi mr-2"></i> Total Taxis</span>
          <div class="count">{{conteoPlacas.conteo_placa_2}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-trailer mr-2"></i> Total Camiones</span>
          <div class="count green">{{conteoPlacas.conteo_placa_3}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-motorcycle mr-2"></i> Total Motos</span>
          <div class="count">{{conteoPlacas.conteo_placa_4}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-car mr-2"></i> Ganacia Particulares</span>
          <div class="count">{{totalGanancias.total1}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-taxi mr-2"></i> Ganancia Taxis</span>
          <div class="count">{{totalGanancias.total2}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-trailer mr-2"></i>Ganancias Camiones</span>
          <div class="count">{{totalGanancias.total3}}</div>
        </div>
        <div class="col-md-3 col-sm-4  tile_stats_count">
          <span class="count_top"><i class="fa-solid fa-motorcycle mr-2"></i> Ganancias Motos</span>
          <div class="count">{{totalGanancias.total4}}</div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 col-sm-12">
        <div class="dashboard_graph">
          <div class="row x_title">
            <div class="col-md-7">
              <h3>Vehículos <small>Comparación Ganancias</small></h3>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-6">
              <canvas id="vehiculosComparacionGanancias"></canvas>
            </div>
            <div class="col-md-6">
              <p>La gráfica de comparación de ganancias muestra la distribución de ingresos por categoría de vehículo en
                el mismo período de tiempo. Estos datos son esenciales para analizar el desempeño financiero y tomar
                decisiones informadas en la gestión de la flota.</p>
            </div>
          </div>

          <div class="row">
            <div class="col-md-5">
              <h3>Vehículos <small>Comparación Placas</small></h3>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-sm-6">
              <canvas id="vehiculosComparacionPlacas"></canvas>
            </div>
            <div class="col-md-6">
              <p>La gráfica de comparación de placas ilustra el conteo de placas por tipo de vehículo en el mismo
                período de tiempo. Este análisis proporciona insights valiosos sobre la utilización de la flota y la
                distribución de vehículos en diferentes categorías.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script type="module" src="./src/js/dashboard.js"> </script>