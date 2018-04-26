<?php
/***********************************************************************
 * Author:  juangini
 ***********************************************************************/
class ConexionBD
{
/* * * * * * * * * Atributos * * * * * * * * * */
	//instancia de tipo ConexionDB
	private static $instancia;
	/****** datos de la conexion******/
	private $conexion;
	private $usuario;
	private $pass;
	private $host;
	private $database;

/* * * * * * *  Metodos  * * * * * * * * * * * */
	private function __construct()
	{
		$this -> host = "localhost";
		$this -> usuario = "root";
		$this -> pass = "";
		$this -> database = "kjfldr";
	}


	//self se usa como $this pero para atributos y metodos estaticos
	public static function obtenerInstancia()
	{
		if (is_null(self::$instancia)) {
			//host, usuario, contraseña, database
			self::$instancia = new ConexionBD();
	   	}
	   	return (self::$instancia);
	}

	public function connect()
	{
		//host, usuario, contraseña, database
		$this -> conexion = mysqli_connect($this -> host,$this -> usuario,$this -> pass,$this -> database)
			or die("Error de conexion a la base de datos: " . mysqli_connect_errno());
	}

	public function disconnect()
	{
	   mysqli_close($this -> conexion);
	}

	//retorna mysqli_result object
	public function selectAll($tabla)
	{
		$resultado = null;
		$this -> connect();
		$resultado = mysqli_query($this -> conexion, "SELECT * FROM " . $tabla);
		$this -> disconnect();

		return($resultado);
	}


	public function selectWhere($tabla, $columna, $operador, $valor)
	{
		$resultado = null;
		$this -> connect();

		$consulta = "SELECT * FROM " . $tabla . " WHERE " . $columna . $operador . $valor;

	   	$resultado = mysqli_query($this -> conexion, $consulta);
	   	$this -> disconnect();
		return($resultado);
	}

	//SELECT MAX(column_name) FROM table_name;
	public function selectMax($tabla, $columna){
		$respuesta = null;
		//if(is_string($tabla) && is_string($columna)){
			$this-> connect();
			$consulta = "SELECT MAX(" . $columna . ") FROM " . $tabla;
			$respuesta = mysqli_query($this -> conexion, $consulta);
		//}
		return ($respuesta);
	}

	//si insertamos, seran todos los valores de una tabla
	//string, string
	//retorna true o false
	public function insertInto($tabla, $valores)
	{
		$resultado = null;
		$this -> connect();
		$consulta = "INSERT INTO " . $tabla . " VALUES (" ;
		$consulta = $consulta . $valores . ");";
		$resultado = mysqli_query($this -> conexion, $consulta);
		$this -> disconnect();
		return($resultado);
	}

	public function consultar($sql){
        //esto muestra los errores de php
        error_reporting(-1);
        $this -> connect();
        $resultado = mysqli_query($this->conexion,$sql);
        $this -> disconnect();
        return $resultado;

    }

    public function obtenerArray($result)
    /*Se ingresa el resultado de una consulta y devuelve UNA fila de la tabla, usar varias veces para obtener todos los registros*/
    {
    	return mysql_fetch_array($result,MYSQL_BOTH);
    }



    /** eliminar */
	/**
	* Le paso una tabla y clave y me elimina ese registro de la BD. Devuelve boolean indicando si se pudo eliminar con exito
	*/
    public function eliminar($tabla, $id){
    	//comillas dobles evalua
    	$sql = "DELETE * FROM $tabla WHERE id=$id";
    	$this -> connect();
    	$resultado = mysqli_query($this->conexion,$sql);
    	$this -> disconnect();
    	return $resultado;
    }


    //es el mismo metodo que el anterior, por las dudas lo pongo
    public function getFetch_array($query){
    	return mysqli_fetch_array($query);
    }

    public function nFilas($sql){
        return mysqli_num_rows($sql);
    }


}

?>
