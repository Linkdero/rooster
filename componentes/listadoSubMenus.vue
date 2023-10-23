<template>
    <div class="col">
        <label for="subMenus">Sub Menús </label>
        <select id="subMenus" class="form-control btn-xs">
            <option></option>
            <option v-for="subMenu in subMenus" :key="subMenu.id" :value="subMenu.id">
                {{ subMenu.nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            subMenus: '',
        }
    },
    mounted: function () {
        if (this.tipo == 2) {
            this.evento.$on('cambiar-menus', (nuevoValor) => {
                this.getSubMenus(nuevoValor)
            });
        } else {
            this.getSubMenus(3);
        }
    },
    methods: {
        getSubMenus: function (id) {
            axios.get(`componentes/model/subMenusList.php`, {
                params: {
                    opcion: 1,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.subMenus = response.data

                // Inicializa Select2 después de cargar los datos
                $('#subMenus').select2({
                    placeholder: 'Menús',
                    allowClear: true,
                    width: '100%',
                    // dropdownParent: $('#' + this.modal + ''),
                });
                $('#subMenus').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    this.evento.$emit('obtener-id-subMenu', valorSeleccionado);
                });
            }).catch(error => {
                console.error(error);
            });
        },

    }
}
</script>
