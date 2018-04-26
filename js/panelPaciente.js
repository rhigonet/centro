$.fn.initPanelPaciente = function () {

  $(function(){
      setnObrasSociales(0); //run my_fun() ondomready
  });
  $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosPacientes"},
    url: "./api.php", success: function(datos,texto,jqXHR){

            $("#panelPaciente").empty();
      //Accedemos a la informacion como datos.pacientes[<numero>].<atributo>
      for (var i = 0; i < datos.pacientes.length; i++) {
        var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un paciente eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El paciente ha sido eliminado correctamente.", "success");eliminarPaciente('+datos.pacientes[i].id+')});';
        var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
        var botonModificar = '<button type="button" onclick="modificarPaciente('+datos.pacientes[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
        var botonVer= '<button onclick="verPaciente('+datos.pacientes[i].id+')" type="button" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Ver</button>';
        $("#panelPaciente").append(
                  '<li name="resultadoPacientes" class="list-group-item row"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" name="namePacientes">'+datos.pacientes[i].nombre+' '+datos.pacientes[i].apellido+' - '+datos.pacientes[i].dni+' </div><div class="col-lg-4"><div class="btn-group" role="group" aria-label="...">'+botonVer+botonModificar+botonEliminar+'</div></div></li>'
        );
      }
      }
  });
};


$.fn.checkboxObraSocial = function () {

  $(function(){
      setnObrasSociales(0); //run my_fun() ondomready
  });

  if($("#checkboxObraSocial").is(':checked')){

    $("#agregarObraSocialPaciente").empty();
    $("#agregarObraSocialPaciente").append('<div id="pepe"><b>Obras Sociales del Paciente:</b></div>');

      cargarNuevaObraSocial();

      var html = '<div class="row" style="margin-top: 3%"><div style="float: right; margin-top: 5%"><button type="button" class="btn btn-default" id="botonAgregarObraSocial"><span class="glyphicon glyphicon-plus"  style="color: #E74C3C" aria-hidden="true"></span></button></div></div>';

      html +='<script type="text/javascript" src="js/panelPaciente.js"/>';
        $("#agregarObraSocialPaciente").append(html);

  }
  else{
      $("#agregarObraSocialPaciente").empty();console.log('cerrando');
    }
};

function cargarEnSelect(id_obra = null, numero_obra){//cargo las obras sociales en el select
  console.log('nObrasSociales: '+numero_obra);
  $.ajax({
        type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosObrasSociales"},
        url: "./api.php", success: function(datos,texto,jqXHR){
      var html='';
      console.log(datos.obrassociales);
      //Accedemos a la informacion como datos.obrassociales[<numero>].<atributo>
      for (var i = 0; i < datos.obrassociales.length; i++) {
        html+='<option value="'+datos.obrassociales[i].id +'" ';

        if(id_obra == datos.obrassociales[i].id)
          html+='selected';

          html += '>'+datos.obrassociales[i].nombre+'</option>';
      }
         $("#selectObrasSociales" + numero_obra).html(html);

      }
  });
}


$( "#botonNuevoPaciente" ).click(function() {
        $("#dniPaciente").prop('readonly', false);
        $("#tituloModal").text("Alta de Paciente");

        $("#idPaciente").val(null);
        $("#dniPaciente").val(null);
        $("#nombrePaciente").val(null);
        $("#apellidoPaciente").val(null);
        $("#direccionPaciente").val(null);
        $("#nacimientoPaciente").val(null);
        $("#telefonoPaciente").val(null);

        $("#agregarObraSocialPaciente").empty();
        $("#agregarObraSocialPaciente").val('<label class="custom-control custom-checkbox" style="padding: 5%; width: 100%"><input type="checkbox" id="checkboxObraSocial" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description" style="font-weight: normal">Obra Social</span></label>');
        $("#checkboxObraSocial").prop('checked', false);

        $("#error").empty();
        $("#error").hide();

});

