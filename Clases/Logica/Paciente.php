<?php
/***********************************************************************
 * Author:  juangini
 ***********************************************************************/
class Paciente{
/***************** ATRIBUTOS **************************/
	//long
	private $dni;
	//string
	private $nombre;
	//string
	private $apellido;
	//long
	private $telefono;
	//string
	private $direccion;
	//int
	private $id;

	//date
	private $nacimiento;

	//array de objetos de tipo ObraSocialPaciente
	private $obrasSociales = [];

	//private $nacimiento;


/***************** METODOS **************************/

//tendriamos que hacer controles en los get y set
	public function __construct(){

		if(isset($_POST['idPaciente']))
			$this->id=$_POST['idPaciente'];

		if(isset($_POST['dniPaciente']))
			$this->dni=$_POST['dniPaciente'];

		if(isset($_POST['nombrePaciente']))
			$this->nombre=$_POST['nombrePaciente'];

		if(isset($_POST['apellidoPaciente']))
			$this->apellido=$_POST['apellidoPaciente'];

		if(isset($_POST['direccionPaciente']))
			$this->direccion=$_POST['direccionPaciente'];

		if(isset($_POST['telefonoPaciente']))
			$this->telefono=$_POST['telefonoPaciente'];

		if(isset($_POST['nacimientoPaciente']))
			$this->nacimiento=$_POST['nacimientoPaciente'];
		//si tiene obra social
		if(isset($_POST['idObraSocial'])){
			for($i = 0 ; $i < sizeof($_POST['idObraSocial']); $i++){
				$this -> obrasSociales[$i] = new ObraSocialPaciente($i);
			}
		}

	}

	public function getDni(){
		return $this -> dni;
	}

	public function setDni($newDni){
		$this -> dni = $newDni;
	}

	public function getNombre(){
		return $this -> nombre;
	}

	public function setNombre($newNombre){
		$this -> nombre = $newNombre;
	}

	public function getApellido(){
		return $this -> apellido;
	}

	public function setApellido($newApellido){
		$this -> apellido = $newApellido;
	}

	public function getTelefono(){
		return $this -> telefono;
	}

	public function setTelefono($newTelefono){
		$this -> telefono = $newTelefono;
	}

	public function getDireccion(){
		return $this -> direccion;
	}

	public function setDireccion($newDireccion){
		$this -> direccion = $newDireccion;
	}

	public function getId(){
		return $this -> id;
	}

	public function setId($id){
			$this->id = $id ;
		}

	public function getNacimiento(){
			return $this->nacimiento;
		}

	public function setNacimiento($nacimiento){
		$this->nacimiento = $nacimiento;
	}

	/** cargar */
	/**
	* Recibe como parametro la clave primaria del registro y lo carga de la base de datos
	*/
	public function cargar($clavePrimaria){


	}


	/** guardar */
	/**
	* guarda el registro (que ya debe estar con todos los valores previamente seteados) en la base de datos
	*/	
	public function guardar(){
		//aca se ve si el id es nulo, se hace la carga como si fuera nuevo INSERT, si el id es distinto de nulo lo que hay que hacer es un UPDATE
		if($this->id == null){
			//GUARDAR  VIEJO, HAY QUE TERMINARLO
			$sql = "INSERT INTO pacientes (dni,nombre,apellido,telefono, direccion, nacimiento,id) VALUES ('$this->dni','$this->nombre','$this->apellido','$this->telefono','$this->direccion','$this->nacimiento', null)";
			//echo $sql;
    			ConexionBD::obtenerInstancia()->consultar($sql);
    		//asignar el id con el que se guarda, sino nos va a quedar el objeto suelto dando vueltas con un id nulo, modificamos el mismo objeto, le damos guardar y nos lo guarda con un id nuevo, porque nunca se le asigna
    		if(isset($_POST['idObraSocial']))			
				for($i = 0 ; $i < sizeof($_POST['idObraSocial']); $i++){
					//obtengo id de paciente para inicializar la clase ObraSocialPaciente
					$respuesta = ConexionBD::obtenerInstancia()->selectMax("pacientes", "id");
	    			$fila = mysqli_fetch_array($respuesta, MYSQLI_NUM);
	    			$parametro = $fila[0];
					$this -> obrasSociales[$i] -> setIdPaciente($parametro);
				}
		}else{
			$sql = "UPDATE pacientes SET dni='{$this->dni}', nombre='{$this->nombre}' , apellido='{$this->apellido}', direccion='{$this->direccion}', telefono='{$this->telefono}', nacimiento='{$this->nacimiento}' WHERE id='{$this->id}'";
    			ConexionBD::obtenerInstancia()->consultar($sql);
    			//Borro obras sociales ya creadas
			$sql = "DELETE FROM obrassocialespacientes WHERE idPaciente={$this->id}";
    			ConexionBD::obtenerInstancia()->consultar($sql);

    		if(isset($_POST['idObraSocial']))
				for($i = 0 ; $i < sizeof($_POST['idObraSocial']); $i++){
					$this -> obrasSociales[$i] -> setIdPaciente($this->id);
				}
		}

		if(!empty($this -> obrasSociales)){
			for($i = 0 ; $i < sizeof($_POST['idObraSocial']); $i++){
				$this -> obrasSociales[$i] -> guardar();
			}

    		}
		
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
			$sql = "DELETE FROM pacientes WHERE id=".$this->id;
			ConexionBD::obtenerInstancia()->consultar($sql);

		}
	}

	/** Traer Todos */
	/**
	* metodo de clase. Me trae todos los miembros de la clase en BD (como respuesta de ajax)
	*/
	public static function traerTodos(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

		$sql = "SELECT * FROM pacientes";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
	}

	public function existeDNI(){
		$sql = "SELECT * FROM pacientes WHERE dni=".$this->dni . " AND id!='".$this->id."'";
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta->num_rows > 0;
	}

	public function traerPaciente(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

		$sql = "SELECT * FROM pacientes WHERE id=".$this->id;
	        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	        return $respuesta;
	}

	public function traerObrasSocialesDePaciente(){	

		$sql = "SELECT * FROM obrassocialespacientes,obrasSociales WHERE idPaciente = '" . $this->id ."' and obrasSociales.id=obrassocialespacientes.idObraSocial";
        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
        return $respuesta;
	}

	public function traerTratamientosDePaciente(){	

		$sql = "SELECT * FROM tratamientos WHERE idPaciente = " . $this->id;
        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
        return $respuesta; 
	}


}
?>
