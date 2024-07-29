<div id="appMesas">
    <div class="right_col" role="main">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>{{tituloModulo}}</h2>
                        <input type="hidden" id="local" value="<?php echo $_SESSION['id_local'] ?>">
                        <ul class="nav navbar-right panel_toolbox">
                            <a href="#" class="mt-1" style="margin-left:2.5rem;" @click="modalNuevaMesa()"><i class="fa-solid fa-table-picnic"></i></a>
                        </ul>
                        <div class="clearfix"></div>
                    </div>

                    <div class="card-body card-body-slide" width="100%" height="100%">
                        <table id="tblmesaList" class="table responsive table-sm table-bordered table-striped" width="100%">
                            <thead>
                                <tr>
                                    <th class="text-center">ID</th>
                                    <th class="text-center">Referencia</th>
                                    <th class="text-center">Local</th>
                                    <th class="text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <iframe id="pdf_preview_v" hidden></iframe>
    <modal-mesas :evento="evento" :key="key" :mesa="idMesaSeleccionada" :tipo="idTipo"> </modal-mesas>

    <?php include 'modalNuevaMesa.php'; ?>
</div>
<script type="module" src="./mesas/src/mesasList.js"> </script>