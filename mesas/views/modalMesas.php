<div id="setMesasModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">Datos de la Mesa<i class="fa-solid fa-burger-soda ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <?php include 'datosMesa.php'; ?>

                <div class="x_title">
                    <div class="clearfix"></div>
                </div>

                <div v-if="tipoModal == 1">
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos Comida</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="col">
                                <select class="select2_single form-control btn-xs" tabindex="-1">
                                    <option value="">Menú</option>
                                </select>
                            </div>
                            <div class="col">
                                <select class="select2_single form-control btn-xs" tabindex="-1">
                                    <option value="">Cómida</option>

                                </select>
                            </div>
                            <div class="col">
                                <select class="select2_single form-control btn-xs" tabindex="-1">
                                    <option></option>
                                    <option value="AK">Alaska</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="CA">California</option>
                                    <option value="NV">Nevada</option>
                                    <option value="OR">Oregon</option>
                                    <option value="WA">Washington</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="CO">Colorado</option>
                                    <option value="ID">Idaho</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="UT">Utah</option>
                                    <option value="WY">Wyoming</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TX">Texas</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="descripcion">Observaciones</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <textarea class="form-control" id="descripcion" rows="3" v-model="descripcion"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="tipoModal == 2">
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos Cliente</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="placas">Nombre Cliente</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="nombreCliente" v-model="nombreCliente">
                                <span class="input-group-text"><i class="fa-solid fa-signature"></i></span>
                            </div>
                        </div>
                        <div class="col">
                            <label for="nroPlacas">Nit Cliente</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="nitCliente" v-model="nitCliente">
                                <span class="input-group-text"><i class="fa-solid fa-hashtag"></i></span>
                            </div>
                        </div>
                        <div class="col">
                            <label for="nroPlacas">Dirección</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="text" class="input-sm form-control" id="direccionCliente" v-model="direccionCliente">
                                <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="descripcion">Observaciones</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <textarea class="form-control" id="descripcion" rows="3" v-model="descripcion"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="margin-bottom: -1rem;">
                <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i class="fa-solid fa-circle-xmark ml-1"></i></button>
                <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos" @click="generarVehiculo()">Finalizar Mesa <i class="fa-solid fa-octagon-plus ml-1"></i></button>
            </div>
        </div>
    </div>
</div>