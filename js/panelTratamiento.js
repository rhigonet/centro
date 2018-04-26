$.fn.initPanelTratamiento = function (id) {
 $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerVerPaciente","idPaciente":id},
    url: "./api.php", success: function(datos,texto,jqXHR){

            var html='';
            for(var i=0; i < datos.tratamientos.length;i++)
            {

              html += '<li class="list-group-item row"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" id="tratamiento';
              html+=datos.tratamientos[i].id;
              html+='">';

              //Fecha de inicio
              html += '<b>Ingreso: </b>'+datos.tratamientos[i].fechaInicio+' - ';

              //Diagnosticos
              html+='<b>Diagnostico: </b>';
              for(var k=0;k<datos.tratamientos[i].diagnosticos.length;k++)
              {
                html += datos.tratamientos[i].diagnosticos[k].codigo+' ';
              }

              html+= '</div><div class="col-lg-4"><div class="btn-group" role="group" style="float:right;"  aria-label="Basic example">';

              var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un tratamiento eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El tratamiento ha sido eliminado correctamente.", "success");eliminarTratamiento('+datos.tratamientos[i].id+')});';
              var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
              var botonModificar = '<button type="button" onclick="modificarTratamiento('+datos.tratamientos[i].id+');" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
              var botonVer= '<button onclick="verTratamiento('+datos.tratamientos[i].id+')" type="button" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Ver</button>';
              html += botonVer + botonModificar + botonEliminar;
              html += '</div></div></li>';
              cargarSelects(0,0);
              cargarSelectTratamientos(0);
              cargarSelectObraSocial(0);

          }
          $("#TratamientosPaciente").html(html);
        }
      });
};

function verTratamiento(idTratamiento){

        //ESTA ES LA PARTE QUE MUESTRA EL TRATAMIENTO
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerTratamiento", "idTratamiento":idTratamiento},
          url: "./api.php", success: function(datos,texto,jqXHR){

                  //$('#tituloModalTurnos').html();
                  var diag=datos.tratamiento[0].diagnosticos[0].descripcion;
                  for(var i=1; datos.tratamiento[0].diagnosticos[i] ; i++){
                          diag = diag + " - "+ datos.tratamiento[0].diagnosticos[i].descripcion;
                  }
                  $('#diagnostico').html(diag);

                  $('#nroSesiones').html(datos.tratamiento[0].nroSesiones);
                  $('#evolucion').val(datos.tratamiento[0].evolucion);

                  $("#tratamientoID").val(idTratamiento); //Lo necesito para insertar en turnosxtratamientos
                   $('#tratamientoSiguiente').val(datos.tratamiento[0].tratamientoSiguiente);
                    $('#tratamientoAnterior').val(datos.tratamiento[0].tratamientoAnterior);


                  $.ajax({
                    type: "POST",cache: false,   dataType:'json', data: {"t":"traerMedico", "idMedico":datos.tratamiento[0].idMedico},
                    url: "./api.php", success: function(datos,texto,jqXHR){
                            html="";
                            html=datos.medico[0].matricula+" - "+datos.medico[0].nombre+" "+datos.medico[0].apellido;
                            $('#medico').html(html);
                       }
                  });

                  $('#obraSocial').html("-");
                  //alert(datos.tratamiento[0].idObraSocial);
                  if(datos.tratamiento[0].idObraSocial != null)
                          $.ajax({
                            type: "POST",cache: false,   dataType:'json', data: {"t":"traerObraSocial", "idObraSocial":datos.tratamiento[0].idObraSocial},
                            url: "./api.php", success: function(datos,texto,jqXHR){
                                    $('#obraSocial').html(datos.obrasocial[0].nombre);
                               }
                          });

                  if(datos.tratamiento[0].aparatos.length !=0){
                      var html="";
                        for (var i=0; i<datos.tratamiento[0].aparatos.length; i++){
                          html+='<li class="list-group-item col-md-4">';
                          html+=datos.tratamiento[0].aparatos[i].descripcion;
                          html+='</li>';

                          $('#listaAparatos').html(html);
                        }
                    }else{
                      $('#listaAparatos').html('<li class="list-group-item">-</li>');
                    }

                  $('#fechaDeInicio').html(datos.tratamiento[0].fechaInicio);

                  if(datos.tratamiento[0].derivacionMedica != "null"){
                        $('#derivacionM').html(datos.tratamiento[0].derivacionMedica);
                } else {

                }

                  $('#sesionAnteriorSiguiente').html("");

                  if(datos.tratamiento[0].tratamientoAnterior != null){
                          //$('#tratamientoAnterior').html(datos.tratamiento[0].tratamientoAnterior);
                          $('#sesionAnteriorSiguiente').append('<a onclick="mostrarTratamientoAnterior()" style="float: left; background-color: #3498DB; border-color: #3498DB" class="btn btn-primary btn-success"><span class="glyphicon glyphicon-arrow-left"></span>  </a>');
                  }

                 if(datos.tratamiento[0].tratamientoSiguiente != null){

                         // $('#tratamientoSiguiente').html(datos.tratamiento[0].tratamientoSiguiente);
                         $('#sesionAnteriorSiguiente').append('<a onclick="mostrarTratamientoSiguiente()" style="float: right; background-color: #3498DB; border-color: #3498DB" class="btn btn-primary btn-success"><span class="glyphicon glyphicon-arrow-right"></span>  </a>');
                  }

             }
        });

          //ACA HACEMOS EL MOSTRAR MODAL
        $('#modalVerTurnos').modal('show');
        //console.log(datos);
}

