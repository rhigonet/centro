<?php
	class Medico{
		private $id=null;
		private $matricula=null;
		private $nombre=null;
		private $apellido=null;


		public function __construct(){

			if(isset($_POST['idMedico']))
				$this->id=$_POST['idMedico'];

			if(isset($_POST['matriculaMedico']))
				$this->matricula=$_POST['matriculaMedico'];

			if(isset($_POST['nombreMedico']))
				$this->nombre=$_POST['nombreMedico'];

			if(isset($_POST['apellidoMedico']))
				$this->apellido=$_POST['apellidoMedico'];

		}

		public function getId () {
			return $this-> id ;
		}
		public function setId ($matricula) {
			$this->id = $id;
		}
		public function getMatricula () {
			return $this-> matricula ;
		}
		public function setMatricula ($matricula) {
			$this->matricula = $matricula;
		}

		public function getNombre () {
			return $this-> nombre ;
		}
		public function setNombre ($nombre) {
			$this->nombre = $nombre;
		}

		public function getApellido () {
			return $this-> apellido ;
		}
		public function setApellido ($apellido) {
			$this->apellido = $apellido;
		}

		public function guardar(){
			//aca se ve si el id es nulo, se hace la carga como si fuera nuevo INSERT, si el id es distinto de nulo lo que hay que hacer es un UPDATE
			if($this->id == null){
				//$sql = "INSERT INTO medicos(matricula,nombre,apellido) VALUES ('{$this->matricula},{$this->nombre}','{$this->apellido}')";
				//OJO ACA, VER SI INSERTO ESTO ASI Y ME PONE UN ID AUTOINCREMENTAL SOLO O SI HACE FALTA MANDARSELO, probar con la linea de abajo
				$sql = "INSERT INTO medicos(id,matricula,nombre,apellido) VALUES (NULL,'{$this->matricula}','{$this->nombre}','{$this->apellido}')";
        			ConexionBD::obtenerInstancia()->consultar($sql);
			}else{
				$sql = "UPDATE medicos SET nombre='{$this->nombre}', apellido='{$this->apellido}', matricula='{$this->matricula}' WHERE id='{$this->id}'";
	        		ConexionBD::obtenerInstancia()->consultar($sql);
			}
		}


		public function cargar($id){
			/*Se ingresa el id del medico y se recuperan los datos, antes de usarse debe existir el objeto medico
			al menos con el id del mismo*/
			$sql = "SELECT * FROM medicos WHERE id='$id'";
			$res = ConexionBD::obtenerInstancia()->consultar($sql);
			$x = ConexionBD::obtenerInstancia()->obtenerArray($res);

			$this->matricula = $x['matricula'];
			$this->nombre = $x['nombre'];
			$this->apellido = $x['apellido'];
		}

		public static function eliminar($id){
			/*Función estática, se le pasa el id del medico y se elimina de la tabla*/
			if($id == null)
			{
				//MOSTRAR ERROR
			}
			else //Eliminamos los medicos sólo si no estan en ningun tratamiento
			{
				$sql = "SELECT * FROM tratamientos WHERE Medico='$id'";
				$res = ConexionBD::obtenerInstancia()->consultar($sql);
				if (ConexionBD::obtenerInstancia()->nFilas($res) == 0)
				{
					$sql = "DELETE FROM medicos WHERE id='$id'";
					ConexionBD::obtenerInstancia()->consultar($sql);
				}


			}
		}

		public static function traerTodos(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

			$sql = "SELECT * FROM medicos";
	    		$respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	     		return $respuesta;
		}

		public function traerMedico(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

			$sql = "SELECT * FROM medicos WHERE id=".$this->id;
		        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		        return $respuesta;
		}

		public function existeMatricula(){
			$sql = "SELECT * FROM medicos WHERE matricula=".$this->matricula . " AND id!='".$this->id."'";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta->num_rows > 0;
		}

	}

?>
