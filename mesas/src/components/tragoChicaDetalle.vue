<template>
    <div class="col">
        <div class="card-body card-body-slide" width="100%" height="100%">

            <table id="tblTragoChicas" class="table responsive table-sm table-bordered table-striped" width="100%">
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
                            <input type="number" class="form-control form-control-sm" v-model="t.precio">
                        </td>
                        <td class="text-center fw-bold">
                            <input type="number" class="form-control form-control-sm" v-model="t.cantidad">
                        </td>
                        <td class="text-center fw-bold">{{ t.nombre_mesera }}</td>

                    </tr>
                </tbody>
            </table>
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                    :style="{ width: progreso + '%' }" aria-valuenow="progreso" aria-valuemin="0" aria-valuemax="100">{{
                        progreso
                    }}%</div>
            </div>
        </div>
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
