$.fn.initPanelSesion= function () {
/*
  $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerTodosTurnos"},
    url: "./api.php", success: function(datos,texto,jqXHR){

          console.log(datos);
            $("#panelTurnos").empty();
      //Accedemos a la informacion como datos.pacientes[<numero>].<atributo>
      for (var i = 0; i < datos.turnos.length; i++) {
        var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un turno eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El turno ha sido eliminado correctamente.", "success");eliminarTurno('+datos.turnos[i].id+')});';
        var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
        var botonModificar = '<button type="button" onclick="modificarTurno('+datos.turnos[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
        var botonVer= '<button onclick="verTurno('+datos.turnos[i].id+')" type="button" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Ver</button>';

        $("#panelTurno").append(
                  '<li class="list-group-item row"><div class="col-lg-4" style="padding-top: 1% ; padding-left: 5% ; background-color: #2C3E50; color:#ECF0F1"> Id'+datos.turnos[i].fecha+' - '+datos.turnos[i].hora+'</div><li class="list-group-item row"><div class="col-lg-4" style="padding-top: 1% ; padding-left: 5%"> Id'+datos.turnos[i].descripcion+'</div><div class="col-lg-4"><div class="btn-group" role="group" aria-label="...">'+botonVer+botonModificar+botonEliminar+'</div></div></li>'
        );
      }
      }
  });*/
};

function eliminarSesion(id){
        $.ajax({
          type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarSesion","idSesion":id},
          url: "./api.php", success: function(datos,texto,jqXHR){
            }
        });
      $().initPanelSesion();
}