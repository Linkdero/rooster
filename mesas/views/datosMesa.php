<div class="form-row">
    <div class="col-12">
        <div class="x_title">
            <h2>Datos del Cliente</h2>
            <div class="clearfix"></div>
        </div>
    </div>
    <div class="col">
        <label for="placas">Número de Mesa</label>
        <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
            <input type="number" class="input-sm form-control" id="idMesa" v-model="nroMesa" disabled>
            <span class="input-group-text"><i class="fa-regular fa-list-ol"></i></span>
        </div>
    </div>
    <div class="col">
        <label for="nroPlacas">Referencia</label>
        <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
            <input type="text" class="input-sm form-control" id="referencia" v-model="referenciaMesa" disabled>
            <span class="input-group-text"><i class="fa-solid fa-sign-hanging"></i></span>
        </div>
    </div>
    <div class="col">
        <label for="nroPlacas">Hora</label>
        <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
            <input type="time" class="input-sm form-control" id="hora" v-model="horaActual" disabled>
            <span class="input-group-text"><i class="fa-solid fa-clock"></i></span>
        </div>
    </div>
    <div class="col">
        <label for="placas">Nombre Cliente</label>
        <div class="input-daterange input-group input-group-sm my-auto ml-auto mr-auto ml-sm-auto mr-sm-0">
            <input type="text" class="input-sm form-control" id="nombreCliente" v-model="nombreCliente" :disabled="!validarNombre">
            <span class="input-group-text"><i class="fa-solid fa-signature"></i></span>
        </div>
    </div>
</div>