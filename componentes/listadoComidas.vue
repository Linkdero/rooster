<template>
    <div class="col">
        <label for="comidas">Comidas</label>
        <select id="comidas" class="form-control btn-xs">
            <option></option>
            <option v-for="comida in comidas" :key="comida.id" :value="comida.id">
                {{ comida.comida }}
            </option>
        </select>
    </div>
</template>
<script>

module.exports = {
    props: ['tipo', 'modal', 'evento', 'local'], // Aquí defines el prop miProp

    data: function () {
        return {
            comidas: '',
        }
    },
    mounted() {
        if (this.tipo == 2) {
            this.getComidas(this.local)
        } else {
            this.getComidas(3);
        }
    },
    methods: {
        getComidas(id) {
            axios.get(`mesas/model/mesasList.php`, {
                params: {
                    opcion: 2,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.comidas = response.data

                // Inicializa Select2 después de cargar los datos
                $('#comidas').select2({
                    placeholder: 'Comida',
                    allowClear: true,
                    width: '100%',
                });
                // Agrega un evento 'change' al select
                $('#comidas').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    // Llama a la función que deseas ejecutar
                    $("#idSelectComidas").val(valorSeleccionado);

                    if (this.tipo == 2) {
                        this.evento.$emit('cambiar-insumo', valorSeleccionado);
                        this.evento.$emit('cambiar-insumos-comida', valorSeleccionado);
                    }
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