//modificar, guardar es lo mismo casi, varian en que no tiene el campo oculto de id
function guardarPaciente(){
    var error=0;
    $("#error").hide();
    $("#error").empty();
    $("#error").append('Verifique: <br>');


    if ($("#dniPaciente").val() == '' || $("#dniPaciente").val().length < 7 ||  $("#dniPaciente").val().length > 9 )
    {
      error=1;
      $("#error").append('El DNI del paciente.</br>');
    }

    if ($("#nombrePaciente").val() == '' || $("#nombrePaciente").val().length < 2)
    {
      error=1;
      $("#error").append('El nombre del paciente.</br>');
    }

    if ($("#apellidoPaciente").val() == '' || $("#apellidoPaciente").val().length < 1)
    {
      error=1;
      $("#error").append('El apellido del paciente.</br>');
    }

    if ($("#nacimientoPaciente").val() == '')
    {
      /*error=1;
      $("#error").append('El paciente debe tener una Fecha de Nacimiento</br>');*/
    }else {
      //cambio fecha a formato ISO para poder guardarla
        var texto = $("#nacimientoPaciente").val();
        var arreglo = texto.split("/");
        console.log(arreglo.length);
        //la fecha ya está en formato ISO
      if (arreglo.length==1){
        var nacimientoPaciente = texto;
      }else{
        //la fecha no está en formato ISO
        var nacimientoPaciente = arreglo[2] + "-" + arreglo[1] + "-" + arreglo[0];
      }
    }

    if ($("#direccionPaciente").val() == '')
    {
      /*error=1;
      $("#error").append('El paciente debe tener una Direccion</br>');*/
    }

    for(var i=1; i<=nObrasSociales;i++){
      if ($("#numeroAfiliado"+i).val() == '')
      {
        error=1;
        $("#error").append('Todas las Obras Sociales deben tener su numero de afiliado</br>');
      }
    }

    var numeroAfiliado = new Array();
    var selectObrasSociales = new Array();
    for(var i=1; i<=nObrasSociales;i++){
        numeroAfiliado[i-1] = $("#numeroAfiliado"+i).val();
        selectObrasSociales[i-1] = $("#selectObrasSociales"+i).val();
    }

        if(error==0)
        $.ajax({
                type: "POST",cache: false,   dataType:'json', data: {"t":"guardarPaciente", "idPaciente": $("#idPaciente").val() , "nombrePaciente": $("#nombrePaciente").val() , "apellidoPaciente": $("#apellidoPaciente").val() , "direccionPaciente": $("#direccionPaciente").val() , "telefonoPaciente": $("#telefonoPaciente").val() , "nacimientoPaciente": nacimientoPaciente , "dniPaciente": $("#dniPaciente").val(), "numeroAfiliado":numeroAfiliado, "idObraSocial":selectObrasSociales },
                url: "./api.php", success: function(datos,texto,jqXHR){
                  if(datos.err == 0)
                  {
                        if($("#idPaciente").val() != '')
                          swal("Buen trabajo!", "El paciente ha sido modificado correctamente!", "success");
                        else
                          swal("Buen trabajo!", "El paciente ha sido agregado correctamente!", "success");

                        $("#botonNuevoPaciente").click();
                        $().initPanelPaciente();
                        $("#error").empty();
                        $("#error").hide();

                  }
                  else if(datos.err == 1)
                  {
                    $("#error").empty();
                    $("#error").append('<b>Por favor mire los siguiente errores</b></br>');
                    $("#error").append(datos.txerr);
                    $("#error").show();


                  }
                }
        });
      else
        $("#error").show();
}


function verPaciente(id){

        $("#mainPanel").load("panelVerPaciente.html");
        $().initPanelVerPaciente(id);


}

