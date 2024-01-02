<div ref="idModal" id="setMesasModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">Datos de la Mesa<i class="fa-solid fa-burger-soda ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <div v-if="tipoModal != 3">
                    <?php include 'datosMesa.php'; ?>
                    <div class="x_title">
                        <div class="clearfix"></div>
                    </div>
                </div>

                <div v-if="tipoModal == 3">
                    <div class="row">
                        <div class="col-md-12 profile_details">
                            <table id="tblOrdenDetalle" class="table responsive table-sm table-bordered table-striped" width="100%">
                                <thead>
                                    <tr>
                                        <th class="text-center">Num.Insumo</th>
                                        <th class="text-center">Tipo Insumo</th>
                                        <th class="text-center">Descripcion</th>
                                        <th class="text-center">Precio</th>
                                        <th class="text-center">Cantidades</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(o, index) in ordenDetalle" :key="index">
                                        <td class="text-center">{{ o.reg_num }}</td>
                                        <td class="text-center">{{ o.tipo_producto }}</td>
                                        <td class="text-center">{{ o.descripcion }}</td>
                                        <td class="text-center">Q{{ o.precio }}.00</td>
                                        <td class="text-center">{{ o.cantidad }} U</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div v-if="tipoModal == 1 || tipoModal == 3">
                    <div class="form-row">
                        <div class="col-12">
                            <div class="x_title">
                                <h2>Datos Comida</h2>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="input-group">
                            <div class="col-3">
                                <label for="insumos">Tipo Selección</label>
                                <select id="tipoSeleccion" class="form-control btn-xs" v-model="seleccionComidas">
                                    <option></option>
                                    <option value="1">Materia Prima</option>
                                    <option value="2">Comida</option>
                                    <option value="3">Combo</option>

                                </select>
                            </div>
                            <div class="col-4" v-if="seleccionComidas == 1">
                                <div class="row">
                                    <listado-materias-primas :tipo="1" :modal="idModal" :evento="evento"></listado-materias-primas>
                                </div>
                            </div>

                            <div class="col-4" v-if="seleccionComidas == 2">
                                <div class="row">
                                    <listado-comidas :tipo="2" :modal="idModal" :evento="evento"></listado-comidas>

                                    <listado-insumos :tipo="3" :modal="idModal" :evento="evento"></listado-insumos>

                                </div>

                            </div>

                            <div class="col-4" v-if="seleccionComidas == 3">
                                <div class="row">
                                    <listado-combos :tipo="2" :modal="idModal" :evento="evento"></listado-combos>
                                </div>
                            </div>

                            <div class="col">
                                <label for="cantidades">Cantidades</label>
                                <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                    <input type="number" class="input-sm form-control" id="cantidades">
                                    <span class="input-group-text"><i class="fa-sharp fa-regular fa-fork-knife"></i></span>
                                </div>
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
                                            <th class="text-center">Precio U</th>
                                            <th class="text-center">Total</th>
                                            <th class="text-center">Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(fila, index) in filasInsumos" :key="index">
                                            <td class="text-center">{{ fila.idInsumo }}</td>
                                            <td class="text-center">{{ fila.nombreInsumo }}</td>
                                            <td class="text-center">
                                                <input type="number" class="form-control" v-model="fila.cantidad" @input="actualizarPrecioTotal(index)">
                                            </td>
                                            <td class="text-center">Q{{ fila.precioInsumo }}.00</td>
                                            <td class="text-center">Q{{ fila.precioTotal }}.00</td>
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
                        <input type="hidden" id="precio" class="btn btn-outline-primary form-control btn-xs" v-model="precio" />

                        <div class="col">
                            <div v-if="tipoModal != 3">
                                <label for="descripcion">Descripción</label>
                                <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                    <textarea class="form-control" id="descripcion" rows="3" v-model="descripcion"></textarea>
                                </div>
                                <listado-empleados :tipo="2" :modal="idModal" :evento="evento"></listado-empleados>
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
                            <label for="nroPlacas">Nit Cliente</label>
                            <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                <input type="number" class="input-sm form-control" id="nitCliente" v-model="nitCliente">
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
                <div v-if="tipoModal == 1">
                    <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos1" @click="generarOrden()">Generar Orden<i class="fa-solid fa-octagon-plus ml-1"></i></button>
                </div>
                <div v-if="tipoModal == 2">
                    <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos2" @click="finalizarMesa()">Finalizar Orden<i class="fa-solid fa-octagon-plus ml-1"></i></button>
                </div>
                <div v-if="tipoModal == 3">
                    <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos4" @click="actualizarMesa()">Actualizar Orden <i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </div>
        </div>
    </div>
</div>