<template>
    <div class="col">
        <label for="permisos">Permisos</label>
        <select id="permisos" class="form-control btn-xs">
            <option></option>
            <option v-for="permiso in permisos" :key="permiso.id" :value="permiso.id">
                {{ permiso.nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            permisos: '',
        }
    },
    mounted: function () {
        this.getPermisos();
    },
    methods: {
        getPermisos: function () {
            axios.get(`componentes/model/permisosList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data)
                this.permisos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#permisos').select2({
                    placeholder: 'Permisos',
                    allowClear: true,
                    width: '100%',
                    // dropdownParent: $('#' + this.modal + ''),
                });

                $('#permisos').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();

                    this.evento.$emit('cambiar-permiso', valorSeleccionado);

                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
