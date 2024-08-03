<template>
    <div class="col">
        <div class="form-row">
            <div class="col-12">
                <div class="x_title">
                    <h2>Datos del Cliente</h2>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="col">
                <label for="placas">Número de Mesa</label>
                <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                    <input type="number" class="input-sm form-control" v-model="datosMesa.nro_mesa" disabled>
                    <span class="input-group-text"><i class="fa-regular fa-list-ol"></i></span>
                </div>
            </div>
            <div class="col">
                <label for="nroPlacas">Referencia</label>
                <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                    <input type="text" class="input-sm form-control" v-model="datosMesa.referencia" disabled>
                    <span class="input-group-text"><i class="fa-solid fa-sign-hanging"></i></span>
                </div>
            </div>
            <div class="col">
                <label for="nroPlacas">Hora</label>
                <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                    <input type="time" class="input-sm form-control" v-model="horaActual" disabled>
                    <span class="input-group-text"><i class="fa-solid fa-clock"></i></span>
                </div>
            </div>
            <div class="col">
                <label for="placas">Nombre Cliente</label>
                <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
                    <input type="text" class="input-sm form-control" v-model="nombreCliente"
                        :disabled="validarNombre == true">
                    <span class="input-group-text"><i class="fa-solid fa-signature"></i></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    props: ['mesa', 'evento'],

    data() {
        return {
            datosMesa: {
                nro_mesa: null,
                referencia: null,
                nom_cliente: null,
                fecha_inicio: null,
            },
            horaActual: '',
            nombreCliente: '',
            validarNombre: '',
            idLocal: '',
        }
    },
    watch: {
        nombreCliente(n) {
            console.log(n)
            this.evento.$emit('nombre-cliente', n);
        }
    },
    mounted() {
        this.getDatosMesa()
    },
    methods: {
        getDatosMesa() {
            axios.get(`mesas/src/components/model/datosMesa.php`, {
                params: {
                    opcion: 1,
                    mesa: this.mesa,
                }
            }).then(response => {
                console.log(response.data)
                this.datosMesa = response.data
                let now
                let formattedTime

                if (this.datosMesa.fecha_inicio == null) {
                    now = new Date();
                    formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                } else
                    this.nombreCliente = this.datosMesa.nom_cliente

                this.datosMesa.nom_cliente == null ? this.validarNombre = false : this.validarNombre = true;
                this.datosMesa.fecha_inicio == null ? this.horaActual = formattedTime : this.horaActual = this.datosMesa.fecha_inicio;
                this.evento.$emit('datos-mesa-seleccionada', this.datosMesa.id_local, this.datosMesa.nro_mesa);
            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
