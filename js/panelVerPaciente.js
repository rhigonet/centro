$.fn.initPanelVerPaciente = function (id) {
//Relleno informacion de paciente
  $.ajax({
    type: "POST",cache: false,   dataType:'json', data: {"t":"traerVerPaciente","idPaciente":id},
    url: "./api.php", success: function(datos,texto,jqXHR){
            //Info de pacientes
            $("#nombreapellido").html(datos.paciente[0].nombre+' '+datos.paciente[0].apellido);

            $("#nombreapellido2").html('<b>Paciente:</b> '+datos.paciente[0].nombre+' '+datos.paciente[0].apellido);

            $("#dni").html('<b>DNI:</b> '+datos.paciente[0].dni);

            //cambio presentacion fecha
            var texto = datos.paciente[0].nacimiento;
            var arreglo = texto.split("-");
            var nacimientoPaciente = arreglo[2] + "/" + arreglo[1] + "/" + arreglo[0];
            //fin

            $("#fechanacimiento").html('<b>Fecha Nacimiento:</b> '+nacimientoPaciente);

            $("#direccion").html('<b>Direccion:</b> '+datos.paciente[0].direccion);

            $("#telefono").html('<b>Telefono:</b> '+datos.paciente[0].telefono);

            $("#idPaciente").val(id);

            //PANEL DE LOS TRATAMIENTOS TURNOS PARA VER EL NOMBRE DEL PACIENTE QUE SE PIERDE
           // $('#tituloModalTurnos').html(datos.paciente[0].nombre+" "+datos.paciente[0].apellido);

            //Info ObraSociales de pacientes
            var columna=2;
            for(var i=0; i<datos.obrassociales.length;i++)
            {
              $("#columna"+columna).append ('<li class="list-group-item" id="obrasocial'+i+'" ><b>Obra Social:</b> '+datos.obrassociales[i].nombre+' - '+datos.obrassociales[i].numeroafiliado+'</li>');
              if(columna==1)
                columna=2;
              else
                columna=1;
            }

            var html='';
            for(var i=0; i < datos.tratamientos.length;i++)
            {

              html += '<li name="resultadosTratamientos" class="list-group-item row"><div class="col-lg-8" style="padding-top: 1% ; padding-left: 5%" name="tratamiento" id="tratamiento';
              html+=datos.tratamientos[i].id;
              html+='">';

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

              //OJO ACA, FECHAINICIO Y FECHAFIN NO EXISTEN EN TRATAMIENTOS, NO SE ESTA CALCULANDO EL INGRESO Y EL EGRESO

              html+= '</div><div class="col-lg-4"><div class="btn-group" role="group" style="float:right;"  aria-label="Basic example">';

              var popUpEliminar='swal({title: "¿Estas seguro?",text: "Un tratamiento eliminado no podra ser recuperado.",type: "warning",showCancelButton: true,confirmButtonClass: "btn-danger",confirmButtonText: "Si, quiero eliminarlo!",closeOnConfirm: false},function(){swal("Eliminado!", "El tratamiento ha sido eliminado correctamente.", "success");eliminarTratamiento('+datos.tratamientos[i].id+')});';
              var botonEliminar='<button type="button" onclick=\''+popUpEliminar+'\' class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Eliminar</button>'
              var botonModificar = '<button type="button" onclick="modificarTratamiento('+datos.tratamientos[i].id+')" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #2980B9">Modificar</button>';
              var botonVer= '<button onclick="verTratamiento('+datos.tratamientos[i].id+')" type="button" class="btn btn-default" style="background-color: #ECF0F1; border-color: #ECF0F1; color: #3498DB">Ver</button>';
              html += botonVer + botonModificar + botonEliminar;
              html += '</div></div></li>';

            }
         $("#TratamientosPaciente").append(html);

    }
  });
};

function irPacientes(){
        $('#menuPacientes').click();
}
