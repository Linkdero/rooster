<template>
    <div class="col">
        <label for="combos">Combos</label>
        <select id="combos" class="form-control btn-xs">
            <option></option>
            <option v-for="combo in combos" :key="combo.id" :value="combo.id">
                {{ combo.nombre }}
            </option>
        </select>
    </div>
</template>
<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            combos: '',
        }
    },
    mounted: function () {
        this.getCombos();
    },
    methods: {
        getCombos: function () {
            axios.get(`insumos/model/combosList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                console.log(response.data)
                this.combos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#combos').select2({
                    placeholder: 'Combos',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + ''),
                });
                // Agrega un evento 'change' al select
                $('#combos').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();

                    if (this.tipo == 2) {
                        let precio
                        for (let i = 0; i < this.combos.length; i++) {
                            if (this.combos[i].id == valorSeleccionado) {
                                precio = this.combos[i].precio
                                break
                            }
                        }
                        $("#precio").val(precio);
                    }
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
