$.fn.initPanelDiagnostico = function () {
  $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosDiagnosticos"},
    url: "./api.php", success: function(datos,texto,jqXHR){

            $("#panelDiagnostico").empty();
      //Accedemos a la informacion como datos.pacientes[<numero>].<atributo>

      for (var i = 0; i < datos.diagnosticos.length; i++) {
        var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un diagnostico eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El diagnostico ha sido eliminado correctamente.", "success");eliminarDiagnostico('+datos.diagnosticos[i].id+')});';
        var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
        var botonModificar = '<button type="button" onclick="modificarDiagnostico('+datos.diagnosticos[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
          $("#panelDiagnostico").append(
                  '<li name="resultadoDiagnosticos" class="list-group-item row"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" name="nameDiagnostico">'+datos.diagnosticos[i].codigo+' - '+datos.diagnosticos[i].descripcion+' </div><div class="col-lg-4"><div class="btn-group" style="float: right" role="group" aria-label="...">'+botonModificar+botonEliminar+'</div></div></li>'
        );
      }
      }
  });
};

function eliminarDiagnostico(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarDiagnostico","idDiagnostico":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){

                  });
            }
        });
      $().initPanelDiagnostico();
}

function modificarDiagnostico(id){
  $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerDiagnostico","idDiagnostico":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){
                          $("#botonNuevoDiagnostico").click();
                          $("#tituloModal").text("Modificar Diagnostico");
                          $("#idDiagnostico").val(datos.diagnostico[0].id);
                          $("#codigoDiagnostico").val(datos.diagnostico[0].codigo);
                          $("#descripcionDiagnostico").val(datos.diagnostico[0].descripcion);
                  });
            }
        });
}

function guardarDiagnostico(){
        var error = 0;
        $('#error').hide();
        $('#error').empty();

        if( $('#codigoDiagnostico').val().trim() == "" ){
                error=1;
                $("#error").append("El código no puede estar vacio. <br>");
        }
        if( $('#codigoDiagnostico').val().length > 6 || $('#codigoDiagnostico').val().length < 3  ){
                error=1;
                $("#error").append("El codigo de diagnostico debe contener entre 3 y 6 digitos. <br>");
        }
        ///([A-Z][0-9]{2}(.[0-9][0-9]){0,1})+/ig
        var isnum1 = /([A-Z][0-9]{2}(.[0-9][0-9]){1})+/ig.test($('#codigoDiagnostico').val());
        var isnum2 = /([A-Z][0-9]{2})+/ig.test($('#codigoDiagnostico').val());
        var isnum3 = /([A-Z][0-9]{2}(.[0-9]){1})+/ig.test($('#codigoDiagnostico').val());

        var largo = $('#codigoDiagnostico').val().length;
        if( !((isnum1 && largo == 6 ) ||  (isnum2 && largo ==3 ) ||  (isnum3 && largo ==5 )) ){
                error=1;
                $("#error").append("Formato de diagnostico invalido. <br>");
        }
        if( $('#descripcionDiagnostico').val().trim() == "" ){
                error=1;
                $("#error").append("La descripción no puede estar vacia.<br>");
        }
        if( !/^[a-zA-Z ]+$/.test($('#descripcionDiagnostico').val())){
                error=1;
                $("#error").append("La descripcion debe contener solo letras. <br>");
        }


        if(error==0)
                $.ajax({
                      type: "POST",cache: false,   dataType:'json', data: {"t":"guardarDiagnostico", "codigoDiagnostico": $("#codigoDiagnostico").val() , "descripcionDiagnostico": $("#descripcionDiagnostico").val(), "idDiagnostico":$("#idDiagnostico").val()},
                      url: "./api.php", success: function(datos,texto,jqXHR){
                              if($("#idDiagnostico").val() != '')
                                swal("Buen trabajo!", "El diagnostico ha sido modificado correctamente!", "success")
                              else
                                swal("Buen trabajo!", "El diagnostico ha sido agregado correctamente!", "success")

                             $("#botonNuevoDiagnostico").click();
                              $().initPanelDiagnostico();
                      }
                });
        else
                $('#error').show();
}
