<?php
	class TratamientoDiagnostico{
		private $idTratamiento;
		private $idDiagnostico;


		public function __construct(){
			if(isset($_POST['idTratamiento']))
				$this->idTratamiento = $_POST['idTratamiento'];
			if(isset($_POST['idDiagnostico']))
				$this->idDiagnostico = $_POST['idDiagnostico'];
		}


		public function getidDiagnostico () {
			return $this->idDiagnostico ;
		}

		public function setidDiagnostico ($id) {
			$this->idDiagnostico = $id;
		}

		public function guardar(){
			if($this->existe()){
				$sql = "UPDATE tratamientosdiagnosticos SET idTratamiento='$this->idTratamiento', idDiagnostico='$this->idDiagnostico' WHERE idTratamiento='$this->idTratamiento'";
    			ConexionBD::obtenerInstancia()->consultar($sql);
			}else{
				if(($this->idTratamiento != null) && ($this->idDiagnostico != null)){
					$sql = "INSERT INTO tratamientosdiagnosticos (idTratamiento,idDiagnostico) VALUES ('$this->idTratamiento','$this->idDiagnostico')";
					ConexionBD::obtenerInstancia()->consultar($sql);
				}else{
					die("Error al tratar de guardar en la tabla TratamientosDiagnosticos");
				}
			}
		}

		// existe se fija si el tratamientodiagnostico esta 
		private function existe(){
			$sql = "SELECT * FROM tratamientosdiagnosticos WHERE idTratamiento=".$this->idTratamiento." and idDiagnostico=".$this->idTratamiento;
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta->num_rows > 0;
		}

	public static function eliminarTodosPorIdTratamiento(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

		$sql = "DELETE FROM tratamientosdiagnosticos WHERE idTratamiento = " . $_POST['idTratamiento'];
        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
        return $respuesta;
	}
	}
?>