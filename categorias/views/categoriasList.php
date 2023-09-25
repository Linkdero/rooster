<div id="appCategorias">
    <div class="right_col" role="main">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>{{tituloModulo}}</h2>
                        <ul id="overallIncomeTabsControl" class="nav navbar-right panel_toolbox nav-tabs card-header-tabs ml-md-auto mt-3 mt-md-0">
                            <li class="nav-item mr-4">
                                <a class="nav-link active" @click="cargarTablaMenus(1)" href="#editarPerfil" role="tab" aria-selected="false" data-toggle="tab">
                                    <span class="d-none d-md-inline">Menú</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" @click="cargarTablaMenus(2)" href="#editarPerfiles" role="tab" aria-selected="false" data-toggle="tab" id="configuracion2">
                                    <span class="d-none d-md-inline">Sub Menú</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" @click="cargarTablaMenus(3)" href="#editarPerfiles" role="tab" aria-selected="false" data-toggle="tab" id="configuracion2">
                                    <span class="d-none d-md-inline">Comidas</span>
                                </a>
                            </li>
                        </ul>

                        <div class="clearfix"></div>
                    </div>

                    <div class="card-body card-body-slide" width="100%" height="100%">
                        <table id="tblCatagorias" class="table responsive table-sm table-bordered table-striped" width="100%">
                            <thead>
                                <tr>
                                    <th class="text-center">ID</th>
                                    <th class="text-center">Categorias</th>
                                    <th class="text-center">Catalogos</th>
                                    <th class="text-center">Estados</th>
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

    <?php include 'modalCatalogos.php'; ?>

</div>
<script type="module" src="./categorias/src/categoriasList.js"> </script>