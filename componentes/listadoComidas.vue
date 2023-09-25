<template>
    <div class="col">
        <label for="comidas">Menú</label>
        <select id="comidas" class="form-control btn-xs">
            <option></option>
            <option v-for="comida in comidas" :key="comida.id" :value="comida.id">
                {{ comida.comida }}
            </option>
        </select>
    </div>
</template>

<script>
// import  EventBus  from './eventBus.js';

module.exports = {
    props: ['tipo'], // Aquí defines el prop miProp

    data: function () {
        return {
            comidas: '',
        }
    },
    mounted: function () {
        this.getComidas();
    },
    methods: {
        getComidas: function () {
            axios.get(`mesas/model/mesasList.php`, {
                params: {
                    opcion: 2,
                }
            }).then(response => {
                console.log(response.data)
                this.comidas = response.data

                // Inicializa Select2 después de cargar los datos
                $('#comidas').select2({
                    placeholder: 'Menú',
                    allowClear: true,
                    width: '100%',
                });
                // Agrega un evento 'change' al select
                $('#comidas').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    // Llama a la función que deseas ejecutar
                    $("#idSelectComidas").val(valorSeleccionado);
                    // EventBus.$emit('cambiar-select', valorSeleccionado);
                });
                // Obtener la URL completa
                var urlCompleta = window.location.href;

                // Obtener la parte de la ruta
                var ruta = window.location.pathname;


            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
