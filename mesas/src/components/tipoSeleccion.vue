<template>
    <div class="col">
        <label for="insumos">Tipo Selección</label>
        <select class="form-control btn-xs" v-model="seleccionComidas">
            <option selected disabled value="">selección Tipo Insumo</option>
            <option value="1">Materia Prima</option>
            <option value="2" v-if="tipo != 4">Cubetazo</option>
            <option value="3" v-if="tipo != 4">Combo</option>
            <option value="4" v-if="tipo != 4">Alimentos</option>
        </select>
    </div>
</template>

<script>

module.exports = {
    props: ['evento', 'tipo'],

    data() {
        return {
            seleccionComidas: ''
        }
    },
    watch: {
        seleccionComidas(n) {
            console.log(n)
            this.evento.$emit('tipo-selección', n);
        }
    },
    mounted() {
    },
}
</script>
