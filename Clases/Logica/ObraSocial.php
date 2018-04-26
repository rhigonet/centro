<?php 
class ObraSocial{

/*********** ATRIBUTOS *****/
	//int
	private $id;
	//string
	private $nombre;


/********** METODOS ***************/

	public function __construct(){
		if(isset($_POST['idObraSocial']))
			$this->id=$_POST['idObraSocial'];
		
		if(isset($_POST['nombreObraSocial']))
			$this->nombre=$_POST['nombreObraSocial'];
	}

	public function getId(){
		return $this -> id;
	}

	public function setId ($id) {
		$this->id = $id;
	}

	public function getNombre(){
		return $this -> nombre;
	}

	public function setNombre($newNombre){
		$this -> nombre = $newNombre;
	}

	/** cargar */ 
	/**
	* Recibe como parametro la clave primaria del registro y lo carga de la base de datos
	*/
	public function cargar($clavePrimaria){
		$resultadoSQL = $this -> traerObraSocial();
		$fila = mysqli_fetch_array ($resultadoSQL, MYSQLI_ASSOC);

		$this -> $nombre = $fila['nombre'];

	}
	

	/** guardar */
	/**
	* guarda el registro (que ya debe estar con todos los valores previamente seteados) en la base de datos
	*/
	public function guardar(){
		//aca se ve si el id es nulo, se hace la carga como si fuera nuevo INSERT, si el id es distinto de nulo lo que hay que hacer es un UPDATE
			if($this->id == null)
			{
				$sql = "INSERT INTO obrassociales(id,nombre) VALUES (NULL,'{$this->nombre}')";
				//VER SI ES NECESARIOO EL ID
        		ConexionBD::obtenerInstancia()->consultar($sql);
			
			}
			else
			{

				$sql = "UPDATE obrassociales SET nombre='{$this->nombre}' WHERE id={$this->id}";
        		ConexionBD::obtenerInstancia()->consultar($sql);

			}
	}



		public static function traerTodos(){
	//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

				$sql = "SELECT * FROM obrassociales";
	    		$respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
	     		return $respuesta;
			}

		public function traerObraSocial(){
		//aca se ve si el id es nulo, es error, si el id es distinto de nulo lo que hay que hacer es un DELETE

			$sql = "SELECT * FROM obrassociales WHERE id=".$this->id;
		        $respuesta=ConexionBD::obtenerInstancia()->consultar($sql);
		        return $respuesta;
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
				$sql = "DELETE FROM obrassociales WHERE id=".$this->id;
				ConexionBD::obtenerInstancia()->consultar($sql);

			}
		}


		/** existe */
	/**
	* Recibe como parametro la clave primaria del registro y devuelve verdadero en caso de que exista un registro en la BD con ese ID
	*/
	public static function existe($clavePrimaria){
		$respuesta = false;
		$sql = "SELECT * FROM obrassociales WHERE id=$clavePrimaria";
	    $consulta=ConexionBD::obtenerInstancia()->consultar($sql);	
	    if($consulta!=null){
	    	$respuesta = true;
	    }
	    return($respuesta);
	}


}
?>
