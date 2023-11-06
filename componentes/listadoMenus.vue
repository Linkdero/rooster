<template>
    <div class="col">
        <label for="menus">Menús </label>
        <select id="menus" class="form-control btn-xs">
            <option></option>
            <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                {{ menu.nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            menus: '',
        }
    },
    mounted: function () {
        if (this.tipo == 2) {
            this.evento.$on('cambiar-menus', (nuevoValor) => {
                this.getMenus(nuevoValor)
            });
        } else {
            this.getMenus(3);
        }
    },
    methods: {
        getMenus: function (id) {
            axios.get(`componentes/model/menusList.php`, {
                params: {
                    opcion: 1,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.menus = response.data

                // Inicializa Select2 después de cargar los datos
                $('#menus').select2({
                    placeholder: 'Menús',
                    allowClear: true,
                    width: '100%',
                    // dropdownParent: $('#' + this.modal + ''),
                });

                $('#menus').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    this.evento.$emit('obtener-id-menu', valorSeleccionado);
                });

            }).catch(error => {
                console.error(error);
            });
        },

    }
}
</script>
