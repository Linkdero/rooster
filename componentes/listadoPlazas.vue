<template>
    <div class="col">
        <label for="plazas">Plazas</label>
        <select id="plazas" class="form-control btn-xs">
            <option></option>
            <option v-for="plaza in plazas" :key="plaza.id" :value="plaza.id">
                {{ plaza.nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            plazas: '',
        }
    },
    mounted: function () {
        this.getPlazas();
    },
    methods: {
        getPlazas: function () {
            axios.get(`componentes/model/plazasList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data)
                this.plazas = response.data

                // Inicializa Select2 después de cargar los datos
                $('#plazas').select2({
                    placeholder: 'Plazas',
                    allowClear: true,
                    width: '100%',
                    // dropdownParent: $('#' + this.modal + ''),
                });
                $('#plazas').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();

                    this.evento.$emit('cambiar-plaza', valorSeleccionado);

                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
