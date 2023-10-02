<template>
    <div class="col">
        <label for="materiasPrimas">Materias Primas</label>
        <select id="materiasPrimas" class="form-control btn-xs">
            <option></option>
            <option v-for="materiaPrima in materiasPrimas" :key="materiaPrima.id" :value="materiaPrima.id">
                {{ materiaPrima.nombre }}
            </option>
        </select>
    </div>
</template>

<script>
// import  EventBus  from './eventBus.js';

module.exports = {
    props: ['tipo', 'modal'], // Aquí defines el prop miProp

    data: function () {
        return {
            materiasPrimas: '',
        }
    },
    mounted: function () {
        this.getMateriasPrimas();
    },
    methods: {
        getMateriasPrimas: function () {
            axios.get(`bodega/model/bodegaList.php`, {
                params: {
                    opcion: 1,
                    tipo: this.tipo
                }
            }).then(response => {
                console.log(response.data)
                this.materiasPrimas = response.data

                // Inicializa Select2 después de cargar los datos
                $('#materiasPrimas').select2({
                    placeholder: 'Menú',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + ''),
                });
                // Agrega un evento 'change' al select
                $('#materiasPrimas').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();

                    // Obtiene el nombre de la materia prima seleccionada
                    const nombreSeleccionado = $('#materiasPrimas option:selected').text();

                    // Llama a la función que deseas ejecutar
                    $("#idSelectMateriasPrimas").val(valorSeleccionado);
                    $("#nombreSelectMateriasPrimas").val(nombreSeleccionado);
                    // EventBus.$emit('cambiar-select', valorSeleccionado);

                    // Imprime el nombre seleccionado
                    console.log("Nombre seleccionado:", nombreSeleccionado);
                });
            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
