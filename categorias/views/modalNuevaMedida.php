<div ref="idModal" id="setNuevaMedida" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
    aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">{{nombreModal}}<i
                        class="fa-solid fa-rectangle-list ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <div class="card-body card-body-slide" width="100%" height="100%">
                    <div class="row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Descripción de la Medida</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="descripcion">Descripción</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input class="btn btn-outline-primary form-control btn-xs" id="descripcion" rows="3"
                                    v-model="descripcion">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="margin-bottom: -1rem;">
                <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i
                        class="fa-solid fa-circle-xmark ml-1"></i></button>
                <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos"
                    @click="setNuevaMedida()">Generar Medida <i class="fa-solid fa-octagon-plus ml-1"></i></button>
            </div>
        </div>
    </div>
</div>