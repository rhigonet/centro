<?php 
$d = getdate();
$return = Array('ok'=>TRUE);
$upload_folder ='./derivacionesMedicas/id'. $_POST['idPaciente'] .'/';
$nombre_archivo = date('Y').date('m').date('d').time().$_FILES['archivo']['name'];
$tipo_archivo = $_FILES['archivo']['type'];
$tamano_archivo = $_FILES['archivo']['size'];
$tmp_archivo = $_FILES['archivo']['tmp_name'];
$archivador = $upload_folder . '/' . $nombre_archivo;

echo $nombre_archivo;
if(!is_dir($upload_folder)){	
	 mkdir($upload_folder);
	 if (!move_uploaded_file($tmp_archivo, $archivador)) {
		$return = Array('ok' => FALSE, 'msg' => "Ocurrio un error al subir el archivo. ".$nombre_archivo." No pudo guardarse. en la carpeta  " . $archivador, 'status' => 'error');
	}
}else{
	if (!move_uploaded_file($tmp_archivo, $archivador)){
		$return = Array('ok' => FALSE, 'msg' => "Ocurrio un error al subir el archivo. ".$nombre_archivo." No pudo guardarse.", 'status' => 'error');
	}
	
}


header('Content-Type: application/json');
echo json_encode($return);
?>