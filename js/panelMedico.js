$.fn.initPanelMedico = function () {
  $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosMedicos"},
    url: "./api.php", success: function(datos,texto,jqXHR){

            $("#panelMedico").empty();
      //Accedemos a la informacion como datos.pacientes[<numero>].<atributo>

      for (var i = 0; i < datos.medicos.length; i++) {
        var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un medico eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El 	medico ha sido eliminado correctamente.", "success");eliminarMedico('+datos.medicos[i].id+')});';
        var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
        var botonModificar = '<button type="button" onclick="modificarMedico('+datos.medicos[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
          $("#panelMedico").append(
                  '<li name="resultadoMedicos" class="list-group-item row"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" name="nameMedico">'+datos.medicos[i].matricula+' - '+datos.medicos[i].nombre+' '+datos.medicos[i].apellido+' </div><div class="col-lg-4"><div class="btn-group" style="float: right" role="group" aria-label="...">'+botonModificar+botonEliminar+'</div></div></li>'
        );
      }
      }
  });
};

function modificarMedico(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerMedico","idMedico":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){
                          $("#botonNuevoMedico").click();
                          $("#tituloModal").text("Modificar Medico");
                          $("#idMedico").val(datos.medico[0].id);
                          $("#nombreMedico").val(datos.medico[0].nombre);
                          $("#apellidoMedico").val(datos.medico[0].apellido);
                          $("#matriculaMedico").val(datos.medico[0].matricula);
                  });
            }
        });
}

function guardarMedico(){
        var error = 0;
        $('#error').hide();
        $('#error').empty();

//errores matricula
        if( $('#matriculaMedico').val().trim() == "" ){
                error=1;
                $("#error").append("La matricula no puede estar vacia. <br>");
        }
        if( $('#matriculaMedico').val().length > 4 ){
                error=1;
                $("#error").append("La matricula puede contener hasta 4 digitos. <br>");
        }
        var isnum = /^\d+$/.test($('#matriculaMedico').val());
        if( !isnum ){
                error=1;
                $("#error").append("La matricula puede contener solo numeros. <br>");
        }

        if( $('#nombreMedico').val().trim() == "" ){
                error=1;
                $("#error").append("El nombre no puede estar vacio. <br>");
        }
        if( !/^[a-zA-Z ]+$/.test($('#nombreMedico').val())){
                error=1;
                $("#error").append("El nombre debe contener solo letras. <br>");
        }
        if( $('#apellidoMedico').val().trim() == "" ){
                error=1;
                $("#error").append("El apellido no puede estar vacio. <br>");
        }
        if( !/^[a-zA-Z ]+$/.test($('#apellidoMedico').val())){
                error=1;
                $("#error").append("El apellido puede contener solo letras. <br>");
        }

        if(error==0)
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"guardarMedico", "idMedico": $("#idMedico").val() , "nombreMedico": $("#nombreMedico").val() , "apellidoMedico": $("#apellidoMedico").val() , "matriculaMedico": $("#matriculaMedico").val() },
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                if(datos.err == 0){
                                      if($("#idMedico").val() != '')
                                        swal("Buen trabajo!", "El medico ha sido modificado correctamente!", "success")
                                      else
                                        swal("Buen trabajo!", "El medico ha sido agregado correctamente!", "success")
                                      $("#botonNuevoMedico").click();
                                      $().initPanelMedico();

                                }else if(datos.err == 1){
                                    $("#error").empty();
                                    $("#error").append('<b>Por favor mire los siguiente errores</b></br>');
                                    $("#error").append(datos.txerr);
                                    $("#error").show();
                                }
                        }
                });
        else
                $('#error').show();
}

function eliminarMedico(id){
  $.ajax({
          type: "POST",cache: false,  dataType:'json', data: {"t":"eliminarMedico","idMedico":id},
          url: "./api.php", success: function(datos,texto,jqXHR){

            }
        });
  $().initPanelMedico();
}
