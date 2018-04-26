$.fn.initPanelObraSocial = function () {
   $.ajax({
   type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosObrasSociales"},
    url: "./api.php", success: function(datos,texto,jqXHR){

            $("#panelObraSocial").empty();
      //Accedemos a la informacion como datos.pacientes[<numero>].<atributo>
      for (var i = 0; i < datos.obrassociales.length; i++) {
        var popUpEliminar='swal({title: "¿Estas seguro?",text: "Una Obra Social eliminada no podra ser recuperada.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "La obra social ha sido eliminada correctamente.", "success");eliminarObraSocial('+datos.obrassociales[i].id+')});';
        var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
        var botonModificar = '<button type="button" onclick="modificarObraSocial('+datos.obrassociales[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
          $("#panelObraSocial").append(
                  '<li class="list-group-item row" name="resultadoObraSocial"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" name="nameObraSocial">'+datos.obrassociales[i].nombre+' </div><div class="col-lg-4"><div class="btn-group" style="float: right" role="group" aria-label="...">'+botonModificar+botonEliminar+'</div></div></li>'
        );
      }
      }
  });
};



$( "#botonNuevoObraSocial" ).click(function() {
        $("#tituloModal").text("Alta de Obra Social");
        $("#idObraSocial").val(null);
        $("#nombreObraSocial").val(null);
});

//modificar, guardar es lo mismo casi, varian en que no tiene el campo oculto de id
function guardarObraSocial(){
        var error = 0;
        $('#error').hide();
        $('#error').empty();

        if( $('#nombreObraSocial').val() == "" ){
                error=1;
                $("#error").append("El nombre no puede estar vacio.");
        }

        if(error==0)
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"guardarObraSocial", "idObraSocial": $("#idObraSocial").val() , "nombreObraSocial": $("#nombreObraSocial").val()},
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                if($("#idObraSocial").val() != '')
                                  swal("Buen trabajo!", "La obra social ha sido modificada correctamente!", "success")
                                else
                                  swal("Buen trabajo!", "La obra social ha sido agregada correctamente!", "success")

                                $("#botonNuevoObraSocial").click();
                                $().initPanelObraSocial();
                        }
                });
        else
                $('#error').show();
}


function modificarObraSocial(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"traerObraSocial","idObraSocial":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
                  $(document).ready(function(){
                          $("#botonNuevoObraSocial").click();
                          $("#tituloModal").text("Modificar Obra Social");
                          $("#idObraSocial").val(datos.obrasocial[0].id);
                          $("#nombreObraSocial").val(datos.obrasocial[0].nombre);
                  });
            }
        });
}


function eliminarObraSocial(id){
    $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarObraSocial","idObraSocial":id},
    url: "./api.php", success: function(datos,texto,jqXHR){
        $(document).ready(function(){

              console.log('Obra Social eliminada!!!!');
        });
    }

    });
    $().initPanelObraSocial();
}
