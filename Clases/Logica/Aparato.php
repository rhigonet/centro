<?php  
	
	class Aparato{
		private $id=null;
		private $descripcion=null;

		public function __construct(){
			
			if(isset($_POST['idAparato']))
				$this->id=$_POST['idAparato'];

			if(isset($_POST['descripcionAparato']))
				$this->descripcion=$_POST['descripcionAparato'];

		}

		public function getId () {
			return $this->id ;
		}

		public function setId ($id) {
			$this->id = $id;
		}


		public function getDescripcion () {
			return $this->descripcion ;
		}
		
		public function setDescripcion ($descripcion) {
			$this->descripcion = $descripcion;
		}

		/** eliminar */
		/**
		* metodo de clase. Le paso una clave y me elimina ese registro de la BD.
		retorna boolean indicando si se pudo eliminar con exito
		*/

		public function eliminar(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
			if($this->id == null){
				//MOSTRAR ERROR
				die("error");
			} else {
				$sql = "DELETE FROM aparatos WHERE id=".$this->id;
				ConexionBD::obtenerInstancia()->consultar($sql);

			}
		}

		public function guardar(){
			//aca se ve si el id es nulo, se hace la carga como si fuera nuevo INSERT, si el id es distinto de nulo lo que hay que hacer es un UPDATE
			if($this->id == null){
				$sql = "INSERT INTO aparatos(id,descripcion) VALUES (NULL,'{$this->descripcion}')";
				ConexionBD::obtenerInstancia()->consultar($sql);

			} else {

				$sql = "UPDATE aparatos SET descripcion='{$this->descripcion}' WHERE id='{$this->id}'";
				ConexionBD::obtenerInstancia()->consultar($sql);

			}

		}

			public static function traerTodos(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

					$sql = "SELECT * FROM aparatos";
		    		$respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		     		return $respuesta;
				}


		public function traerAparato(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

			$sql = "SELECT * FROM aparatos WHERE id=".$this->id;
		        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		        return $respuesta;
		}
	}

?>