function modificarPaciente(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerPaciente","idPaciente":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){
                          $("#botonNuevoPaciente").click();
                          $("#tituloModal").text("Modificar Paciente");
                          //$("#agregarObraSocialPaciente").hide(true);


                          $("#idPaciente").val(datos.paciente[0].id);
                          $("#dniPaciente").val(datos.paciente[0].dni);
                          //$("#dniPaciente").prop('readonly', true);
                          $("#nombrePaciente").val(datos.paciente[0].nombre);
                          $("#apellidoPaciente").val(datos.paciente[0].apellido);
                          $("#direccionPaciente").val(datos.paciente[0].direccion);
                          //cambio presentacion fecha
                          //var texto = datos.paciente[0].nacimiento;
                          //var arreglo = texto.split("-");
                          //var nacimientoPaciente = arreglo[2] + "/" + arreglo[1] + "/" + arreglo[0];
                          //fin
                          //$("#nacimientoPaciente").val(nacimientoPaciente);
                          $("#nacimientoPaciente").val(datos.paciente[0].nacimiento);
                          $("#telefonoPaciente").val(datos.paciente[0].telefono);

                  });
            }
        });

                $.ajax({
          type: "POST",cache: false,   dataType:'json' ,  data: {"t":"traerObraSocialPorIdPaciente","idPaciente":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){

                        $("#agregarObraSocialPaciente").append('<div id="pepe"></div>');
                  if(datos.obrassocialesporpaciente.length > 0)
                    {
                      for(var i=0;datos.obrassocialesporpaciente.length > i; i++)
                      {

                        $("#checkboxObraSocial").prop("checked", "checked");

                        cargarNuevaObraSocial(datos.obrassocialesporpaciente[i].idObraSocial,datos.obrassocialesporpaciente[i].numeroafiliado);

                      }
                      var html = '<div class="row" style="margin-top: 3%"><div style="float: right; margin-top: 5%"><button type="button" class="btn btn-default" id="botonAgregarObraSocial"><span class="glyphicon glyphicon-plus"  style="color: #E74C3C" aria-hidden="true"></span></button></div></div>';

                      html +='<script type="text/javascript" src="js/panelPaciente.js"/>';
                        $("#agregarObraSocialPaciente").append(html);
                    }
                    $(function(){
                        setnObrasSociales(i); //run my_fun() ondomready
                    });

                  });
            }
        });
}

function eliminarPaciente(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarPaciente","idPaciente":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){
                    console.log('GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL');
                  });
            }
        });
      $().initPanelPaciente();
}

$("#botonAgregarObraSocial").click(function evento(){
  cargarNuevaObraSocial();
});

var nObrasSociales;
function cargarNuevaObraSocial(id = null,numeroAfiliado = null){
  nObrasSociales++;
  $("#pepe").append('<div class="row campoObraSocial" id ="campoObraSocial'+nObrasSociales+'"style="margin-top: 3%"><div class="col-lg-5" style="margin-right: 0%"><div class="form-group"><select class="form-control" id="selectObrasSociales'+nObrasSociales+'" name="selectObrasSociales[]"></select></div></div><div class="col-lg-5" style="margin-top: 0%; margin-left: 0%"><div class="input-group"><input type="number" min=1 step=1 class="form-control" placeholder="Numero de Afiliado" value="'+numeroAfiliado+'" aria-describedby="basic-addon1" name="numeroAfiliado[]" id="numeroAfiliado'+nObrasSociales+'" ></div></div><div class="col-lg-2" style="margin-top: 0%; margin-left: 0%"><div class="input-group"><button type="button" class="btn btn-default" onclick="eliminarCampoObraSocial('+nObrasSociales+')"><span class="glyphicon glyphicon-remove" style="color: #E74C3C" aria-hidden="true"></span></button></div></div></div>');
  cargarEnSelect(id,nObrasSociales);
}

function borrarNuevaObraSocial(){
  nObrasSociales=0;

  $("#pepe").html('');
}

function setnObrasSociales(id){
  nObrasSociales=id;
}

function eliminarCampoObraSocial(nObra){
  if(document.getElementsByClassName('campoObraSocial').length==1)
  {
    console.log('cerrar');
  }
  else
    document.getElementById('campoObraSocial'+nObra).outerHTML  = '';
}
