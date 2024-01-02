<div id="appDashboard">
  <div class="container body">
    <div class="main_container">
      <input type="hidden" id="local" value="<?php echo $_SESSION['id_local'] ?>">

      <!-- page content -->
      <div class="right_col" role="main">
        <div class="">
          <div class="x_title">
            <h2>{{titulo}}</h2>
            <ul class="nav navbar-right panel_toolbox">
              <li style="margin-left:2.5rem;">
                <div class="col-md-6">
                <label >Fecha Inicial</label>
                  <input id="fechaInicial" name="fechaInicial" class="js-datepicker form-control" data-date-language="es-ES" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autocomplete="off" type="datetime-local" @blur="datosReporteria()" v-model="horaInicio">
                </div>
                <div class="col-md-6">
                <label>Fecha Final</label>
                  <input id="fechaFinal" name="fechaFinal" class="js-datepicker form-control form-icon-input-left form-corto" data-date-language="es-ES" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autocomplete="off" type="datetime-local" @blur="datosReporteria()" v-model="horaFinal">
                </div>
              </li>
            </ul>
            <div class="clearfix"></div>
          </div>
          <div class="row" style="display: inline-block;">
            <div class="top_tiles">

              <!-- Sección de Órdenes -->
              <div class="animated flipInY col-lg-3 col-md-3 col-sm-6">
                <div class="tile-stats">

                  <div class="count">{{totalOrdenes}} Ordenes</div>
                  <h3><i class="fa-solid fa-list-ul"></i> Órdenes</h3>
                  <p>Total de órdenes generadas en el sistema.</p>
                </div>
              </div>

              <!-- Sección de Total Bruto -->
              <div class="animated flipInY col-lg-3 col-md-3 col-sm-6">
                <div class="tile-stats">
                  <div class="icon"><i class="fa fa-comments-o"></i></div>
                  <div class="count">{{sumaTotales}}</div>
                  <h3><i class="fa-solid fa-money-bill-trend-up"></i> Total Bruto</h3>
                  <p>Total de ganancias generadas, excluyendo propinas.</p>
                </div>
              </div>

              <!-- Sección de Propinas -->
              <div class="animated flipInY col-lg-3 col-md-3 col-sm-6">
                <div class="tile-stats">
                  <div class="count">{{propinas}}</div>
                  <h3><i class="fa-solid fa-piggy-bank"></i> Propinas</h3>
                  <p>Total acumulado de propinas recibidas.</p>
                </div>
              </div>

              <!-- Sección de Total Neto -->
              <div class="animated flipInY col-lg-3 col-md-3 col-sm-6">
                <div class="tile-stats">
                  <div class="count">{{totalNeto}}</div>
                  <h3><i class="fa-solid fa-money-bill-transfer"></i> Total Neto</h3>
                  <p>Total de ganancias generadas, incluyendo propinas.</p>
                </div>
              </div>

            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="x_panel">
                <div class="x_title">
                  <h2>Ganancias Generadas <small>por Total de Ordenes</small></h2>
                  <div class="clearfix"></div>
                </div>
                <div class="x_content">
                  <div class="col-md-9 col-sm-12 ">

                    <div class="demo-container" style="height: 300px; width: 50vw;">
                      <canvas ref="chartOrdenes" class="demo-placeholder"></canvas>
                    </div>
                  </div>

                  <div class="col-md-3 col-sm-12 ">
                    <div>
                      <div class="x_title">
                        <h2>Pedidos Clientes</h2>
                        <div class="clearfix"></div>
                      </div>
                      <ul class="list-unstyled top_profiles scroll-view scroll-y">
                        <li v-for="c in clientes" :key="c.idOrden" class="media event">
                          <a class="pull-left border-aero profile_thumb">
                            <i class="fa-sharp fa-solid fa-user-tie"></i>
                          </a>
                          <div class="media-body">
                            <a class="title" href="#">{{c.nom_cliente}}</a>
                            <p><strong>Q{{c.total}} </strong> {{c.descripcion}} </p>
                            <p> <small>{{c.fecha_final}}</small>
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="x_panel">
                <div class="x_title">
                  <h2>Comparación Ordenes</h2>
                  <div class="clearfix"></div>
                </div>
                <div class="x_content">

                  <div class="row" style="border-bottom: 1px solid #E0E0E0; padding-bottom: 5px; margin-bottom: 5px;">
                    <div class="col-md-9 col-sm-12 ">

                      <div class="chart-container" style="height: 300px;">
                        <canvas ref="chartMeserosProductivos"></canvas>
                      </div>
                    </div>

                    <div class="col-md-3 col-sm-12 ">
                      <div>
                        <div class="x_title">
                          <h2>Observaciones Meseras</h2>
                          <div class="clearfix"></div>
                        </div>
                        <ul class="list-unstyled top_profiles scroll-view scroll-y">
                          <li v-for="o in observaciones" :key="o.id_orden" class="media event">
                            <a class="pull-left border-aero profile_thumb">
                              <i class="fa-sharp fa-solid fa-user-tie"></i>
                            </a>
                            <div class="media-body">
                              <a class="title" href="#">{{o.mesera}}</a>
                              <p><strong>Q{{o.propina}} </strong>{{o.nom_cliente}}:{{o.observacion}} </p>
                              <p> <small>{{o.fecha_final}}</small>
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="module" src="./src/js/dashboard.js"> </script>
<style>
  .scroll-y {
    max-height: 300px;
    /* Ajusta la altura máxima según tus necesidades */
    overflow-y: auto;
  }
</style>