function seleccionarIdSegunClass(id = null, Class = null, idParticular = null){//cargo los nombres de los pacientes y de los medicos en los selects
  if(idParticular != null)
    Class=Class+idParticular;
  var arreglo = document.getElementsByClassName(Class);
  for (var i=0;i<arreglo.length;i++){
    if(arreglo[i].value==id)
      arreglo[i].selected = true;
   }

}

function cargarSelects(idMedico = null, idDiagnostico = null, idParticular = null){//cargo los nombres de los pacientes y de los medicos en los selects

  if(idMedico != null)
    $.ajax({

      type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosMedicos"},
        url: "./api.php", success: function(datos,texto,jqXHR){

            var html = "";
            //Accedemos a la informacion como datos.obrassociales[<numero>].<atributo>
            for (var i = 0; i < datos.medicos.length; i++) {

              html +=  "<option class='medico' value='" + datos.medicos[i].id +"'";
              if(idMedico == datos.medicos[i].id)
                  html += " selected ";
              html += ">" + datos.medicos[i].nombre + " " + datos.medicos[i].apellido + "</option>";

            }

            $('#selectMedicos').html(html);
            $('.selectpicker').selectpicker('refresh');
        }
    });
  if(idDiagnostico != null)
  {
    if(idParticular == null)
      idParticular = 1;
    $.ajax({
      type: "POST", cache: false, dataType:'json', data: {"t": "traerTodosDiagnosticos"},
      url: "./api.php", success: function(datos,texto,jqXHR){
        html= "";
        //Accedemos a la informacion como datos.diagnosticos[<numero>].<atributo>
        for (var i =0; i < datos.diagnosticos.length; i++) {

          html += "<option class='diagnostico"+idParticular+"' value='" + datos.diagnosticos[i].id+"'";
              if(idDiagnostico == datos.diagnosticos[i].id)
                  html += " selected ";
          html += ">" + datos.diagnosticos[i].codigo +'-'+ datos.diagnosticos[i].descripcion + "</option>";

        }

        $('#selectDiagnostico'+idParticular).html(html);
        $('.selectpicker').selectpicker('refresh');

      }
    });
  }

}


function cargarSelectObraSocial(idObraSocialSel = null){
  $.ajax({
    type: "POST", cache:false, dataType:'json', data: {"t":"traerObraSocialPorIdPaciente", "idPaciente":$("#idPaciente").val()},
      url: "./api.php", success: function(datos, texto,jqXHR){
        //console.log(datos.obrassocialesporpaciente);
        var html = "";
        var html = "<option class='obraSocial' value=''"
        if(idObraSocialSel == null)
          html+='selected ';
        html += ">Ninguna</option>";
        for(var i = 0; i < datos.obrassocialesporpaciente.length; i++){
          html += "<option class='obraSocial' value='" + datos.obrassocialesporpaciente[i].idObraSocial +"'";
          if(idObraSocialSel == datos.obrassocialesporpaciente[i].idObraSocial)
                html+=" selected ";
            html+= ">" + datos.obrassocialesporpaciente[i].nombre + '</option>';
        }

       $('#selectObraSocial').html(html);
       $('.selectpicker').selectpicker('refresh');

      }
  });
}

