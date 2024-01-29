<template>
    <div class="col">
        <label for="insumos">Insumos</label>
        <select id="insumos" class="form-control btn-xs">
            <option></option>
            <option v-for="insumo in insumos" :key="insumo.id" :value="insumo.id">
                {{ insumo.nombre }}
            </option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['tipo', 'modal', 'evento'], // Aquí defines el prop miProp

    data: function () {
        return {
            insumos: '',
        }
    },
    mounted: function () {
        if (this.tipo == 2) {
            this.evento.$on('cambiar-insumos', (nuevoValor) => {
                this.getInsumos(nuevoValor)
            });
        } else if (this.tipo == 3) {
            this.evento.$on('cambiar-insumos-comida', (nuevoValor) => {
                this.getInsumosComida(nuevoValor)
            });
        } else {
            this.getInsumos(3);
        }

    },
    methods: {
        getInsumos: function (id) {
            axios.get(`insumos/model/comidasList.php`, {
                params: {
                    opcion: 5,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.insumos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#insumos').select2({
                    placeholder: 'Insumos',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + ''),
                });
                // Agrega un evento 'change' al select
                $('#insumos').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    // Llama a la función que deseas ejecutar
                    this.evento.$emit('id-insumo', valorSeleccionado);
                });

            }).catch(error => {
                console.error(error);
            });
        },
        getInsumosComida: function (id) {
            axios.get(`componentes/model/insumosList.php`, {
                params: {
                    opcion: 1,
                    id: id
                }
            }).then(response => {
                console.log(response.data)
                this.insumos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#insumos').select2({
                    placeholder: 'Insumos',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + ''),
                });
                // Agrega un evento 'change' al select
                $('#insumos').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    // Llama a la función que deseas ejecutar
                    this.evento.$emit('id-insumo', valorSeleccionado);

                    let precio
                    for (let i = 0; i < this.insumos.length; i++) {
                        if (this.insumos[i].id == valorSeleccionado) {
                            precio = this.insumos[i].precio
                            this.evento.$emit('precio-insumo', precio);
                            break
                        }
                    }
                    $("#precio").val(precio);
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
