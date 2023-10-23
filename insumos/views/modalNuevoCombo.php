<div ref="idModal" id="setNuevoCombo" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">{{nombreCombo}}<i class="fa-solid fa-rectangle-list ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <div class="card-body card-body-slide" width="100%" height="100%">
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Estructuración Combo</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <listado-insumos :tipo="2" :modal="idModal" :evento="evento"></listado-insumos>
                            <div class="col">
                                <label for="cantidades">Cantidades</label>
                                <input type="number" v-model="cantidades" class="btn btn-outline-primary form-control btn-xs" />
                            </div>

                            <div class="col-2">
                                <label for="insumos">Agregar</label>
                                <button type="button" class="btn btn-outline-primary form-control btn-xs" @click="agregarFila()">
                                    <i class="fa-solid fa-circle-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card-body card-body-slide" width="100%" height="100%">
                                <table id="tblInsumos" class="table responsive table-sm table-bordered table-striped" width="100%">
                                    <thead>
                                        <tr>
                                            <th class="text-center">ID</th>
                                            <th class="text-center">Insumo</th>
                                            <th class="text-center">Cantidades</th>
                                            <th class="text-center">Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(fila, index) in filasInsumos" :key="index">
                                            <td class="text-center">{{ fila.idInsumo }}</td>
                                            <td class="text-center">{{ fila.nombreInsumo }}</td>
                                            <td class="text-center">
                                                <input type="number" class="form-control" v-model="fila.cantidad" @input="actualizarCantidadTotal(index)">
                                            </td>
                                            <td class="text-center">
                                                <button type="button" class="btn btn-outline-danger" @click="eliminarFila(index)">
                                                    <i class="fa-solid fa-trash-xmark"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{ width: progreso + '%' }" aria-valuenow="progreso" aria-valuemin="0" aria-valuemax="100">{{ progreso }}%</div>
                                </div>

                            </div>
                        </div>
                        <div class="col-12">
                            <label for="cantidades">Precio</label>
                            <input type="number" v-model="precio" class="btn btn-outline-primary form-control btn-xs" />
                        </div>
                        <div class="col">
                            <label for="descripcion">Descripción</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <textarea class="form-control" id="descripcion" rows="3" v-model="descripcion"></textarea>
                            </div>
                        </div>
                        <div v-if="idLocalSesion == 3">
                            <listado-locales :evento="evento"> </listado-locales> {{idLocal}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="margin-bottom: -1rem;">
                <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i class="fa-solid fa-circle-xmark ml-1"></i></button>
                <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos" @click="setNuevoCombo()">Generar Combo <i class="fa-solid fa-octagon-plus ml-1"></i></button>
            </div>
        </div>
    </div>
</div>