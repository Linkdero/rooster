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
        if (this.tipo == 1) {
            this.getInsumos();

        } else if (this.tipo == 2) {
            this.evento.$on('cambiar-insumo', (nuevoValor) => {
                this.getInsumosFiltrados(nuevoValor)
            });
        }

    },
    methods: {
        getInsumosFiltrados: function (id) {
            axios.get(`insumos/model/comidasList.php`, {
                params: {
                    opcion: 5,
                }
            }).then(response => {
                console.log(response.data)
                this.insumos = response.data

                // Inicializa Select2 después de cargar los datos
                $('#insumos').select2({
                    placeholder: 'Menú',
                    allowClear: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + ''),
                });
                // Agrega un evento 'change' al select
                $('#insumos').on('change', (event) => {
                    // Obtiene el valor seleccionado
                    const valorSeleccionado = $(event.target).val();
                    // Llama a la función que deseas ejecutar
                    if (this.tipo == 2) {
                        let precio
                        for (let i = 0; i < this.insumos.length; i++) {
                            if (this.insumos[i].id == valorSeleccionado) {
                                precio = this.insumos[i].precio
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
        getInsumos: function () {
            axios.get(`insumos/model/comidasList.php`, {
                params: {
                    opcion: 5,
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
                    $("#idSelectInsumos").val(valorSeleccionado);
                });

            }).catch(error => {
                console.error(error);
            });
        },
    }
}
</script>
