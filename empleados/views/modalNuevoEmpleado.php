<div ref="idModal" id="setNuevoEmpleado" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">{{tituloModal}} <i class="fa-solid fa-burger-soda ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <div class="col-md-6 ">
                    <div class="x_panel">
                        <div class="x_title">
                            <h2>{{tituloModal}}</h2> {{idLocal}}
                            <div class="clearfix"></div>
                        </div>
                        <div class="x_content">
                            <br />
                            <form class="form-horizontal form-label-left">

                                <div class="form-group row ">
                                    <label class="control-label col-md-3 col-sm-3 ">Nombre Apellido </label>
                                    <div class="col-4">
                                        <input type="text" class="form-control" placeholder="nombre" v-model="nombre">
                                    </div>
                                    <div class="col-4">
                                        <input type="text" class="form-control" placeholder="apellido" v-model="apellido">
                                    </div>
                                </div>

                                <div class="form-group row ">
                                    <label class="control-label col-md-3 col-sm-3 ">Dirección </label>
                                    <div class="col">
                                        <textarea class="form-control" id="direccion" rows="3" v-model="direccion"></textarea>
                                    </div>
                                </div>
                                <div class="ln_solid"></div>

                                <div class="form-group row ">
                                    <listado-plazas :evento="evento"> </listado-plazas>
                                    <div v-if="idPermiso == 1">
                                        <listado-locales :evento="evento"> </listado-locales>
                                    </div>
                                </div>
                                <div v-if="tipoModal == 2" class="form-group row ">
                                    <div class="col">
                                        <label class="control-label col-md-3 col-sm-3 ">Plaza Actual </label>
                                        <input disabled type="text" class="form-control" v-model="plazaActual">
                                    </div>
                                    <div class="col">
                                        <label class="control-label col-md-3 col-sm-3 ">Local Actual </label>
                                        <input disabled type="text" class="form-control" v-model="localActual">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 ">
                    <div class="x_panel">
                        <div class="x_title">
                            <h2>Subir Fotografia</h2>
                            <div class="clearfix"></div>
                        </div>
                        <div class="x_content">
                            <br />
                            <form class="form-horizontal form-label-left">
                                <div class="form-group col  justify-content-center text-center">
                                    <button type="button" class="btn btn-outline-primary" id="uploadButton" @click="openImageUploader">Subir Imagen</button>
                                    <h2>
                                        <span class="badge text-info"><i class="fa-solid fa-image"></i></span>
                                        <span class="badge">Imagen Previa</span>
                                    </h2>
                                    <img v-bind:src="foto" class="img-thumbnail rounded" id="previa" style="width: 150px; height: 150px;">
                                </div>
                                <div class="modal-footer" style="margin-bottom: -1rem;">
                                </div>
                            </form>
                            <button class="btn btn-success btn-xs" :disabled="!camposCompletos" @click="crearEmpleado">Crear <i class="fa-solid fa-user-plus ml-1"></i></button>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>

        </div>
    </div>
</div>