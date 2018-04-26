var fecha = new Date();
  var res = [pad(fecha.getDate()), pad(fecha.getMonth()+1), fecha.getFullYear()].join('/')
  $("#datepicker2").val(res);

$.fn.initPanelTurno= function () {
//--- Saco los turnos cargados
     $("#horario").css("background-color", "");
     $("#horario").empty();
};

function eliminarTurno(){
  // Verifico que verdaderamente esta en un turno (que haya cambiado la visibilidad del boton borrar)
  if($("#idTurno").val() != '')
    swal(
      {title: "¿Estas seguro?",
      text: "Un turno eliminado no podra ser recuperado.",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Si, quiero eliminarlo!",
      closeOnConfirm: false},
      function(){
          swal("Eliminado!", "El turno ha sido eliminado correctamente.", "success");

           $.ajax({
             type: "POST",cache: false,   dataType:'json', data: {"t":"eliminarTurno","idTurno":$("#idTurno").val()},
             url: "./api.php", success: function(datos,texto,jqXHR){
                $("#modalTurno").modal("hide");
                diasSemana();
             }
              });

        }
      );
}


function guardarTurno(){
        var error = 0;
        var horaTurno = $("#horaTurno").val();
        var textoTurno = $("#textoTurno").val();
        var d = new Date();

        $('#error').hide();
        $('#error').empty();

        if( $('#textoTurno').val() == "" ){
                error=1;
                $("#error").append("No puede cargar un turno vacio.<br>");
        }

        //para guardar fecha
        var texto = $("#fechaTurno").val();
        var arreglo = texto.split("/");
        fechaTurno = "";
        fechaTurno = arreglo[2] + "-" + arreglo[1] + "-" + arreglo[0];
        //fin para guardar fech
        //-- Verifico que la fecha del turno sea valida, solo podra modificar turnos de una fecha pasada pero no crear nuevos
        fechaAct = new Date();      
        if(($("#idTurno").val() == "")&&((arreglo[2]<fechaAct.getFullYear())||((arreglo[1]<fechaAct.getMonth()+1)&&(arreglo[2]<=fechaAct.getFullYear()))||((arreglo[0]<fechaAct.getDate())&&(arreglo[1]==fechaAct.getMonth()+1)&&(arreglo[2]<=fechaAct.getFullYear())))){
            error = 1;
            $("#error").append("No se puede crear un turno en una fecha pasada.");
        }

        if(error==0)
                $.ajax({
                  type: "POST",cache: false,   dataType:'json', data: {"t":"guardarTurno", "idTurno":$("#idTurno").val() ,"fechaTurno":fechaTurno, "horaTurno":horaTurno, "textoTurno":textoTurno},
                  url: "./api.php", success: function(datos,texto,jqXHR){
                      swal("Guardado!", "El turno ha sido guardado correctamente.", "success");
                      $("#modalTurno").modal("hide");
        		          diasSemana();
                    }
                });
        else
                $('#error').show();
}


$("#botonCancelar").click(function (){
  $("#modalTurno").modal("hide");
});

function initDatePicker(){
  $('#sandbox-container .input-group.date').datepicker({
    format: "dd/mm/yyyy",
    weekStart: 0,
    maxViewMode: 2,
    todayBtn: "linked",
    clearBtn: true,
    language: "es",
    daysOfWeekDisabled: "0,6",
    daysOfWeekHighlighted: "1,2,3,4,5",
    todayHighlight: true
  });
}

