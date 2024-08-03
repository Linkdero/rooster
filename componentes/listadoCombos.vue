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
    props: ['tipo', 'local', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            combos: '',
        }
    },
    mounted() {
        if (this.tipo == 2) {
            this.getCombos(this.local);
        } else {
            this.getCombos(3);
        }
    },
    methods: {
        getCombos(id) {
            axios.get(`insumos/model/combosList.php`, {
                params: {
                    opcion: 1,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.combos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#combos').select2({
                    placeholder: 'Combos',
                    allowClear: true,
                    width: '100%',
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
                                this.evento.$emit('precio-insumo', precio);
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
