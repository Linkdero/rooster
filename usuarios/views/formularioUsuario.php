<div id="appUsuarios">
	<input type="hidden" value="<?php echo $_GET["ref"] ?>" id="tipo">
	<div class="right_col" role="main">
		<div class="row">
			<div class="col-md-6 ">
				<div class="x_panel">
					<div class="x_title">
						<h2>{{tituloModulo}}</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group row ">
								<label class="control-label col-md-3 col-sm-3 ">Nombre Usuario</label>
								<div class="col-md-9 col-sm-9 ">
									<input type="text" class="form-control" placeholder="nombre.apellido" v-model="usuario">
								</div>
							</div>
							<div class="form-group row ">
								<label class="control-label col-md-3 col-sm-3 ">Nombre Apellido </label>
								<div class="col-4">
									<input type="text" class="form-control" placeholder="nombre" v-model="nombre">
								</div>
								<div class="col-4">
									<input type="text" class="form-control" placeholder="apellido" v-model="apellido">
								</div>
							</div>
							<div class="form-group row ">
								<label class="control-label col-md-3 col-sm-3 ">Contraseña</label>
								<div class="col-md-9 col-sm-9 ">
									<input type="password" class="form-control" placeholder="password" v-model="password">
								</div>
							</div>
							<div class="form-group row ">
								<listado-permisos :evento="evento"> </listado-permisos>
								<div v-if="idPermiso != 1">
									<listado-locales :evento="evento"> </listado-locales>
								</div>
							</div>

							<div class="ln_solid"></div>
						</form>
					</div>
				</div>
			</div>

			<div class="col-md-6 ">
				<div class="x_panel">
					<div class="x_title">
						<h2>Subir Fotografia</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">
						<br />
						<form class="form-horizontal form-label-left">
							<div class="form-group col  justify-content-center text-center">
								<button type="button" class="btn btn-outline-primary" id="uploadButton" @click="openImageUploader">Subir Imagen</button>
								<h2>
									<span class="badge text-info"><i class="fa-solid fa-image"></i></span>
									<span class="badge">Imagen Previa</span>
								</h2>
								<img v-bind:src="foto" class="img-thumbnail rounded" id="previa" style="width: 150px; height: 150px;">
							</div>
							<div class="modal-footer" style="margin-bottom: -1rem;">
							</div>
						</form>
						<button class="btn btn-success btn-xs" :disabled="!camposCompletos" @click="actualizarUsuario">Crear <i class="fa-solid fa-user-plus ml-1"></i></button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type="module" src="./usuarios/src/formularioUsuario.js"> </script>