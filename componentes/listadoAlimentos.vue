<template>
    <div class="col">
        <label for="alimentos">Alimentos</label>
        <select id="alimentos" class="form-control btn-xs">
            <option></option>
            <option v-for="(alimento, index) in alimentos" :key="index" :value="alimento.id_alimento">
                {{ alimento.alimento_nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'local', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            alimentos: '',
        }
    },
    mounted: function () {
        if (this.tipo == 1) {
            this.getAlimentos(this.local)
        } else {
            this.getAlimentos(3);
        }
    },
    methods: {
        getAlimentos: function (id) {
            axios.get(`bodega/model/alimentosList.php`, {
                params: {
                    opcion: 1,
                    id: id,
                    tipo: this.tipo,
                    estado: 1

                }
            }).then(response => {
                console.log(response.data)
                this.alimentos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#alimentos').select2({
                    placeholder: 'alimento',
                    allowClear: true,
                    width: '100%',
                });
                // Agrega un evento 'change' al select
                $('#alimentos').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    let precio
                    for (let i = 0; i < this.alimentos.length; i++) {
                        if (this.alimentos[i].id_alimento == valorSeleccionado) {
                            precio = this.alimentos[i].precio_alimento
                            this.evento.$emit('precio-insumo', precio);
                            break
                        }
                    }
                    $("#precio").val(precio);
                    this.evento.$emit('id-alimento', valorSeleccionado);
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
