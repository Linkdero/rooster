<div id="appInventario">
    <div class="right_col" role="main">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <div class="row">
                            <div class="col-1">
                                <h2>{{tituloModulo}}</h2>
                                <input type="hidden" id="local" value="<?php echo $_SESSION['id_local'] ?>">
                            </div>
                            <div class="col">
                                <ul id="overallIncomeTabsControl" class="nav navbar-right panel_toolbox nav-tabs card-header-tabs ">
                                    <li class="nav-item mr-4">
                                        <a class="nav-link active" role="tab" aria-selected="false" data-toggle="tab" @click="cambiarTipoTabla(1)">
                                            <span class="d-none d-md-inline">Salidas</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" role="tab" aria-selected="false" data-toggle="tab" @click="cambiarTipoTabla(2)">
                                            <span class="d-none d-md-inline">Entradas</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" role="tab" aria-selected="false" data-toggle="tab" @click="cambiarTipoTabla(3)">
                                            <span class="d-none d-md-inline">Meseras</span>
                                        </a>
                                    </li>

                                    <li class="nav-item">
                                        <a class="nav-link" role="tab" aria-selected="false">
                                            <input id="fechaInicial" name="fechaInicial" class="date-picker form-control" data-date-language="es-ES" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autocomplete="off" type="datetime-local" @blur="cambiarTabla()" v-model="horaInicio">
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" role="tab" aria-selected="false">
                                            <input id="fechaFinal" name="fechaFinal" class="date-picker form-control" data-date-language="es-ES" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autocomplete="off" type="datetime-local" @blur="cambiarTabla()" v-model="horaFinal">
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>

                    <div v-show="tipoTabla==1">
                        <div class="card-body card-body-slide" width="100%" height="100%">
                            <table id="tblSalidas" class="table responsive table-sm table-bordered table-striped" width="100%">
                                <thead>
                                    <tr>
                                        <th class="text-center">#Orden</th>
                                        <th class="text-center">Fecha</th>
                                        <th class="text-center">Tipo</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Cantidad</th>
                                        <th class="text-center">Precio</th>
                                        <th class="text-center">Total</th>
                                        <th class="text-center">Restaurante</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>

                    <div v-show="tipoTabla==2">
                        <div class="card-body card-body-slide" width="100%" height="100%">
                            <table id="tblEntradas" class="table responsive table-sm table-bordered table-striped" width="100%">
                                <thead>
                                    <tr>
                                        <th class="text-center">ID Materia</th>
                                        <th class="text-center">Fecha</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Cantidad</th>
                                        <th class="text-center">Precio</th>
                                        <th class="text-center">Total</th>
                                        <th class="text-center">Restaurante</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>

                    <div v-show="tipoTabla==3">
                        <div class="card-body card-body-slide" width="100%" height="100%">
                            <table id="tblMeseras" class="table responsive table-sm table-bordered table-striped" width="100%">
                                <thead>
                                    <tr>
                                        <th class="text-center">Orden</th>
                                        <th class="text-center">Fecha</th>
                                        <th class="text-center">Mesera</th>
                                        <th class="text-center">Propina</th>
                                        <th class="text-center">Restaurante</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <iframe id="pdf_preview_v" hidden></iframe>
</div>
<script type="module" src="src/js/inventario.js"> </script>