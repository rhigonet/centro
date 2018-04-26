<?php

	class Diagnostico{
		private $id=null;
		private $codigo=null;
		private $descripcion=null;
		//DECRIPCION DICE EN LA BASE DE DATOS!! HAY QUE ARREGLARLO


		public function __construct(){

			if(isset($_POST['idDiagnostico']))
				$this->id=$_POST['idDiagnostico'];

			if(isset($_POST['codigoDiagnostico']))
				$this->codigo=$_POST['codigoDiagnostico'];

			if(isset($_POST['descripcionDiagnostico']))
				$this->descripcion=$_POST['descripcionDiagnostico'];

		}

		public function getId () {
			return $this->id ;
		}

		public function setId ($id) {
			$this->id = $id;
		}

		public function getCodigo () {
			return $this->codigo ;
		}

		public function setCodigo ($codigo) {
			$this->codigo = $codigo;
		}

		public function getDescripcion () {
			return $this->descripcion ;
		}

		public function setDescripcion ($descripcion) {
			$this->descripcion = $descripcion;
		}


		public function guardar(){
			//aca se ve si el id es nulo, se hace la carga como si fuera nuevo INSERT, si el id es distinto de nulo lo que hay que hacer es un UPDATE
			if($this->id == null)
			{
				$sql = "INSERT INTO diagnosticos(id,codigo, descripcion) VALUES (NULL,'{$this->codigo}','{$this->descripcion}')";
        		ConexionBD::obtenerInstancia()->consultar($sql);

			}
			else
			{

				$sql = "UPDATE diagnosticos SET codigo='{$this->codigo}', descripcion='{$this->descripcion}' WHERE id='{$this->id}'";
        		ConexionBD::obtenerInstancia()->consultar($sql);

			}
		}

		public function eliminar(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
			if($this->id == null){
				//MOSTRAR ERROR
				die("error");
			} else {
				$sql = "DELETE FROM diagnosticos WHERE id=".$this->id;
				ConexionBD::obtenerInstancia()->consultar($sql);

			}
		}

			public static function traerTodos(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

				$sql = "SELECT * FROM diagnosticos";
		    		$respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		     		return $respuesta;
				}


			public function traerDiagnostico(){
				$sql = "SELECT * FROM diagnosticos WHERE id={$this->id}";
		        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		        return $respuesta;
			}	

	}


?>
