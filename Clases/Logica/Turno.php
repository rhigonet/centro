<?php
	class Turno{
/*****************************************Atributos**************************************************/
		private $id;
		private $fecha;
		private $hora;
		private $texto;

/*****************************************Metodos**************************************************/

		public function __construct(){
			if(isset($_POST['idTurno']))
				$this->id=$_POST['idTurno'];
			if(isset($_POST['fechaTurno']))
				$this->fecha=$_POST['fechaTurno'];
			if(isset($_POST['horaTurno']))
				$this->hora=$_POST['horaTurno'];
			if(isset($_POST['textoTurno']))
				$this->texto=$_POST['textoTurno'];
		}


	public function eliminar(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
		if($this->id == null){
			//MOSTRAR ERROR
			die("error");
		} else {
			$sql = "DELETE FROM turnos WHERE id=".$this->id;
			ConexionBD::obtenerInstancia()->consultar($sql);
		}
	}

			/** Traer Todos */
	/**
	* metodo de clase. Me trae todos los miembros de la clase en BD (como respuesta de ajax)
	*/
	public static function traerTodos($fecha = null){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
		if($fecha){
			$sql = "SELECT * FROM turnos WHERE fecha='$fecha'";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
		}
		else
		{
		$sql = "SELECT * FROM turnos";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
	    }
	}

	public function traerTodosOrdenados(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
		$sql = "SELECT * FROM turnos WHERE idTratamiento= $this->idTratamiento ORDER BY fecha, hora ASC";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);

	        return $respuesta;
	}

	/** Traer Todos Fecha */
	/* metodo de clase. Me trae todos los turnos de la BD que tengan esa fecha (como respuesta de ajax)*/
	public static function traerTodosFecha(){
		$fecha = $_REQUEST['fechaTurno'];
		$sql = "SELECT * FROM turnos WHERE fecha='$fecha' ORDER BY fecha, hora ASC";
	    	$respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
        	return $respuesta;
	}

	public function guardar(){
		$con=ConexionBD::obtenerInstancia();
		$sql="";
		if($this->id==null)
		{
			$sql="INSERT INTO turnos (id, fecha, hora, texto) VALUES (NULL,'{$this->fecha}','{$this->hora}','{$this->texto}')";
		}else{
		 	$sql="UPDATE turnos SET texto='{$this->texto}' WHERE id =$this->id";
		}
		$con->consultar($sql);
	}

	public static function traerTodosSemana($fechaI, $fechaF){
		$sql = "SELECT *  FROM turnos WHERE fecha>='" . $fechaI . "' and fecha <'" . $fechaF."'";
		//die($sql);
		$respuesta=ConexionBD::obtenerInstancia()->consultar($sql);

		return $respuesta;
	}

}

?>
