<template>
  <div class="col">
    <label for="equivalencias">Equivalencias</label>
    <select id="equivalencias" class="form-control btn-xs">
      <option></option>
      <option
        v-for="equivalencia in equivalencias"
        :key="equivalencia.id"
        :value="equivalencia.id"
      >
        {{ equivalencia.nombre }}
      </option>
    </select>
  </div>
</template>
<script>
module.exports = {
  props: ["tipo", "modal", "evento"], // Aquí defines el prop miProp

  data: function () {
    return {
      equivalencias: "",
    };
  },
  mounted: function () {
    this.evento.$on("cargar-equivalencias", (nuevoValor) => {
      this.getEquivalencias(nuevoValor);
    });
  },
  methods: {
    getEquivalencias: function (materiaPrima) {
      axios
        .get(`componentes/model/equivalenciasList.php`, {
          params: {
            opcion: 1,
            materiaPrima: materiaPrima,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.equivalencias = response.data;

          // Inicializa Select2 después de cargar los datos
          $("#equivalencias").select2({
            placeholder: "Equivalencias",
            allowClear: true,
            width: "100%",
            dropdownParent: $("#" + this.modal + ""),
          });
          // Agrega un evento 'change' al select
          $("#equivalencias").on("change", (event) => {
            // Obtiene el valor seleccionado
            const valorSeleccionado = $(event.target).val();
            for (let i = 0; i < this.equivalencias.length; i++) {
              if (this.equivalencias[i].id == valorSeleccionado) {
                this.evento.$emit("equivalencia-seleccionada", this.equivalencias[i]);
                break;
              }
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
