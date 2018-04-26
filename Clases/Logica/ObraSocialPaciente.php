<?php
class ObraSocialPaciente{

	//ObraSocial
	private $idObraSocial;
	//Paciente
	private $idPaciente;
	//int
	private $numeroAfiliado;
	//

	public function __construct($i, $idPaciente=null){
		// echo $idPaciente;
		if(isset($_POST['idObraSocial'][$i]))
			$this->idObraSocial=$_POST['idObraSocial'][$i];
		// if(isset($_POST['idPaciente']))
			// $this->idPaciente=$_POST['idPaciente'];
		// else
			// if($idPaciente)
				$this->idPaciente= $idPaciente;
				// echo $idPaciente;
		if(isset($_POST['numeroAfiliado'][$i]))
			$this->numeroAfiliado=$_POST['numeroAfiliado'][$i];

	}

	public function getNumeroAfiliado(){
		return $this -> numeroAfiliado;
	}

	public function setNumeroAfiliado($new){
		$this -> numeroAfiliado = $new;
	}

	public function getIdPaciente(){
		return $this -> idPaciente;
	}

	public function setIdPaciente($new){
		$this -> idPaciente = $new;
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

 			$sql = "INSERT INTO obrassocialespacientes(idobrasocial, idpaciente, numeroafiliado) VALUES ($this->idObraSocial,$this->idPaciente, $this->numeroAfiliado)";
     			$res = ConexionBD::obtenerInstancia()->consultar($sql);


			//ANDA EL NUMERO DE AFILIADO, PERO IDOBRASOCIAL Y IDPACIENTE NO; NO TENGO NI LA MAS PUTA
			//DE PORQUE
			$sql = "UPDATE `obrassocialespacientes` SET `numeroafiliado`='{$this->numeroAfiliado}' WHERE `idObraSocial`=2 AND `idPaciente`=26";
			ConexionBD::obtenerInstancia()->consultar($sql);



 		//echo "entre, valores $this->idObraSocial,$this->idPaciente, $this->numeroAfiliado)";
 	}

	public function eliminar(){

	}

	public static function traerTodosPorIdPaciente(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

		$sql = "SELECT * FROM obrassocialespacientes,obrassociales WHERE idPaciente = '" . $_POST['idPaciente'] ."' and idObraSocial=obrassociales.id";
        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
        return $respuesta;
	}
}

?>
