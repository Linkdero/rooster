<div ref="idModal" id="getOrdenDetalle" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header" style="padding: .5rem .5rem;">
                <h5 class="modal-title text-primary" id="myModalLabel">Detalle de la Orden: #{{idOrden}} <i class="fas fa-burger-soda ml-2"></i></h5>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <ul class="pagination pagination-split">
                                <li><a href="#">DATOS CONSUMIDO</a></li>
                            </ul>
                        </div>
                    </div>

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
                                        <td class="text-center">
                                            <div v-if="o.descripcion == null">
                                                {{ o.nombre_equivalencia }}
                                            </div>
                                            <div v-else>
                                                {{ o.descripcion }}
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <div v-if="o.precio == null">
                                                Q{{ o.precio_equivalencia }}.00
                                            </div>
                                            <div v-else>
                                                Q{{ o.precio }}.00
                                            </div>
                                        </td>
                                        <td class="text-center">{{ o.cantidad }} U</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12 text-center">
                            <ul class="pagination pagination-split">
                                <li><a href="#">DATOS ORDEN</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="row profile_details">
                        <div class="col-sm-3 border-right">
                            <div class="row">
                                <div class="col-12"><small class="text-muted">PEDIDO NO. </small>
                                    <h5><strong>{{ '0' + (idOrden || 'Orden en proceso') }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">INICIO: </small>
                                    <h5><strong>{{ datosCliente.fecha_inicio || 'Orden en proceso' }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">FINAL: </small>
                                    <h5><strong>{{ datosCliente.fecha_final || 'Orden en proceso' }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">TOTAL BRUTO: </small>
                                    <h5><strong>{{ totalConsumido || 'Orden en proceso' }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">TOTAL NETO: </small>
                                    <h5><strong>{{ totalNeto || 'Orden en proceso' }}</strong></h5>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-12"><small class="text-muted">Observaciones: </small>
                                    <span class="badge badge-info">{{ datosCliente.observacion || 'Orden en proceso'
                                        }}</span>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-12"><small class="text-muted">NOMBRE CLIENTE: </small>
                                    <h5><strong>{{ datosCliente.nombre || 'Orden en proceso' }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">NIT: </small>
                                    <h5><strong>{{ datosCliente.nit || 'Orden en proceso' }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">DIRECCIÓN: </small>
                                    <h5><strong>{{ datosCliente.direccion || 'Orden en proceso' }}</strong></h5>
                                </div>
                                <div class="col-12"><small class="text-muted">Local: </small>
                                    <h5><strong>{{ datosCliente.locales || 'Orden en proceso' }}</strong></h5>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-3">
                            <div class="row">
                                <div class="col-12"><small class="text-muted">MESERA:</small>
                                    <h5><strong>{{ datosCliente.mesera || 'Orden en proceso' }}</strong></h5>
                                </div>
                            </div>

                            <div class="row" style="z-index: 1;">
                                <div class="col-12">
                                    <img :src="datosCliente.foto || 'ruta_por_defecto'" alt="Imagen de mesera" class="img-circle img-fluid" style="width: 100px; height: 100ox;  border: 5px solid #fff; border-radius: 50%;">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12"><small class="text-muted">PROPINA:</small>
                                    <h5><strong>{{ propina || 'Orden en proceso' }}</strong></h5>
                                </div>
                            </div>

                            <div class="row">
                                <form class="form-inline">
                                    <button type="button" class="btn btn-primary btn-floating rounded-circle" @click="imprimirTicket">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>