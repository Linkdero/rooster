<template>
    <div class="col">
        <label for="medidas">Medidas</label>
        <select id="medidas" class="form-control btn-xs">
            <option></option>
            <option v-for="medida in medidas" :key="medida.id" :value="medida.id">
                {{ medida.nombre }}
            </option>
        </select>
    </div>
</template>

<script>
module.exports = {
    props: ['tipo'], // Aquí defines el prop miProp

    data: function () {
        return {
            medidas: '',
        }
    },
    mounted: function () {
        this.getMedidas();
    },
    methods: {
        getMedidas: function () {
            axios.get(`categorias/model/medidasList.php`, {
                params: {
                    opcion: 1,
                    tipo: this.tipo
                }
            }).then(response => {
                console.log(response.data)
                this.medidas = response.data

                // Inicializa Select2 después de cargar los datos
                $('#medidas').select2({
                    placeholder: 'Medidas',
                    allowClear: true,
                    width: '100%',
                });
                // Agrega un evento 'change' al select
                $('#medidas').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    // Llama a la función que deseas ejecutar
                    $("#idSelectMedidas").val(valorSeleccionado);
                });


            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
