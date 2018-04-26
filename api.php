<?php
session_start();

require_once('Clases/Persistencia/ConexionBD.php');

//Orden sera la orden enviada por ajax por el parametro t
$orden=$_REQUEST['t'];

//Inicializo respuesta
$respuesta=array('err'=>0,'txerr'=>'');

//Pedimos instancia DB
$con=ConexionBD::obtenerInstancia();

//SWITCH DE CONTROL
switch($orden){
        case 'traerTodosPacientes':
                require_once('Clases/Logica/Paciente.php');
                $rta=Paciente::traerTodos();
                $respuesta=array('err'=>0,'pacientes'=>armarArrayCon($rta));
                break;
        case 'traerPaciente':
                require_once('Clases/Logica/Paciente.php');
                $p=new Paciente();
                $rta=$p->traerPaciente();
                $rta2=$p->traerObrasSocialesDePaciente();
                $respuesta=array('err'=>0, 'paciente'=>armarArrayCon($rta));
                break;
        case 'traerVerPaciente':
                require_once('Clases/Logica/Paciente.php');
                require_once('Clases/Logica/Tratamiento.php');
                $p=new Paciente();

                $paciente=$p->traerPaciente();

                $obrasociales=$p->traerObrasSocialesDePaciente();
                $rta=$p->traerTratamientosDePaciente();
                $tratamientos=armarArrayCon($rta);

                for($i=0;$i<sizeof($tratamientos);$i++)
                {
                    $_POST['idTratamiento']=$tratamientos[$i]['id'];
                    $p=new Tratamiento();
                    $rta=$p->traerDiagnosticos();
                    $tratamientos[$i]['diagnosticos'] = armarArrayCon($rta);
                    //$rta=$p->traerTurnos();
                    //$tratamientos[$i]['sesiones'] = armarArrayCon($rta);
                }
                $respuesta=array('err'=>0, 'paciente'=>armarArrayCon($paciente), 'obrassociales'=>armarArrayCon($obrasociales), 'tratamientos'=>$tratamientos);
                break;
        case 'eliminarPaciente':
                require_once('Clases/Logica/Paciente.php');
                $p=new Paciente();
                $p->eliminar();
                $respuesta=array('err'=>0);
                break;
        case 'guardarPaciente':
                require_once('Clases/Logica/Paciente.php');
                require_once('Clases/Logica/ObraSocial.php');
                require_once('Clases/Logica/ObraSocialPaciente.php');


                $p=new Paciente();

                if($p->existeDNI())// &&$_POST['idPaciente'] == null )//$p->getId()==null)
                    $respuesta=array('err'=>1,'txerr'=>'Existe un paciente con ese DNI');
                else
                    $p->guardar();
                break;
        case 'traerTodosDiagnosticos':
                require_once('Clases/Logica/Diagnostico.php');
                $rta=Diagnostico::traerTodos();
                $respuesta=array('err'=>0,'diagnosticos' => armarArrayCon($rta));
                break;
        case 'traerTodosMedicos':
                require_once('Clases/Logica/Medico.php');
                $rta=Medico::traerTodos();
                $respuesta=array('err'=>0,'medicos'=>armarArrayCon($rta));
                break;
        case 'guardarDiagnostico':
                require_once('Clases/Logica/Diagnostico.php');
                $p = new Diagnostico();
                $p->guardar();
                break;
        case 'traerTodosAparatos':
                require_once('Clases/Logica/Aparato.php');
                $rta=Aparato::traerTodos();
                $respuesta=array('err'=>0,'aparatos'=>armarArrayCon($rta));
                break;
        case 'traerAparato':
                require_once('Clases/Logica/Aparato.php');
                $p=new Aparato();
                $rta=$p->traerAparato();
                $respuesta=array('err'=>0, 'aparato'=>armarArrayCon($rta));
                break;
        case 'guardarAparato':
                require_once('Clases/Logica/Aparato.php');
                $p=new Aparato();
                $p->guardar();
                break;
        case 'traerTodosObrasSociales':
                require_once('Clases/Logica/ObraSocial.php');
                $rta=ObraSocial::traerTodos();
                $respuesta=array('err'=>0,'obrassociales'=>armarArrayCon($rta));
                break;
        case 'eliminarAparato':
                require_once('Clases/Logica/Aparato.php');
                $p = new Aparato();
                $p->eliminar();
                $respuesta=array('err'=>0);
                break;
        case 'traerObraSocial':
                require_once('Clases/Logica/ObraSocial.php');
                $p=new ObraSocial();
                $rta=$p->traerObraSocial();
                $respuesta=array('err'=>0, 'obrasocial'=>armarArrayCon($rta));
                break;
        case 'guardarObraSocial':
                require_once('Clases/Logica/ObraSocial.php');
                $p=new ObraSocial();
                $p->guardar();
                break;
        case 'eliminarDiagnostico':
                require_once('Clases/Logica/Diagnostico.php');
                $d=new Diagnostico();
                $d->eliminar();
                $respuesta=array('err'=>0);
                break;
        case 'traerMedico':
                require_once('Clases/Logica/Medico.php');
                $m=new Medico();
                $rta=$m->traerMedico();
                $respuesta=array('err'=>0, 'medico'=>armarArrayCon($rta));
                break;
        case 'guardarMedico':
                require_once('Clases/Logica/Medico.php');
                $m=new Medico();
//---- Compruebo que la matricula del medico que se este cargando no este almacenada
                if($m->existeMatricula())
                    $respuesta=array('err'=>1,'txerr'=>'Existe un medico con esa matricula');
                else{
                    $m->guardar();
                    $respuesta=array('err'=>0);
                }
                break;
        case 'eliminarMedico':
                require_once('Clases/Logica/Medico.php');
                Medico::eliminar($_REQUEST['idMedico']);
                $respuesta=array('err'=>0);
                break;


        case 'eliminarObraSocial':
                require_once('Clases/Logica/ObraSocial.php');
                $p = new ObraSocial();
                $p->eliminar();
                $respuesta=array('err'=>0);
                break;
        case 'traerDiagnostico':
                require_once('Clases/Logica/Diagnostico.php');
                $m=new Diagnostico();
                $rta=$m->traerDiagnostico();
                $respuesta=array('err'=>0, 'diagnostico'=>armarArrayCon($rta));
                break;


        case 'traerObraSocialPorIdPaciente':
                require_once('Clases/Logica/ObraSocialPaciente.php');
                $rta=ObraSocialPaciente::traerTodosPorIdPaciente();
                $respuesta=array('err'=>0, 'obrassocialesporpaciente'=>armarArrayCon($rta));
                break;
        case 'eliminarTratamiento':
            require_once("Clases/Logica/Tratamiento.php");
            $t = new Tratamiento();
            $t -> eliminar();
            $respuesta=array('err'=>0);
            break;
	    case 'traerTodosTratamientos':
            require_once('Clases/Logica/Tratamiento.php');
            $rta=Tratamiento::traerTodos();
            $respuesta=array('err'=>0,'tratamientos'=>armarArrayCon($rta));
            break;
        case 'guardarTratamiento':
            require_once('Clases/Logica/Tratamiento.php');
	        require_once('Clases/Logica/TratamientoDiagnostico.php');
            require_once('Clases/Logica/TratamientoAparato.php');

            $m=new Tratamiento();
            $m->guardar();

	    //Obtengo el id del Traramiento recien guardado
            if($_POST['idTratamiento'] == null)
                $_POST['idTratamiento'] = $m->getId();
            $diagnosticos=json_decode($_POST['arrayDiagnosticos']);
            TratamientoDiagnostico::eliminarTodosPorIdTratamiento();
            for ($i=0 ; $i<sizeof($diagnosticos) ; $i++) {
                $td = new TratamientoDiagnostico();
                $td->setidDiagnostico($diagnosticos[$i]);
                $td->guardar();
            }
        // Guardo los aparatos
            //Obtengo el id del tratamiento recien guardado
            if($_POST['idTratamiento'] == null)
                $_POST['idTratamiento'] = $m->getId();
            $aparatos = json_decode($_POST['arrayAparatos']);
            TratamientoAparato::eliminarTodosPorIdTratamiento();
            for($i = 0; $i<sizeof($aparatos) ; $i++){
                $td = new TratamientoAparato();
                $td->setidAparato($aparatos[$i]);
                $td->guardar();
            }
            break;
	case 'traerTratamiento':
            require_once('Clases/Logica/Tratamiento.php');
            require_once('Clases/Logica/Aparato.php');
            $t = new Tratamiento();
            $tratamientos = armarArrayCon($t->traerTratamiento());
            $rta=$t->traerDiagnosticos();
            $tratamientos[0]['diagnosticos'] = armarArrayCon($rta);
            $rta = $t->traerAparatos();
            $aparatos = armarArrayCon($rta);
            $tratamientos[0]['aparatos'] = $aparatos;
            $respuesta=array('err' => 0, 'tratamiento'=>$tratamientos);//, 'aparatos'=>$aparatos);
            break;
        case 'traeTratamientoPorIdPaciente':
                require_once('Clases/Logica/Tratamiento.php');
                $rta=Tratamiento::traerTodosPorIdPaciente();
                $tratamientos=armarArrayCon($rta);

                for($i=0;$i<sizeof($tratamientos);$i++)
                {
                    $_POST['idTratamiento']=$tratamientos[$i]['id'];
                    $_POST['fechaInicio']=$tratamientos[$i]['fechaInicio'];
                    $p=new Tratamiento();
                    $rta=$p->traerDiagnosticos();
                    $tratamientos[$i]['diagnosticos'] = armarArrayCon($rta);
                    //$rta=$p->traerTurnos();
                    //$tratamientos[$i]['sesiones'] = armarArrayCon($rta);
                }
                $respuesta=array('err'=>0, 'tratamientos'=>$tratamientos);
                break;
        case 'eliminarTurno':
            require_once("Clases/Logica/Tratamiento.php");
            require_once("Clases/Logica/Turno.php");
            $t = new Turno();
            $t -> eliminar();
            $respuesta=array('err'=>0);
            break;
        case 'eliminarSesion':
            require_once("Clases/Logica/Sesion.php");
            $s = new Sesion();
            $s -> eliminar();
            $respuesta=array('err'=>0);
            break;

        case 'traerTurnosSemana':
            require_once("Clases/Logica/Turno.php");

            $rta = Turno::traerTodosSemana($_POST['fechaInicio'], $_POST['fechaFin']);
            $respuesta = array('err' => 0 , 'turnos'=>armarArrayCon($rta));

            break;

        case 'traerResultadoMedicos':
            require_once('Clases/Logica/Medico.php');
            $t = new Medico();
            $rta= $t -> buscar($_POST['bus']);
            $respuesta= array('err'=>0, 'medicos'=>armarArrayCon($rta));
            break;

        case 'buscarTurno':
            require_once('Clases/Logica/Turno.php');
            $rta = Turno::traerTodosFecha();
            $respuesta= array('err'=>0, 'turnos'=>armarArrayCon($rta));
            break;

        case 'guardarTurno': //TERMINAR
            // require_once("Clases/Logica/Tratamiento.php");
            require_once("Clases/Logica/Turno.php");
            $t = new Turno();
            $t -> guardar();
            $respuesta=array('err'=>0);
            break;
        case 'buscarTurnoPaciente':
            require_once("Clases/Logica/Turno.php");
            $rta = Turno::traerTodosPaciente();
            $respuesta= array('err'=>0, 'turnos'=>armarArrayCon($rta));
            break;
    case 'actualizarEvolucionTratamiento':
        require_once("Clases/Logica/Tratamiento.php");
        $t = new tratamiento();
        $t->actualizarEvolucion();
        $respuesta=array('err'=>0);
        break;

        case 'guardarPersonaGimnasio':
                $sql = "INSERT INTO personasgimnasio (nombre) VALUES ("."'$_POST[nombre]'".")";
                $con->consultar($sql);
                $sql="SELECT MAX(id) FROM `personasgimnasio`";
                $rta=$con->consultar($sql);
                $id=$con->getFetch_array($rta);
                $sql = "INSERT INTO pagosgimnasio (id,fecha,pago) VALUES ('$id[0]', '$_POST[fecha]', '0')";
                $con->consultar($sql);
        break;

        case 'traerTodosGimnasio':
                $sql = "SELECT personasgimnasio.id as id, nombre, pago, fecha FROM personasgimnasio INNER JOIN pagosgimnasio ON personasgimnasio.id=pagosgimnasio.id where fecha='$_POST[fecha]'";
                $rta=$con->consultar($sql);
                $respuesta=array('err'=>0,'gimnasio'=>armarArrayCon($rta));
        break;

        case 'traerPersonasSelectGimnasio':
                $sql = " select * from personasgimnasio where personasgimnasio.id not in (select id from pagosgimnasio where fecha='$_POST[fecha]')";
                /*"SELECT DISTINCT nombre, personasgimnasio.id FROM personasgimnasio INNER JOIN pagosgimnasio ON personasgimnasio.id=pagosgimnasio.id WHERE fecha != '$_POST[fecha]' ";*/
                //select * from personasgimnasio where personasgimnasio.id not in (select id from pagosgimnasio where fecha='2017-06-01')
                $rta=$con->consultar($sql);
                $respuesta=array('err'=>0, 'personas'=>armarArrayCon($rta));
        break;

        case 'seleccionarParaEsteMes':
                $sql = "INSERT INTO pagosgimnasio (id,fecha,pago) VALUES ('$_POST[id]', '$_POST[fecha]', '0')";
                $con->consultar($sql);
        break;

        case 'pagarMes':
                $sql = "UPDATE  pagosgimnasio SET pago='1' WHERE id='$_POST[id]' AND fecha='$_POST[fecha]'";
                $con->consultar($sql);
        break;

        case 'borrarPago':
                $sql = "DELETE from  pagosgimnasio WHERE id='$_POST[id]' AND fecha='$_POST[fecha]'";
                $con->consultar($sql);
        break;

        case 'borrarPersonaGimnasio':
                $sql= "DELETE from  personasgimnasio WHERE id='$_POST[id]'";
                $con->consultar($sql);
        break;

        case 'cargarPersonasMesAnterior':
                $dA=$_POST['fechaA']; //fecha anterior
                $dD=$_POST['fechaD']; //fecha despues

                $sql = "SELECT personasgimnasio.id as id FROM personasgimnasio INNER JOIN pagosgimnasio ON personasgimnasio.id=pagosgimnasio.id where fecha='$dA'";
                $rta=$con->consultar($sql);
                $id=armarArrayCon($rta);
                $sql="INSERT INTO pagosgimnasio (id, fecha, pago) VALUES ";

                foreach ($id as $i){
                        $sql = $sql."($i[id],'$dD','0'), ";
                }

                $con->consultar(substr($sql, 0, -2));                
        break;

        case 'traerDeudoresGym':
            //$sql = "SELECT * FROM personasgimnasio WHERE pagosgimnasio.id EXISTS (SELECT id FROM pagosgimnasio WHERE pago=0)";
            $sql = "SELECT nombre, fecha, personasgimnasio.id as id from personasgimnasio INNER JOIN pagosgimnasio on personasgimnasio.id= pagosgimnasio.id WHERE pagosgimnasio.pago=0";            
            $rta= $con->consultar($sql);
            $respuesta=array('err'=>0, 'deudores'=>armarArrayCon($rta));
            break;

        // case 'buscarPersonaGimnasio':

        //     $sql = "SELECT * FROM personasgimnasio WHERE nombre";
        //     $rta=$con->consultar($sql);
        //     $respuesta=array('err'=>0, 'personas'=>armarArrayCon($rta));
        // break;
}

echo json_encode($respuesta);

function armarArrayCon($resDb){
        $array=array();
        while($datos  = $resDb->fetch_assoc()){
                $array[] = $datos;
        }
        return $array;
}
