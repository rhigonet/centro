<?php
	class TratamientoAparato{
		private $idTratamiento;
		private $idAparato;

		public function __construct(){
			if(isset($_POST['idTratamiento']))
				$this->idTratamiento = $_POST['idTratamiento'];
			if(isset($_POST['idAparato']))
				$this->idAparato = $_POST['idAparato'];
		}

		public function setidAparato($newIdAparato){
			$this->idAparato = $newIdAparato;
		}

		public function guardar(){
			if($this->existe()){
				$sql = "UPDATE tratamientosaparatos SET idTratamiento='$this->idTratamiento', idAparato='$this->idAparato' WHERE idTratamiento='$this->idTratamiento'";
    			ConexionBD::obtenerInstancia()->consultar($sql);
			}else{
				if(($this->idTratamiento != null) && ($this->idAparato != null)){
					$sql = "INSERT INTO tratamientosaparatos (idTratamiento,idAparato) VALUES ('$this->idTratamiento','$this->idAparato')";
					ConexionBD::obtenerInstancia()->consultar($sql);
				}else{
					die("Error al tratar de guardar en la tabla TratamientosAparatos");
				}
			}
		}

		private function existe(){
			$sql = "SELECT * FROM tratamientosaparatos WHERE idTratamiento=".$this->idTratamiento." and idAparato=".$this->idAparato;
		    $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		    return $respuesta->num_rows > 0;
		}

		public static function eliminarTodosPorIdTratamiento(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

			$sql = "DELETE FROM tratamientosaparatos WHERE idTratamiento = " . $_POST['idTratamiento'];
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
		}
	}
?>