function cargarSelecAparato(idAparatoSel = null, idParticular = null){
    if(idParticular == null)
      idParticular = 1;

    $.ajax({
      type: "POST", cache: false, dataType:'json', data: {"t": "traerTodosAparatos"},
      url: "./api.php", success: function(datos,texto,jqXHR){
        html= "";
        //Accedemos a la informacion como datos.diagnosticos[<numero>].<atributo>
        for (var i=0; i < datos.aparatos.length; i++) {

          html += "<option class='aparato"+idParticular+"' value='" + datos.aparatos[i].id+"'";
              if(idAparatoSel == datos.aparatos[i].id)
                  html += " selected ";
          html += ">" + datos.aparatos[i].descripcion + "</option>";

        }
        $('#selectAparato'+idParticular).html(html);
        $('.selectpicker').selectpicker('refresh');
        

      }
    });
}

function cargarSelectTratamientos(idTratamiento = null){
  //console.log(idTratamiento);
  $.ajax({
    type: "POST", cache:false, dataType:'json', data: {"t":"traeTratamientoPorIdPaciente", "idPaciente":$("#idPaciente").val(), "idTratamiento":$("#idTratamiento").val()},
      url: "./api.php", success: function(datos, texto,jqXHR){
        var html = "<option class='tratamiento' value=''"
        if(idTratamiento == null)
          html+='selected ';
        html += ">Ninguno</option>";
        for(var i = 0; i < datos.tratamientos.length; i++){
          html += "<option class='tratamiento' value='" + datos.tratamientos[i].id +"'";
          if(idTratamiento == datos.tratamientos[i].id)
            html+=" selected ";
          html+=">" +'Inicio: '+ datos.tratamientos[i].fechaInicio +' '+ datos.tratamientos[i].diagnosticos[0].descripcion+ '</option>';
        }

       $('#selectTratamientos').html(html);
       $('#selectpicker').selectpicker('refresh')

      }
  });
}

function guardarTratamiento(){
    var error=0;
    $("#error").hide();
    $("#error").empty();
    $("#error").append('<b>Por favor mire los siguiente errores</b></br>');

    if ($("#nrosesiones").val() == '')
    {
      error=1;
      $("#error").append('El tratamineto debe tener al menos una sesion</br>');
    }
    var diagnosticos = document.getElementsByName('selectDiagnostico[]');
    var arrayD = new Array();
   // console.lo
    for(var i=0; i<diagnosticos.length;i++){
        arrayD[i] = diagnosticos[i].value;
    }

    var aparatos = document.getElementsByName('selectAparato[]');
    var arrayA = new Array();
    if(aparatos.length>0){
      for(var i=0; i<aparatos.length; i++)
        arrayA[i] = aparatos[i].value;
    }
    if(error == 0){
	var inputFileImage = document.getElementById("derivacionMedica");
        var file = inputFileImage.files[0];
        var data = new FormData();

        data.append('archivo', file);
        data.append('idPaciente', $('#idPaciente').val());
        var url = "upload.php";
        $.ajax({
            url: url,
            type: 'POST',
            contentType: false,
            data: data,
            processData: false,
            cache: false
        }).done(function(data){
          if(data.ok){
            //console.log("se subio con exito")
          }else {
            alert(data.msg)
          }
        });
//console.log(data);
      // var idObra ='null';
      // if(document.getElementById('checkboxObraSocial').checked)
      if ($("#selectObraSocial").val()==''){
        var idObra ='null';
      }
      else{
        var idObra = $("#selectObraSocial").val();
      }

        $.ajax({
            type: "POST",cache: false,   dataType:'json', data: {"t":"guardarTratamiento", "idTratamiento": $("#idTratamiento").val() , "idObraSocial": idObra, "idPaciente": $("#idPaciente").val() , "idMedico": $("#selectMedicos").val() , "nroSesiones": $("#nrosesiones").val(), "derivacionMedica": $("#derivacionMedica").val(), "arrayAparatos":JSON.stringify(arrayA),"arrayDiagnosticos":JSON.stringify(arrayD), "tratamientoAnterior": $("#selectTratamientos").val(),"fechaInicio": $("#fechaInicio").val()},
            url: "./api.php", success: function(datos,texto,jqXHR){
                    if($("#idTratamiento").val() != '')
                      swal("Buen trabajo!", "El tratamiento ha sido modificado correctamente!", "success");
                    else
                      swal("Buen trabajo!", "El tratamiento ha sido agregado correctamente!", "success");

                    $("#botonNuevoTratamiento").click();

            }
        });
          $().initPanelTratamiento($("#idPaciente").val());
    }else
        $("#error").show();
}

