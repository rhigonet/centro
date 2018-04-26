<?php
class Tratamiento{

/********************ATRIBUTOS******************/
	//int
	private $id;
	//int
	private $idPaciente;
	//Tratamiento
	private $tratamientoAnterior;
	//Tratamiento
	private $tratamientoSiguiente;
	//Medico
	private $idMedico;
	//ObraSocial
	private $idObraSocial;
	//string
	private $derivacionMedica;
	//int
	private $nroSesiones;

	private $evolucion;

	private $fechaInicio;
	private $fechaFin;


/********************METODOS********************/
	public function __construct(){
		if(isset($_POST['idTratamiento']))
			$this->id=$_POST['idTratamiento'];
		if(isset($_POST['idPaciente']))
			$this->idPaciente=$_POST['idPaciente'];
		if(isset($_POST['tratamientoAnterior']))
			$this->tratamientoAnterior=$_POST['tratamientoAnterior'];
		if($this->tratamientoAnterior=='')
			$this->tratamientoAnterior='null';
		if(isset($_POST['tratamientoSiguiente']))
			$this->tratamientoSiguiente=$_POST['tratamientoSiguiente'];
		if(isset($_POST['idMedico']))
			$this->idMedico=$_POST['idMedico'];
		if(isset($_POST['idObraSocial'])){
			$this->idObraSocial=$_POST['idObraSocial'];
		}else{
			$this->idObraSocial ='null';
		}
		if(isset($_POST['derivacionMedica']))
			$this->derivacionMedica= $_POST['derivacionMedica'];
		if($this->derivacionMedica != '')
			$this->derivacionMedica = date('Y').date('m').date('d').time().$_POST['derivacionMedica'];
		else{
			$this->derivacionMedica='null';
		}

		if(isset($_POST['nroSesiones']))
			$this->nroSesiones=$_POST['nroSesiones'];

		if(isset($_POST['evolucion'])){
			$this->evolucion=$_POST['evolucion'];
		}else{
			$this->evolucion ='null';
		}

		if(isset($_POST['fechaInicio'])){
			$this->fechaInicio=$_POST['fechaInicio'];
		}

	}

	public function Tratamiento($id){
		$this -> id = $id;
	}

	//get y set, paja hacerlos
	public function getId(){
		return $this->id;
	}

	/** cargar */
	/**
	* Recibe como parametro la clave primaria del registro y lo carga de la base de datos
	*/
	public function cargar($clavePrimaria){}


		/** guardar */
	/**
	* guarda el registro (que ya debe estar con todos los valores previamente seteados) en la base de datos
	*/
	public function guardar(){
		//aca se ve si el id es nulo, se hace la carga como si fuera nuevo INSERT, si el id es distinto de nulo lo que hay que hacer es un UPDATE
		if($this->id == null)
		{
			$sql = "INSERT INTO tratamientos(id,idpaciente, idmedico, idobrasocial, nrosesiones, fechaInicio, derivacionmedica,tratamientoAnterior) VALUES (NULL,'$this->idPaciente','$this->idMedico', ".$this->idObraSocial.", '$this->nroSesiones','$this->fechaInicio' ,'$this->derivacionMedica',". $this->tratamientoAnterior.")";
			//die($sql);
    		ConexionBD::obtenerInstancia()->consultar($sql);
			//****   Asigno el id al tratamiento ***   //
			$sql = "SELECT MAX(id) as id FROM tratamientos";
			$consulta = ConexionBD::obtenerInstancia()->consultar($sql);
			$fila = mysqli_fetch_array($consulta);

			$this->id = $fila['id'];

			$sql = "UPDATE  tratamientos SET tratamientoSiguiente='$this->id' WHERE id=$this->tratamientoAnterior";
    		ConexionBD::obtenerInstancia()->consultar($sql);


		}
		else{

				$sql = "UPDATE tratamientos SET idPaciente=$this->idPaciente, idMedico=$this->idMedico , idObraSocial=$this->idObraSocial, derivacionMedica='$this->derivacionMedica', nrosesiones='$this->nroSesiones', tratamientoAnterior=$this->tratamientoAnterior, fechaInicio='$this->fechaInicio' WHERE id='$this->id'";
				//die($sql);
	    		ConexionBD::obtenerInstancia()->consultar($sql);
			}
			$sql = "UPDATE  tratamientos SET tratamientoSiguiente='$this->id' WHERE id=$this->tratamientoAnterior";
    		ConexionBD::obtenerInstancia()->consultar($sql);
			//Tratamiento::actualizarSegunTurnos($this->id);	//si modifican el nro de sesiones, actualizar el tratamiento

	}
	/** eliminar */
	/**
	* metodo de clase. Le paso una clave y me elimina ese registro de la BD
	*/
	public function eliminar(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
		if($this->id == null){
			//MOSTRAR ERROR
			die("error");
		} else {
			$sql = "DELETE FROM tratamientos WHERE id=".$this->id;
			// die($sql);
			ConexionBD::obtenerInstancia()->consultar($sql);

		}
	}

