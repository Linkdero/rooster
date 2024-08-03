<template>
    <div ref="idModal" id="setMesasModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
        aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="padding: .5rem .5rem;">
                    <h5 class="modal-title text-primary" id="myModalLabel">Datos de la Mesa<i
                            class="fa-solid fa-burger-soda ml-2"></i></h5>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
                </div>
                <div class="modal-body">
                    <div v-if="tipo != 3 && tipo != 4">
                        <datos-mesa :evento="evento" :mesa="mesa" :key="key"></datos-mesa>
                        <div class="x_title">
                            <div class="clearfix"></div>
                        </div>
                    </div>

                    <div v-if="tipo == 3">
                        <orden-detalle-insumos :tipo="1" :evento="evento" :mesa="mesa"
                            :key="key"></orden-detalle-insumos>
                    </div>

                    <div v-if="tipo == 1 || tipo == 3 || tipo == 4">
                        <div class="form-row">
                            <div class="col-12">
                                <div class="x_title">
                                    <h2>Datos Comida</h2>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="input-group">
                                <tipo-seleccion :evento="evento" :tipo="tipo"></tipo-seleccion>
                                <listado-materias-primas v-if="seleccionComidas == 1" :tipo="1" :modal="idModal"
                                    :evento="evento" :local="idLocal"></listado-materias-primas>

                                <div class="col" v-if="seleccionComidas == 2">
                                    <div class="row">
                                        <listado-comidas :tipo="2" :local="idLocal" :evento="evento"></listado-comidas>

                                        <listado-insumos :tipo="3" :local="idLocal" :evento="evento"></listado-insumos>

                                    </div>

                                </div>

                                <listado-combos v-if="seleccionComidas == 3" :tipo="2" :local="idLocal"
                                    :evento="evento"></listado-combos>

                                <listado-alimentos v-if="seleccionComidas == 4" :tipo="1" :local="idLocal"
                                    :evento="evento"></listado-alimentos>

                                <div v-if="(validarEquivalencia != 0) && tipo != 4">
                                    <div class="col">
                                        <label for="cantidades">Equivalencia</label>
                                        <br>
                                        <label class="switch">
                                            <input type="checkbox" v-model="estadoEquivalencia">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                <div v-show="!estadoEquivalencia" class="col">
                                    <label for="cantidades">Cantidades</label>
                                    <div
                                        class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                        <input type="number" class="input-sm form-control" id="cantidades">
                                        <span class="input-group-text"><i
                                                class="fa-sharp fa-regular fa-fork-knife"></i></span>
                                    </div>
                                </div>
                                <div v-show="estadoEquivalencia" class="col">
                                    <listado-equivalencias :tipo="1" :local="idLocal"
                                        :evento="evento"></listado-equivalencias>
                                </div>

                                <div class="col-2">
                                    <label for="insumos">Agregar</label>
                                    <button type="button" class="btn btn-outline-primary form-control btn-xs"
                                        @click="agregarFila()">
                                        <i class="fa-solid fa-circle-plus"></i>
                                    </button>
                                </div>
                                <div class="col-12 mt-1">
                                    <listado-empleados v-if="idLocal != 0" :tipo="2" :evento="evento"
                                        :local="idLocal"></listado-empleados>
                                </div>
                            </div>

                            <div class="col-12" v-if="tipo != 4">
                                <div class="card-body card-body-slide" width="100%" height="100%">
                                    <table id="tblInsumos"
                                        class="table responsive table-sm table-bordered table-striped" width="100%">
                                        <thead>
                                            <tr>
                                                <th class="text-center">ID</th>
                                                <th class="text-center">Insumo</th>
                                                <th class="text-center">Cantidades</th>
                                                <th class="text-center">Precio U</th>
                                                <th class="text-center">Total</th>
                                                <th class="text-center">Eliminar</th>
                                                <th class="text-center">Equivalencia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(fila, index) in filasInsumos" :key="index">
                                                <td class="text-center">{{ fila.idInsumo }}</td>
                                                <td class="text-center">{{ fila.nombreInsumo }}</td>
                                                <td class="text-center">
                                                    <div v-if="fila.equivalencia">
                                                        <input type="number" disabled class="form-control"
                                                            v-model="fila.cantidad"
                                                            @input="actualizarPrecioTotal(index)">
                                                    </div>
                                                    <div v-else>
                                                        <input type="number" class="form-control"
                                                            v-model="fila.cantidad"
                                                            @input="actualizarPrecioTotal(index)">
                                                    </div>
                                                </td>
                                                <td class="text-center">Q{{ fila.precioInsumo }}.00</td>
                                                <td class="text-center">Q{{ fila.precioTotal }}.00</td>
                                                <td class="text-center">
                                                    <button type="button" class="btn btn-outline-danger"
                                                        @click="eliminarFila(index)">
                                                        <i class="fa-solid fa-trash-xmark"></i>
                                                    </button>
                                                </td>
                                                <td class="text-center">
                                                    <div v-if="fila.equivalencia">Si</div>
                                                    <div v-else>No</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar" :style="{ width: progreso + '%' }"
                                            aria-valuenow="progreso" aria-valuemin="0" aria-valuemax="100">{{ progreso
                                            }}%</div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-12 " v-if="tipo == 4">
                                <div class="card-body card-body-slide" width="100%" height="100%">

                                    <table id="tblTragoChicas"
                                        class="table responsive table-sm table-bordered table-striped" width="100%">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Correlativo</th>
                                                <th class="text-center">Descripcion</th>
                                                <th class="text-center">Precio</th>
                                                <th class="text-center">Cantidades</th>
                                                <th class="text-center">Chica</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(t, index) in tragoChicas" :key="index">
                                                <td class="text-center fw-bold">{{ t.correlativo }}</td>
                                                <td class="text-center fw-bold">{{ t.materia_prima }}</td>
                                                <td class="text-center fw-bold">
                                                    <input type="number" class="form-control form-control-sm"
                                                        v-model="t.precio">
                                                </td>
                                                <td class="text-center fw-bold">
                                                    <input type="number" class="form-control form-control-sm"
                                                        v-model="t.cantidad">
                                                </td>
                                                <td class="text-center fw-bold">{{ t.nombre_mesera }}</td>

                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="progress">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar" :style="{ width: progreso + '%' }"
                                            aria-valuenow="progreso" aria-valuemin="0" aria-valuemax="100">{{ progreso
                                            }}%</div>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="precio" class="btn btn-outline-primary form-control btn-xs"
                                v-model="precio" />

                            <div class="col">
                                <div v-if="tipo != 3 && tipo != 4">
                                    <label for="descripcion">Descripción</label>
                                    <div
                                        class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                        <textarea class="form-control" id="descripcion" rows="3"
                                            v-model="descripcion"></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div v-if="tipo == 2">
                        <div class="form-row">
                            <div class="col-12">
                                <div class="x_title">
                                    <h2>Datos Cliente</h2>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="col">
                                <label for="nroPlacas">Nit Cliente</label>
                                <div
                                    class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                                    <input type="number" class="input-sm form-control" id="nitCliente"
                                        v-model="nitCliente">
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
                    </div>
                </div>
                <div class="modal-footer" style="margin-bottom: -1rem;">
                    <button type="button" class="btn btn-danger btn-xs" data-dismiss="modal">Cerrar <i
                            class="fa-solid fa-circle-xmark ml-1"></i></button>
                    <div v-if="tipo == 1">
                        <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos1"
                            @click="generarOrden()">Generar Orden<i class="fa-solid fa-octagon-plus ml-1"></i></button>
                    </div>
                    <div v-if="tipo == 2">
                        <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos2"
                            @click="finalizarMesa()">Finalizar Orden<i
                                class="fa-solid fa-octagon-plus ml-1"></i></button>
                        <button type="button" class="btn btn-success btn-xs" @click="finalizarMesa()">Consumidor Final<i
                                class="fa-solid fa-octagon-plus ml-1"></i></button>
                    </div>
                    <div v-if="tipo == 3">
                        <button type="button" class="btn btn-primary btn-xs" :disabled="!camposCompletos4"
                            @click="actualizarMesa()">Actualizar Orden <i
                                class="fa-solid fa-pen-to-square"></i></button>
                    </div>
                    <div v-if="tipo == 4">
                        <button type="button" class="btn btn-primary btn-xs" @click="actualizarTragos()">Actualizar
                            Tragos <i class="fa-solid fa-glass"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="module" src="./mesas/src/components/js/modalMesas.js"></script>