function eliminarTratamiento(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarTratamiento","idTratamiento":id},
          url: "./api.php", success: function(datos,texto,jqXHR){

            }
        });
        $().initPanelTratamiento($("#idPaciente").val());
}

function modificarTratamiento(id){
        //$('#contenedorAparatos').empty();
        //$('#contenedorAparatos').hide();
        //document.getElementById('contenedorAparatos').style.display = "block";
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerTratamiento","idTratamiento":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                          $("#botonNuevoTratamiento").click();
                          $("#tituloModal").text("Modificar tratamiento");


                          $("#idTratamiento").val(datos.tratamiento[0].id);
                          $('#nrosesiones').val(datos.tratamiento[0].nroSesiones);

                          $('#fechaInicio').val(datos.tratamiento[0].fechaInicio);
                          cargarSelectTratamientos(datos.tratamiento[0].tratamientoAnterior);


                          cargarSelects(datos.tratamiento[0].idMedico,datos.tratamiento[0].diagnosticos[0].id);
                          for(var i=1;i<datos.tratamiento[0].diagnosticos.length;i++){
                            agregarDiagnostico();
                            cargarSelects(null,datos.tratamiento[0].diagnosticos[i].id,i+1);

                          }

                          if(datos.tratamiento[0].aparatos.length>0){

                              //$('#checkboxAparato').prop("checked", "checked");
                              //$('#contenedorAparatos').show();
                              $('#contenedorAparatos').empty();
                              for(var i=0; i < datos.tratamiento[0].aparatos.length; i++){
                                agregarAparato(datos.tratamiento[0].aparatos[i].id);
                                //cargarSelecAparato(datos.tratamiento[0].aparatos[i].idAparato, i+1);
                              }
                          }


                          if(datos.tratamiento[0].derivacionMedica != null){
                            var valor = datos.tratamiento[0].derivacionMedica.substr(18);
                            //$("#derivacionMedica").val(valor);
                          }

                          if(datos.tratamiento[0].idObraSocial != null){
                            //$('#checkboxObraSocial').prop("checked", "checked");
                            //$('#seleccionarObraSocial').show();
                            cargarSelectObraSocial(datos.tratamiento[0].idObraSocial);
                          }
                         /* else
                          {
                            $('#checkboxObraSocial').prop("checked", false);
                            $('#seleccionarObraSocial').hide();
                          }*/



            }
        });
}

// Carga los resultados de la busqueda de medicos en resultado panelVerPaciente.html
function cargarResultadoBusquedaMedico(){
      $.ajax({
          type: "POST", cache: false, dataType: 'json', data: {"t":"traerTodosMedicos"},
          url: "./api.php", success: function(datos, texto, jqXHR){

              var html = '';
              for(var i = 0; i < datos.medicos.length; i++){
                html+= '<button name="resultadoBusquedaMedicos" type="button" style="margin-bottom:1px" class="list-group-item" name="resultadobusquedamedico" onclick="seleccionarIdSegunClass('+ datos.medicos[i].id +', \'medico\')">';
                html+= datos.medicos[i].nombre + " " + datos.medicos[i].apellido + " - " + datos.medicos[i].matricula;
                html+= '</button>'
              }
              $("#resultado").html(html);
          }
      });
 }

// Carga los resultados de la busqueda de medicos en resultado panelVerPaciente.html
function cargarResultadoBusquedaObraSocial(id){
  $("#bus").val('');
    $.ajax({
        type: "POST", cache: false, dataType: 'json', data: {"t":"traerObraSocialPorIdPaciente", "idPaciente": id},
        url: "./api.php", success: function(datos, texto, jqXHR){

            var html = '';

            for(var i = 0; i < datos.obrassocialesporpaciente.length; i++){

              html+= '<button name="resultadoBusquedaObraSociales" type="button" name="resultadoobrasociales" style="margin-bottom:1px" class="list-group-item" onclick="seleccionarIdSegunClass('+ datos.obrassocialesporpaciente[i].id +', \'obraSocial\')">';
              html+= datos.obrassocialesporpaciente[i].nombre + " - " + datos.obrassocialesporpaciente[i].numeroafiliado;
              html+= '</button>'
            }
            $("#resultadobusquedaobrassoaciales").html(html);
        }
    });
}