	/** Traer Todos */
	/**
	* metodo de clase. Me trae todos los miembros de la clase en BD (como respuesta de ajax)
	*/
	public static function traerTodos(){

		$sql = "SELECT * FROM tratamientos";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
	}


	public function traerDiagnosticos(){

		$sql = "SELECT diagnosticos.* FROM diagnosticos,tratamientosdiagnosticos WHERE tratamientosdiagnosticos.idTratamiento = {$this->id} and tratamientosdiagnosticos.idDiagnostico = diagnosticos.id";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
	}

	public function traerAparatos(){
		$sql = "SELECT aparatos.* FROM aparatos,tratamientosaparatos WHERE tratamientosaparatos.idTratamiento= {$this->id} and tratamientosaparatos.idAparato = aparatos.id";
		$respuesta = ConexionBD::obtenerInstancia()->consultar($sql);
		return $respuesta;
	}


	public function traerTurnos(){

		/*$sql = "SELECT turnos.* FROM turnos WHERE turnos.idTratamiento = $this->id and turnos.asistio = TRUE";
		//"SELECT * FROM sesiones WHERE idTratamiento = {$this->id}";
				//"select sesiones.* from sesiones, turnos where turnos.idTratamiento='{$this->id}' and sesiones.idTurno=turnos.id and turnos.asistio=true";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;*/
	}


	public function traerTratamiento(){

		$sql = "SELECT * FROM tratamientos WHERE id=".$this->id;
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
	}

	public static function traerTodosPorIdPaciente(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

		$sql = "SELECT * FROM tratamientos WHERE idPaciente = '" . $_POST['idPaciente'] ."' ";
		if(isset($_POST['idTratamiento']))
			$sql .= "and '" . $_POST['idTratamiento'] ."' != id";
        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
        return $respuesta;
	}

	public function actualizarEvolucion(){
		$sql = "UPDATE `tratamientos` SET `evolucion`='$this->evolucion' WHERE `id`=$this->id";
		$consulta = ConexionBD::obtenerInstancia()->consultar($sql);
	}

	public static function actualizarSegunTurnos($id){
		/*//Actualiza el tratamiento según los turnos asistidos, fechaFin, fechaInicio y sesionActual
		$table=ConexionBD::obtenerInstancia()->consultar("SELECT * FROM tratamientos WHERE id=$id");
		$tratamiento=$table->fetch_assoc();
		$turnos=ConexionBD::obtenerInstancia()->consultar("SELECT * FROM turnos WHERE turnos.idTratamiento=$id and asistio=TRUE");
		//Actualizo la sesion actual:
		$sesionActual=mysqli_num_rows($turnos);
		//Actualizo al fecha de inicio
		if($sesionActual>0)
		{
			$table=ConexionBD::obtenerInstancia()->consultar("SELECT MIN(fecha) as fecha FROM turnos WHERE turnos.idTratamiento=$id and asistio=TRUE");
			$fechaInicio="'".$table->fetch_assoc()['fecha']."'";
		}
		else
		{
			$fechaInicio="NULL";
		}

		//Actualizo la fecha de fin
		if($sesionActual>0 && $sesionActual==$tratamiento['nroSesiones'])
		{
			$table=ConexionBD::obtenerInstancia()->consultar("SELECT MAX(fecha) as fecha FROM turnos WHERE turnos.idTratamiento=$id and asistio=TRUE");
			$fechaFin="'".$table->fetch_assoc()['fecha']."'";
		}
		else
		{
			$fechaFin="NULL";
		}
		//Consulta UPDATE
		ConexionBD::obtenerInstancia()->consultar("UPDATE tratamientos SET sesionActual=$sesionActual, fechaInicio=$fechaInicio, fechaFin=$fechaFin WHERE id=$id");
		//echo "UPDATE tratamientos SET sesionActual=$sesionActual, fechaInicio=$fechaInicio, fechaFin=$fechaFin WHERE id=$id";*/
	}
}

?>
