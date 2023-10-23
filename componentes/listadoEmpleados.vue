<template>
    <div class="col">
        <label for="empleados">Empleados</label>
        <select id="empleados" class="form-control btn-xs">
            <option></option>
            <option v-for="empleado in empleados" :key="empleado.id" :value="empleado.id">
                {{ empleado.nombre }}
            </option>
        </select>
    </div>
</template>
<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            empleados: '',
        }
    },
    mounted: function () {
        if (this.tipo == 2) {
            this.evento.$on('cambiar-empleado', (nuevoValor) => {
                this.getEmpleados(nuevoValor)
            });
        } else {
            this.getEmpleados(3);
        }
    },
    methods: {
        getEmpleados: function (local) {
            axios.get(`componentes/model/empleadosList.php`, {
                params: {
                    opcion: 1,
                    local: local
                }
            }).then(response => {
                console.log(response.data)
                this.empleados = response.data

                // Inicializa Select2 después de cargar los datos
                $('#empleados').select2({
                    placeholder: 'Empleados',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + ''),
                });
                // Agrega un evento 'change' al select
                $('#empleados').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    this.evento.$emit('id-empleado', valorSeleccionado);
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
