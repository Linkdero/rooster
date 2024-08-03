<template>
    <div class="col profile_details">
        <table id="tblOrdenDetalle" class="table responsive table-sm table-bordered table-striped" width="100%">
            <thead>
                <tr>
                    <th class="text-center">Num.Insumo</th>
                    <th class="text-center">Tipo Insumo</th>
                    <th class="text-center">Descripcion</th>
                    <th class="text-center">Precio</th>
                    <th class="text-center">Cantidades</th>
                    <th class="text-center">Estado</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(o, index) in ordenDetalle" :key="index">
                    <td class="text-center fw-bold" :class="o.estado_insumo == 0 ? 'text-danger' : 'text-primary'">
                        {{ o.reg_num }}</td>
                    <td class="text-center fw-bold" :class="o.estado_insumo == 0 ? 'text-danger' : 'text-primary'">
                        {{ o.tipo_producto }}</td>
                    <td class="text-center fw-bold" :class="o.estado_insumo == 0 ? 'text-danger' : 'text-primary'">
                        <div v-if="o.descripcion == null">
                            {{ o.nombre_equivalencia }}
                        </div>
                        <div v-else>
                            {{ o.descripcion }}
                        </div>
                    </td>
                    <td class="text-center fw-bold" :class="o.estado_insumo == 0 ? 'text-danger' : 'text-primary'">
                        <div v-if="o.precio == null">
                            Q{{ o.precio_equivalencia }}.00
                        </div>
                        <div v-else>
                            Q{{ o.precio }}.00
                        </div>
                    </td>
                    <td class="text-center fw-bold" :class="o.estado_insumo == 0 ? 'text-danger' : 'text-primary'">{{
                    o.cantidad }} U</td>
                    <td class="text-center">
                        <button type="button" class="btn-sm"
                            :class="o.estado_insumo == 0 ? 'btn btn-outline-primary' : 'btn btn-outline-danger'"
                            @click="setActualizarEstadoInsumo(o.estado_insumo, o.id_producto, o.id_tipo, o.id_orden)">
                            {{ o.estado_insumo == 0 ? 'Activar' : 'Cancelar' }} {{ o.id_producto }} </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

module.exports = {
    props: ['evento', 'tipo', 'mesa', 'orden'],

    data() {
        return {
            ordenDetalle: ''
        }
    },
    watch: {

    },
    mounted() {
        this.getOrdenDetalleInsumos()
    },
    methods: {
        getOrdenDetalleInsumos() {
            let id;
            if (this.tipo == 1)
                id = this.mesa
            else
                id = this.orden
            axios.get(`mesas/src/components/model/ordenDetalleInsumos.php`, {
                params: {
                    opcion: 1,
                    id: id,
                    tipo: this.tipo,
                }
            }).then(response => {
                console.log(response.data)
                this.ordenDetalle = response.data;
            }).catch(error => {
                console.error(error);
            });
        },
        setActualizarEstadoInsumo(estado, id, tipo, orden) {
            var formData = new FormData();
            formData.append('opcion', 6);
            formData.append('estado', estado);
            formData.append('id', id);
            formData.append('tipo', tipo);
            // Realizar la solicitud POST al servidor
            axios.post('./mesas/model/ordenesList.php', formData)
                .then(response => {
                    console.log(response.data);
                    Swal.fire({
                        icon: 'success',
                        title: response.data.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.evento.$emit('recargar-orden-detalle');
                })
                .catch(error => {
                    console.error(error);
                });
        },
    }
}
</script>
