<div id="setFinalizarMesa" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true"
    data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">Datos de la Mesa<i
                        class="fa-solid fa-burger-soda ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos de la Mesa</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="placas">Número de Mesa</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="number" class="input-sm form-control" id="idMesa" v-model="nroMesa"
                                    disabled>
                                <span class="input-group-text"><i class="fa-regular fa-list-ol"></i></span>
                            </div>
                        </div>
                        <div class="col">
                            <label for="nroPlacas">Referencia</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="referencia"
                                    v-model="referenciaMesa" disabled>
                                <span class="input-group-text"><i class="fa-solid fa-sign-hanging"></i></span>
                            </div>
                        </div>
                        <div class="col">
                            <label for="nroPlacas">Hora</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="time" class="input-sm form-control" id="hora" v-model="horaActual"
                                    disabled>
                                <span class="input-group-text"><i class="fa-solid fa-clock"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="x_title">
                        <div class="clearfix"></div>
                    </div>
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos Cliente</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="placas">Nombre Cliente</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="nombreCliente"
                                    v-model="nombreCliente">
                                <span class="input-group-text"><i class="fa-solid fa-signature"></i></span>
                            </div>
                        </div>
                        <div class="col">
                            <label for="nroPlacas">Nit Cliente</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="nitCliente" v-model="nitCliente">
                                <span class="input-group-text"><i class="fa-solid fa-hashtag"></i></span>
                            </div>
                        </div>
                        <div class="col">
                            <label for="nroPlacas">Dirección</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="direccionCliente"
                                    v-model="direccionCliente">
                                <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="descripcion">Observaciones</label>
                            <div
                                class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <textarea class="form-control" id="descripcion" rows="3"
                                    v-model="descripcion"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer" style="margin-bottom: -1rem;">
                <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i
                        class="fa-solid fa-circle-xmark ml-1"></i></button>
                <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos"
                    @click="generarVehiculo()">Finalizar Mesa <i class="fa-solid fa-octagon-plus ml-1"></i></button>
            </div>
        </div>
    </div>
</div>