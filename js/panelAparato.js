$.fn.initPanelAparato = function () {
  $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosAparatos"},
    url: "./api.php", success: function(datos,texto,jqXHR){

            $("#panelAparato").empty();
      //Accedemos a la informacion como datos.pacientes[<numero>].<atributo>
      for (var i = 0; i < datos.aparatos.length; i++) {
        var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un aparato eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El aparato ha sido eliminado correctamente.", "success");eliminarAparato('+datos.aparatos[i].id+')});';
        var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
        var botonModificar = '<button type="button" onclick="modificarAparato('+datos.aparatos[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
          $("#panelAparato").append(
                  '<li name="resultadoAparatos" class="list-group-item row"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" name="nameAparato">'+datos.aparatos[i].descripcion+' </div><div class="col-lg-4"><div class="btn-group" style="float: right" role="group" aria-label="...">'+botonModificar+botonEliminar+'</div></div></li>'
        );
      }
      }
  });
};



//modificar, guardar es lo mismo casi, varian en que no tiene el campo oculto de id
function guardarAparato(){
        var error = 0;
        $('#error').hide();
        $('#error').empty();

        if( $('#descripcionAparato').val() == "" ){
                error=1;
                $("#error").append("La descripción no puede estar vacia.");
        }

        if(error==0)
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"guardarAparato", "idAparato": $("#idAparato").val() , "descripcionAparato": $("#descripcionAparato").val() },
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                if($("#idAparato").val() != '')
                                  swal("Buen trabajo!", "El aparato ha sido modificado correctamente!", "success")
                                else
                                  swal("Buen trabajo!", "El aparato ha sido agregado correctamente!", "success")

                                $("#botonNuevoAparato").click();
                                $().initPanelAparato();
                        }
                });
        else
                $("#error").show();
}

function modificarAparato(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerAparato","idAparato":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){
                          $("#botonNuevoAparato").click();
                          $("#tituloModal").text("Modificar Aparato");


                          $("#idAparato").val(datos.aparato[0].id);
                          $("#descripcionAparato").val(datos.aparato[0].descripcion);

                  });
            }
        });

}

function eliminarAparato(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarAparato","idAparato":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){


                  });
            }

        });
        $().initPanelAparato();
}
