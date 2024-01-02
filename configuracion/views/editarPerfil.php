<div id="appConfiguracion">
    <div class="right_col" role="main">
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>{{tituloModulo}}</h2>
                        <ul id="overallIncomeTabsControl" class="nav navbar-right panel_toolbox nav-tabs card-header-tabs ml-md-auto mt-3 mt-md-0">
                            <li class="nav-item mr-4">
                                <a class="nav-link active" @click="configuracion(1)" href="#editarPerfil" role="tab" aria-selected="false" data-toggle="tab">
                                    <span class="d-none d-md-inline">Editar Perfil</span>
                                </a>
                            </li>
                            <li v-if="tipoRoll == 1" class="nav-item">
                                <a class="nav-link" @click="configuracion(2)" href="#editarPerfiles" role="tab" aria-selected="false" data-toggle="tab" id="configuracion2">
                                    <span class="d-none d-md-inline">Editar Perfiles</span>
                                </a>
                            </li>
                            <li v-if="tipoRoll == 1" class="nav-item">
                                <a class="nav-link" @click="configuracion(3)" href="#editarPerfiles" role="tab" aria-selected="false" data-toggle="tab" id="configuracion3">
                                    <span class="d-none d-md-inline">Locales</span>
                                </a>
                            </li>
                            <input type="hidden" value=" <?php echo $_SESSION['id_roll'] ?>" id="idRoll">
                            <input type="hidden" value=" <?php echo $_SESSION['id'] ?>" id="idUsuario">
                        </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div v-if="tipoConfiguracion == 1">
                        <div class="row">
                            <div class="col-md-6 ">
                                <div class="x_panel">
                                    <div class="x_content">
                                        <form class="form-horizontal form-label-left">

                                            <div class="form-group row ">
                                                <label class="control-label col-md-3 col-sm-3 ">Usuario</label>
                                                <div class="col-md-9 col-sm-9 ">
                                                    <input type="text" class="form-control" placeholder="usuario" v-model="usuario">
                                                </div>
                                            </div>
                                            <div class="form-group row ">
                                                <label class="control-label col-md-3 col-sm-3 ">Nombre</label>
                                                <div class="col-md-9 col-sm-9 ">
                                                    <input type="text" class="form-control" placeholder="nombre" v-model="nombre">
                                                </div>
                                            </div>
                                            <div class="form-group row ">
                                                <label class="control-label col-md-3 col-sm-3 ">Apellido</label>
                                                <div class="col-md-9 col-sm-9 ">
                                                    <input type="text" class="form-control" placeholder="apellido" v-model="apellido">
                                                </div>
                                            </div>

                                            <div class="form-group row ">
                                                <label class="control-label col-md-3 col-sm-3 ">Contraseña</label>
                                                <div class="col-md-9 col-sm-9 ">
                                                    <input type="password" class="form-control" placeholder="password" v-model="password">
                                                </div>
                                            </div>
                                            <div v-if="idRoll == 1" class="form-group row ">
                                                <listado-permisos :evento="evento"> </listado-permisos>
                                                <div v-if="idPermiso != 1">
                                                    <listado-locales :evento="evento"> </listado-locales>
                                                </div>
                                            </div>
                                            <div class="ln_solid"></div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 ">
                                <div class="x_panel">
                                    <div class="x_content">
                                        <form class="form-horizontal form-label-left">
                                            <div class="form-group col  justify-content-center text-center">
                                                <button type="button" class="btn btn-outline-primary" id="uploadButton" @click="openImageUploader">Subir
                                                    Imagen</button>
                                                <h2>
                                                    <span class="badge text-info"><i class="fa-solid fa-image"></i></span>
                                                    <span class="badge">Imagen Previa</span>
                                                </h2>
                                                <img v-bind:src="foto" class="img-thumbnail rounded" id="previa" style="width: 150px; height: 150px;">
                                            </div>
                                            <div class="modal-footer" style="margin-bottom: -1rem;">
                                            </div>
                                        </form>
                                        <button class="btn btn-success btn-xs" :disabled="!camposCompletos" @click="actualizarUsuario">Actualizar <i class="fa-solid fa-user-plus ml-1"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div v-else-if="tipoConfiguracion == 2">
                        <div class="row">
                            <div class="col-md-12 col-sm-12">
                                <div class="x_panel">
                                    <div class="card-body card-body-slide" width="100%" height="100%">
                                        <table id="tblUsuariosList" class="table responsive table-sm table-bordered table-striped" width="100%">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">ID</th>
                                                    <th class="text-center">Usuario</th>
                                                    <th class="text-center">Nombre</th>
                                                    <th class="text-center">Roll</th>
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
                    <div v-if="tipoConfiguracion == 3">
                        <div class="row">
                            <div class="col-md-6 ">
                                <div class="x_panel">
                                    <div class="x_content">
                                        <form class="form-horizontal form-label-left">

                                            <div class="form-group row ">
                                                <label class="control-label col-md-3 col-sm-3 ">Nombre Local</label>
                                                <div class="col-md-9 col-sm-9 ">
                                                    <input type="text" class="form-control" placeholder="Local" v-model="nombreLocal">
                                                </div>
                                            </div>
                                        </form>
                                        <button class="btn btn-success btn-xs" :disabled="!camposCompletos2" @click="setAgregarLocal">Agregar Local <i class="fa-solid fa-user-plus ml-1"></i></button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 ">
                                <div class="x_panel">
                                    <div class="row">
                                        <div class="col-md-12 profile_details">
                                            <table id="tblLocales" class="table responsive table-sm table-bordered table-striped" width="100%">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">ID</th>
                                                        <th class="text-center">Nombre</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(l, index) in locales" :key="index">
                                                        <td class="text-center">{{ l.id }}</td>
                                                        <td class="text-center">{{ l.nombre }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
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
<script type="module" src="./configuracion/src/configuracion.js"> </script>
<script src="./configuracion/src/functions.js"> </script>