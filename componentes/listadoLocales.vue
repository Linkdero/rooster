<template>
    <div class="col">
        <label for="locales">Locales</label>
        <select id="locales" class="form-control btn-xs">
            <option></option>
            <option v-for="local in locales" :key="local.id" :value="local.id">
                {{ local.nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'evento'], // Aquí defines el prop miProp

    data() {
        return {
            locales: '',
        }
    },
    mounted() {
        this.getLocales();
    },
    methods: {
        getLocales() {
            axios.get(`componentes/model/localesList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data)
                this.locales = response.data

                // Inicializa Select2 después de cargar los datos
                $('#locales').select2({
                    placeholder: 'Locales',
                    allowClear: true,
                    width: '100%',
                });
                $('#locales').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();

                    this.evento.$emit('cambiar-local', valorSeleccionado);
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