// --------- Esta funcion se encarge de inializar el calendario con sus repectivos dias y turnos cargados en la bd
function diasSemana(){
  // var fecha = new Date();
  var dias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  //--- Estos colores se usaran para identificar los td que contengan un turno
  var colores = ["#5dade2","#7fb3d5","#a3e4d7", "#d6eaf8","#E8DAEF"];
  fecha.setDate(fecha.getDate()-(fecha.getDay()-1));

  //-------- Cargo la semana actual
  for(i=0; i<5 ; i++){
    $("#" + dias[i]).html(fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear());
    fecha.setDate(fecha.getDate()+1);
  }

//------------- Quito los turnos cargados previamente
for(p = 0; p < 105 ; p++ ){
  //$("#horario").empty();
    document.getElementsByClassName("horario")[p].innerHTML = '';
    document.getElementsByClassName("horario")[p].bgColor = '';
}

//--- Vuelvo a la fecha original
  fecha.setDate(fecha.getDate()-5);
  //----- Traigo los turnos cargados de la semana actual

  fechaF = new Date(fecha.getFullYear() , fecha.getMonth(), fecha.getDate());
  fechaF.setDate(fechaF.getDate()+5); 


//console.log(fecha + " ------------------  "+ fechaF);
  var mes = fecha.getMonth()+1;
  var dia = fecha.getDate();
  var mesF = fechaF.getMonth()+1;
  var diaF = fechaF.getDate();
//-- Me fijo si debo incluir el 0 o no (En la bd se almacenan con 0 incluido de ser necesario)
  if(mes <10)
    mes = "0" + mes;
  if(dia < 10)
    dia = "0" + dia;
  if(mesF<10)
    mesF = "0" + mesF;
  if(diaF <10)
    diaF = "0" + diaF;
  $.ajax({
      type: "POST",cache: false,   dataType:'json', data: {"t":"traerTurnosSemana","fechaInicio":fecha.getFullYear() + "-" + mes + "-" + dia, "fechaFin":fechaF.getFullYear() + "-" +mesF+ "-" + diaF},
      url: "./api.php", success: function(datos,texto,jqXHR){
        //-- Esto lo tengo que hacer porque no me toma el anterior cambio
        fecha.setDate(fecha.getDate()-5);


        for(i= 0; i < datos.turnos.length ; i++){
          //----- Me fijo si el turno esta en la semana actual

          for(j=0; j < 5 ; j++){
            mes = fecha.getMonth()+1;
            dia = fecha.getDate();
            //-- Me fijo si necesito agregarle un cero;
            if(mes <10)
              mes = "0" + mes;            
            if(dia < 10)
              dia = "0" + dia;
    
            if((fecha.getFullYear() + "-"+ mes + "-" + dia) == datos.turnos[i].fecha){
              // ----- Obtengo el td del horario y dia del turno
                var r = Math.floor(Math.random()*4);
                var td = document.getElementById(datos.turnos[i].hora).getElementsByTagName("td")[j+1];
                var html = "<pre id='p"+datos.turnos[i].hora+j+"' style='background-color:"+colores[r]+" ;border-color:"+colores[r]+"'>" + datos.turnos[i].texto + "</pre>";
                td.bgColor  = colores[r];
                td.value = datos.turnos[i].id;
                td.innerHTML  = html;

                //-- cargo el id del turno
                document.getElementById("idTurno").value = datos.turnos[i].id;
            }
            fecha.setDate(fecha.getDate()+1);

          }
          fecha.setDate(fecha.getDate()-5);

        }

      }
  });

//--- Vuelvo a la fecha de la semana
  fecha.setDate(fecha.getDate()+5);
}


$("#semanaSig").click(function (){
  fecha.setDate(fecha.getDate()+7);
  diasSemana();
});

$("#semanaAnt").click(function (){
  fecha.setDate(fecha.getDate()-7);
  diasSemana();
});

$("#hoy").click(function (){
  fecha = new Date();
  var res = [pad(fecha.getDate()), pad(fecha.getMonth()+1), fecha.getFullYear()].join('/');
  $("#datepicker2").val(res);
  diasSemana();
});

$("#datepicker2").change(function (){

  var from = $("#datepicker2").val().split("/");
  var f = new Date(from[2], from[1] - 1, from[0]);
  fecha = new Date(f);
  diasSemana();
});

function abrirModal(hora, dia){
        var diaMostrar = "";
        diaMostrar = dia[0].toUpperCase();
        for(var i = 1; dia[i] != null ; i++){
                diaMostrar = diaMostrar + dia[i];
        }

    $("#myModalLabel").html(diaMostrar + " " + $("#"+ dia).html() + " - " + hora + " hs");
    $("#idTurno").val("");
    $("#horaTurno").val(hora);
    $("#fechaTurno").val($('#'+dia).html());
    $('#error').hide();
    $('#error').empty();
    var dias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
    //--- Me fijo si tiene algo cargado
    if(document.getElementById('p'+ hora + ':00' + dias.indexOf(dia))){
        $("#textoTurno").val(document.getElementById('p'+ hora + ':00' + dias.indexOf(dia)).innerHTML);
        $("#botonBorrarTurno").removeClass("hidden");
        //--- Cargo el id
        $("#idTurno").val(document.getElementById(hora+dia).value);
    }else{
      $("#textoTurno").val('');
      $("#idTurno").val('');
      $("#botonBorrarTurno").addClass("hidden");
    }

  $('#modalTurno').modal('show');
}

function pad(s) { return (s < 10) ? '0' + s : s; }
