<template>
    <div class="col">
        <label for="precios">Precios</label>
        <select id="precios" class="form-control btn-xs">
            <option></option>
            <option v-for="precio in precios" :key="precio.id" :value="precio.id">
                {{ precio.nombre }}
            </option>
        </select>
    </div>
</template>

<script>
module.exports = {
    props: ['modal'],

    data: function () {
        return {
            precios: [],
        }
    },
    mounted: function () {
        this.getPrecios();
    },
    methods: {
        getPrecios: function () {
            axios.get(`categorias/model/preciosList.php`, {
                params: {
                    opcion: 1,
                }
            }).then(response => {
                this.precios = response.data;

                $('#precios').select2({
                    createTag: function (params) {
                        const term = $.trim(params.term);

                        if (term == '') {
                            return null;
                        }

                        return {
                            id: term,
                            text: term,
                            newTag: true // Indica que es un nuevo tag personalizado
                        };
                    },
                    placeholder: 'Precios',
                    tags: true,
                    width: '100%',
                    dropdownParent: $('#' + this.modal + '')
                });

                $('#precios').on('change', (event) => {
                    const valorSeleccionado = $(event.target).val();
                    const esNuevoTag = this.precios.findIndex(precio => precio.id == valorSeleccionado) == -1;

                    if (esNuevoTag) {
                        // Esto es un nuevo tag personalizado
                        let valorString = 'n' + valorSeleccionado;
                        console.log('Nuevo tag:', valorString);


                        $("#idSelectPrecios").val(valorString);
                    } else {
                        // Esto es un precio existente
                        console.log('Precio existente:', valorSeleccionado);
                        $("#idSelectPrecios").val(valorSeleccionado);
                    }

                });
            }).catch(error => {
                console.error(error);
            });
        }
    }
}
</script>
