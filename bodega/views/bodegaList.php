<div id="appBodega">
    <div class="right_col" role="main">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>{{tituloModulo}}</h2>
                        <input type="hidden" id="local" value="<?php echo $_SESSION['id_local'] ?>">
                        <ul class="nav navbar-right panel_toolbox">
                            <a href="#" class="mt-1" style="margin-left:1.5rem;" @click="modalNuevaMateriaPrima()" title="Nuevo Insumo Bodega"><i class="fa-solid fa-circle-plus"></i></a>
                            <a href="#" class="mt-1" style="margin-left:1.5rem;" @click="modalNuevoIngreso()" title="Nuevo Ingreso a la Bodega"><i class="fa-solid fa-cart-plus"></i></a>
                        </ul>
                        <div class="clearfix"></div>
                    </div>

                    <div class="card-body card-body-slide" width="100%" height="100%">
                        <table id="tblBodega" class="table responsive table-sm table-bordered table-striped" width="100%">
                            <thead>
                                <tr>
                                    <th class="text-center">ID</th>
                                    <th class="text-center">Medida</th>
                                    <th class="text-center">Descripción</th>
                                    <th class="text-center">Precio</th>
                                    <th class="text-center">Existencias</th>
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
    <?php include 'modalNuevaMateriaPrima.php'; ?>
    <?php include 'modalEquivalencias.php'; ?>
</div>
<script type="module" src="./bodega/src/bodegaList.js"> </script>