// Carga los resultados de la busqueda de medicos en resultado panelVerPaciente.html
function cargarResultadoBusquedaDiagnostico(id){
  $("#bus").val('');
    $.ajax({
        type: "POST", cache: false, dataType: 'json', data: {"t":"traerTodosDiagnosticos"},
        url: "./api.php", success: function(datos, texto, jqXHR){

            var html = '';
            for(var i = 0; i < datos.diagnosticos.length; i++){
              html+= '<button name="resultadoBusquedaDiagnosticos" type="button" class="list-group-item" style="margin-bottom:1px"  onclick="seleccionarIdSegunClass('+ datos.diagnosticos[i].id +', \'diagnostico\','+id+')">';
              html+= datos.diagnosticos[i].descripcion + " - " + datos.diagnosticos[i].codigo;
              html+= '</button>'
            }
            $("#resultadobusquedadiagnosticos").html(html);
        }
    });
}
// Carga los resultados de la busqueda de medicos en resultado panelVerPaciente.html
function cargarResultadoBusquedaAparato(id){
  $("#bus").val('');
    $.ajax({
        type: "POST", cache: false, dataType: 'json', data: {"t":"traerTodosAparatos"},
        url: "./api.php", success: function(datos, texto, jqXHR){

            var html = '';
            for(var i = 0; i < datos.aparatos.length; i++){
              html+= '<button name="resultadoBusquedaAparatos" type="button" name="resultadoaparato" style="margin-bottom:1px" class="list-group-item" onclick="seleccionarIdSegunClass('+ datos.aparatos[i].id +', \'aparato\','+id+')">';
              html+= datos.aparatos[i].descripcion;
              html+= '</button>'
            }
            $("#resultadobusquedaaparatos").html(html);
        }
    });
}

// Carga los resultados de la busqueda de medicos en resultado panelVerPaciente.html
function cargarResultadoBusquedaTratamiento(idPaciente, idTratamiento){
  $("#bus").val('');
    $.ajax({
        type: "POST", cache: false, dataType: 'json', data: {"t":"traeTratamientoPorIdPaciente","idPaciente": idPaciente,"idTratamiento": idTratamiento},
        url: "./api.php", success: function(datos, texto, jqXHR){

            var html = '';
            for(var i = 0; i < datos.tratamientos.length; i++){
              html+= '<button name="resultadoBusquedaTratamientos" type="button" class="list-group-item" name="resultadotratamientos" style="margin-bottom:1px;" onclick="seleccionarIdSegunClass('+ datos.tratamientos[i].id +', \'tratamiento\')">';

              //Fecha de inicio
              if(datos.tratamientos[i].fechaInicio != null)
                html += '<b>Ingreso: </b>'+datos.tratamientos[i].fechaInicio+' - ';

              //Diagnosticos
              html+='<b>Diagnostico: </b>';
              for(var k=0;k<datos.tratamientos[i].diagnosticos.length;k++)
              {
                html += datos.tratamientos[i].diagnosticos[k].codigo+' ';
              }

              //EGRESOS
              if((datos.tratamientos[i].nroSesiones==datos.tratamientos[i].sesionActual) && datos.tratamientos[i].fechaFin != null)
               html += '- <b>Egreso: </b>'+datos.tratamientos[i].fechaFin;
              html+= '</button>'
            }
            if(html == '')
              html += '<button type="button" class="list-group-item" name="resultadotratamientos" onclick="seleccionarIdSegunClass(\'\', \'tratamiento\')">El paciente no tiene tratamientos</button>';
            $("#resultadobusquedatratamientos").html(html);
        }
    });
}

function agregarDiagnostico(){
  var contenedor = document.getElementById('contenedorDiagosnticos');
  var diagnosticos = document.getElementsByClassName('Diagnostico');
  var ultimoId = diagnosticos[diagnosticos.length-1].title *1;
  var ultimoId = ultimoId + 1;
  var ultimoAumento = 34 * diagnosticos.length;

  var html = '<div class="row Diagnostico" title=\''+ultimoId+'\'>';
  html += '<select class="selectpicker" data-live-search="true" id="selectDiagnostico'+ultimoId+'" name="selectDiagnostico[]"  style="width:60%; float:left" readonly></select>';
 // html += '<button type="button"  onclick="$().botonBuscarDiagnostico('+ultimoId+'); $(\'#modalNuevoTratamiento\').hide();" class="btn btn-default" data-toggle="modal" data-target="#modalBuscarDiagnostico" style="position:fixed;margin-top: '+ultimoAumento+'px ;background-color: #3498DB; color:#ECF0F1; border-color: #3498DB" name="botonBuscarDiagnostico" aria-label="Left Align"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>';
  html += '<button type="button" class="btn btn-default"  onclick="eliminarCampoDiagnostico('+ultimoId+');"><span class="glyphicon glyphicon-remove" style="color: #E74C3C" aria-hidden="true"></span></button>';
  html += '</div>';
  cargarSelects(null,1,ultimoId);
  $('#contenedorDiagosnticos').append(html);
}

