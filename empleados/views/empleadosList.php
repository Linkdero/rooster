<div id="appMeseras">
    <div class="right_col" role="main">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>{{tituloModulo}}</h2>
                        <input type="hidden" id="permiso" value="<?php echo $_SESSION['id_roll'] ?>">
                        <input type="hidden" id="local" value="<?php echo $_SESSION['id_local'] ?>">
                        <ul class="nav navbar-right panel_toolbox">
                            <a href="#" class="mt-1" style="margin-left:2.5rem;" @click="modalNuevoEmpleado()"><i class="fa-solid fa-user-plus"></i></a>
                        </ul>
                        <div class="clearfix"></div>
                    </div>

                    <div class="card-body card-body-slide" width="100%" height="100%">
                        <table id="tblEmpleados" class="table responsive table-sm table-bordered table-striped" width="100%">
                            <thead>
                                <tr>
                                    <th class="text-center">Foto</th>
                                    <th class="text-center">ID</th>
                                    <th class="text-center">Nombre</th>
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
    <?php include 'modalNuevoEmpleado.php'; ?>

</div>
<script type="module" src="./componentes/eventBus.js"> </script>
<script type="module" src="./empleados/src/empleadosList.js"> </script>