<?php 
	class Sesion{
/*************************ATRIBUTOS*********************************/
	//int
	private $nro;
	//string
	private $descripcion:
	//int
	private $idTurno
	//date
	private $fecha;

/*************************METODOS*********************************/
	public function __construct(){

		if(isset($_POST['nroSesion']))
			$this->nro=$_POST['nroSesion'];
		if(isset($_POST['descripcionSesion']))
			$this->descripcion=$_POST['descripcionSesion'];
		if(isset($_POST['idTratamiento']))
			$this->descripcion=$_POST['idTratamiento'];
		if(isset($_POST['fechaSesion']))
			$this->fecha=$_POST['fechaSesion'];
	}

	public function getNro()
		return ($this -> nro);
	}
	public function setNro($new){
		$this -> nro = $new;
	}

	public function getDescripcion()
		return ($this -> descripcion);
	}
	public function setDescripcion($new){
		$this -> descripcion = $new;
	}

	public function getid()
		return ($this -> id);
	}

	public function getFecha()
		return ($this -> fecha);
	}
	public function setFecha($new){
		$this -> fecha = $new;
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
				//obtengo numero de sesion anterior

				$con = ConexionBD::obtenerInstancia();
				$sql = "SELECT MAX (nro) FROM sesiones WHERE Tratamientos_id = $this -> idTratamiento";
				$consulta = $con -> consultar($sql);
				//obtengo un numero maximo, o null si no existe ninguna sesion
				if($consulta == null){
					$this -> nro = 1;
				}
				else{
					//incremento sesion
					$this -> nro = mysqli_fetch_array($consulta, MYSQLI_ASSOC)['nro'] + 1;	
				}

				$valores = "";
				$valores = $valores . $this -> nro;
				$valores = $valores . ",'";
				$valores = $valores . $this -> descripcion;
				$valores = $valores . "',";
				$valores = $valores . $this -> idTratamiento;
				$valores = $valores . ",";
				$valores = $valores . $this -> fecha;
				
				$con -> insertInto ("sesiones", $valores);
			}
			else
			{

				//update

			}
	}

	
	public function eliminar(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE
		if($this->id == null){
			//MOSTRAR ERROR
			die("error");
		} else {
			$sql = "DELETE FROM sesiones WHERE id=".$this->id;
			ConexionBD::obtenerInstancia()->consultar($sql);

		}
	}
?>