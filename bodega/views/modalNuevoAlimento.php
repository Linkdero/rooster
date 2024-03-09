<div ref="idModal" id="setNuevoAlimento" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-primary" id="myModalLabel">{{nombreModal}}: {{idAlimento}} <i class="fa-solid fa-utensils ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
                <input type="hidden" id="local" value="<?php echo $_SESSION['id_local'] ?>">
            </div>
            <div class="modal-body" style="padding: 0;">
                <div class="card-body card-body-slide" width="100%" height="100%">
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos Alimento</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="col">
                                <label for="insumos">Nombre</label>
                                <input type="text" class="btn btn-outline-primary form-control btn-xs" v-model="nombre"/>
                            </div>
                            <div class="col">
                                <label for="insumos">Descripción</label>
                                <input type="text" class="btn btn-outline-primary form-control btn-xs" v-model="descripcion"/>
                            </div>
                            <div class="col">
                                <label for="insumos">Precio</label>
                                <input type="number" class="btn btn-outline-primary form-control btn-xs" v-model="precio"/>
                            </div>
                            <listado-locales v-if="idLocalSesion == 3" :evento="evento"></listado-locales>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="margin-bottom: -1rem;">
                    <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i class="fa-solid fa-circle-xmark ml-1"></i></button>
                    <button type="button" class="btn btn-xs" :class="tipoModal == 1 ? 'btn-primary' : 'btn-success' " :disabled="!camposCompletos" @click="tipoModal == 1 ? setNuevoAlimento() : setActualizarAlimento()">{{tipoModal == 1 ? 'Generar Nuevo Alimento' : 'Actualizar Alimento'}} <i class="fa-solid fa-octagon-plus ml-1"></i></button>
                </div>
            </div>
        </div>
    </div>
</div>