function eliminarCampoDiagnostico(id){
  var diagnosticos = document.getElementsByClassName('Diagnostico');
  for(var i=0;i < diagnosticos.length; i++)
    if(id == diagnosticos[i].title)
      diagnosticos[i].outerHTML  = '';

}

function calcularHoraFin(time, duracion){
  // usado en el ajax de ver turnos, calcula la hora de fin en base a la de inicio más la duracion
  hora=parseInt(time.split(":")[0]);
  minuto=parseInt(time.split(":")[1]);
  minuto+=parseInt(duracion);
  while(minuto>=60)
  {
    minuto=minuto-60;
    hora+=1;
    //supongo que la hora nunca va a pasar de 24, de lo contrario habría problemas en el control
  }
  hora=(hora<10)?("0"+hora):hora; //esto es para agregarle un 0 a la izquierda y que quede lindo nada mas
  minuto=(minuto<10)?("0"+minuto):minuto;
  //console.log(duracion);
  return (hora+":"+minuto+":"+time.split(":")[2]);
}

//.. id es el id con el que se cargara el aparato (para la modificacion), es decir, muestra el aparato que tiene que ser
function agregarAparato(id = null){
  //Me fijo si esta seleccionado el checkbox, si no lo esta no se deben agregar aparatos
      var contenedor = document.getElementById('contenedorAparatos');
      var aparatos = document.getElementsByClassName('Aparato');
      if(aparatos.length > 0){
        var ultimoId = aparatos[aparatos.length-1].title *1;
        var ultimoId = ultimoId + 1;
      }else
        var ultimoId = 1;
      var ultimoAumento = 34 * aparatos.length;

      var html = '<div class="row Aparato" title=\''+ultimoId+'\'>';
      html += '<select class="selectpicker" data-live-search="true" style="width:50%;" id="selectAparato'+ultimoId+'" name="selectAparato[]" readonly ></select>';
      //html += '<button type="button"  onclick="$().botonBuscarAparato('+ultimoId+'); $(\'#modalNuevoTratamiento\').hide();" class="btn btn-default" data-backdrop="static" data-keyboard="false" data-toggle="modal" data-target="#modalBuscarAparato" style="background-color: #3498DB; color:#ECF0F1; border-color: #3498DB;" name="botonBuscarAaprato" aria-label="Left Align"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>';
      html += '<button type="button" class="btn btn-default"  onclick="eliminarCampoAparato('+ultimoId+');"><span class="glyphicon glyphicon-remove" style="color: #E74C3C " aria-hidden="true"></span></button>';
      html += '</div>';
      cargarSelecAparato(id,ultimoId);
      $('#contenedorAparatos').append(html);
      $('.selectpicker').selectpicker('refresh');

  
}

function eliminarCampoAparato(id){
      var aparatos = document.getElementsByClassName('Aparato');
      for(var i=0;i < aparatos.length; i++)
        if(id == aparatos[i].title)
          aparatos[i].outerHTML  = '';
      if(document.getElementsByClassName('contenedorAparatos').length == 0){
        //document.getElementById('checkboxAparato').checked = false;
        //document.getElementById('contenedorAparatos').empty();

      }
}

function actualizarEvolucion() {
        var id = $('#tratamientoID').val();
        var ev = $('#evolucion').val();
        $.ajax({
            type: "POST", cache: false, dataType: 'json', data: {"t":"actualizarEvolucionTratamiento","idTratamiento": id,"evolucion": ev},
            url: "./api.php", success: function(datos, texto, jqXHR){
                      swal("Buen trabajo!", "La evolucion se ha guardado correctamente!", "success");
                      $('#modalVerTurnos').modal('hide');
            }
        });

}

function mostrarTratamientoAnterior() {
        var id = $('#tratamientoAnterior').val();
        verTratamiento(id);
}

function mostrarTratamientoSiguiente() {
        var id = $('#tratamientoSiguiente').val();
        verTratamiento(id);
}

function formatoFecha(fecha){
  //Cambia el formato a dd/mm/aaaa
  var f=fecha.split("-");
  return (f[2]+"/"+f[1]+"/"+f[0]);
}
