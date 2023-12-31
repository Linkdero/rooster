<div ref="idModal" id="setNuevaCategoria" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">{{nombreModal}}<i class="fa-solid fa-rectangle-list ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <div class="card-body card-body-slide" width="100%" height="100%">

                    <div v-if="tipoTabla == 2" class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos Sub Menú </h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <listado-menus :evento="evento" :tipo="2"> </listado-menus>
                        </div>
                    </div>
                    <div v-if="tipoTabla == 3" class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Comida </h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <listado-sub-menus :evento="evento" :tipo="2"> </listado-sub-menus>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Descripción de {{tipoCategoria}}</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="descripcion">Descripción</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <textarea class="form-control" id="descripcion" rows="3" v-model="descripcion"></textarea>
                            </div>
                        </div>
                        <div v-if="idLocalSesion == 3">
                            <listado-locales :evento="evento"> </listado-locales>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="margin-bottom: -1rem;">
                <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i class="fa-solid fa-circle-xmark ml-1"></i></button>
                <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos" @click="setNuevaCategoria()">Generar {{tipoCategoria}} <i class="fa-solid fa-octagon-plus ml-1"></i></button>
            </div>
        </div>
    </div>
</div>