var d = new Date();

$.fn.initPanelGimnasio = function () {
        // $('.datepicker').datepicker()
        //         .on("changeDate", cambiarFecha);
        //         .change(cambiarFecha);
            // .on("changeDate", function(e) {
            //             // fecha =  $('.datepicker').datepicker('getDate');
            //             // d = new Date($("#datepicker3").val());
            //             console.log($("#datepicker3").val());
            //             // $().initPanelGimnasio();
            //             // cambiarFecha(fecha);
            //     });
        //d = new Date();
        $('#fechaGym').val(d.getFullYear()+"-"+((d.getMonth()+1)*1).pad()+"-01");

        $.ajax({
                type: "POST",async: false ,cache: false,   dataType:'json', data: {"t":"traerTodosGimnasio", "fecha":$('#fechaGym').val()},
                url: "./api.php", success: function(datos,texto,jqXHR){
                        $("#panelGimnasio").empty();
                        for (var i = 0; i < datos.gimnasio.length; i++) {
                                if(datos.gimnasio[i].pago==0){
                                        $("#panelGimnasio").append(
                                        '<li class="list-group-item list-group-item" name="ocultable" id="'+datos.gimnasio[i].id+'">'+datos.gimnasio[i].nombre+'<button onclick="borrarPersona('+datos.gimnasio[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#2C3E50; border-color:#2C3E50; margin-left:5px" title="Eliminar persona del sistema"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><button onclick="borrarPago('+datos.gimnasio[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#E74C3C; border-color:#E74C3C; margin-left:5px" title="Borrar del mes"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button><button onclick="pagar('+datos.gimnasio[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#3498DB; border-color:#3498DB" title="Asentar pago"><span class="glyphicon glyphicon-usd" aria-hidden="true"></span></button></li>'
                                        );
                                }else {
                                        $("#panelGimnasio").append(
                                        '<li class="list-group-item list-group-item-success" name="ocultable">'+datos.gimnasio[i].nombre+'<button onclick="borrarPersona('+datos.gimnasio[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#2C3E50; border-color:#2C3E50; margin-left:5px" title="Eliminar persona del sistema"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></li>'
                                        );
                                }
                        }
                }
        });
};
 
//FUNCION PARA HACER QUE LA FECHA QUEDE PERFECTA, NO SE ASUSTEN
Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
 }

function guardar(nombre){        //Añade una nueva persona a la tabla de personas, y de paso la agrega al mes lista para que pague
        swal({title:"¿Esta seguro?",text:"Confirma añadir a  "+nombre,type:"warning",showCancelButton:true,confirmButtonClass:"btn-danger",confirmButtonText:"Si",closeOnConfirm:false},function(){
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"guardarPersonaGimnasio", "nombre": nombre, "fecha": $("#fechaGym").val() },
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                swal("Buen trabajo!", "La persona ha sido agregada", "success");
                                $('#modalCargaPersonaGimnasio').modal('hide');
                                $().initPanelGimnasio();
                        }
                });
        });
}//end of function

function seleccionarParaEsteMes(){
        var id=$('#selectPersonasGimnasio').val();
        $.ajax({
                type: "POST",cache: false,   dataType:'json', data: {"t":"seleccionarParaEsteMes", "id": id, "fecha": $("#fechaGym").val() },
                url: "./api.php", success: function(datos,texto,jqXHR){
                        swal("Buen trabajo!", "La persona ha sido agregada", "success");
                        $('#modalCargaPersonaGimnasio').modal('hide');
                        $().initPanelGimnasio();
                        cargarSelectAgregarPersona();
                }
        });
}


function cargarSelectAgregarPersona(){
        $('#selectPersonasGimnasio').empty();
        $.ajax({
                type: "POST",cache: false,   dataType:'json', data: {"t":"traerPersonasSelectGimnasio","fecha": $("#fechaGym").val() },
                url: "./api.php", success: function(datos,texto,jqXHR){
                        for (var i = 0; i < datos.personas.length; i++) {
                                //alert(datos.personas[i].nombre);
                                //$('#selectPersonasGimnasio').html('<option>'+datos.personas[i].nombre+'</option>');
                                var op=$("<option>"+datos.personas[i].nombre+"</option>");
                                op.attr('value',datos.personas[i].id);
                                op.attr('id',datos.personas[i].id);
                                $('#selectPersonasGimnasio').append(op);
                                $('.selectpicker').selectpicker('refresh');
                        }
                }
        });
}

function pagar(id){
        swal({title:"¿Esta seguro?",text:"¿Confirma el pago del mes "+$('#nombreMes').html()+" para la persona "+$('#'+id).text()+"?",type:"warning",showCancelButton:true,confirmButtonClass:"btn-danger",confirmButtonText:"Si",closeOnConfirm:false},function(){
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"pagarMes", "id": id, "fecha": $("#fechaGym").val() },
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                swal("Buen trabajo!", "El pago ha sido asentado", "success");
                                //$('#modalCargaPersonaGimnasio').modal('hide');
                                $().initPanelGimnasio();
                        }
                });
        });
}

function borrarPago(id){
        swal({title:"¿Esta seguro? ",text:"¿Confirma borrar el pago del mes "+$('#nombreMes').html()+" para la persona "+$('#'+id).text()+"?",type:"warning",showCancelButton:true,confirmButtonClass:"btn-danger",confirmButtonText:"Si",closeOnConfirm:false},function(){
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"borrarPago", "id": id, "fecha": $("#fechaGym").val() },
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                swal("Buen trabajo!", "El pago ha sido borrado", "success");
                                //$('#modalCargaPersonaGimnasio').modal('hide');
                                $().initPanelGimnasio();
                        }
                });
        });
}

function borrarPersona(id){
        swal({title:"¿Borrar a "+$('#'+id).text()+" del sistema? ",text:"Una persona borrada no podra ser recuperada.",type:"warning",showCancelButton:true,confirmButtonClass:"btn-danger",confirmButtonText:"Si",closeOnConfirm:false},function(){
                $.ajax({
                        type: "POST",cache: false,   dataType:'json', data: {"t":"borrarPersonaGimnasio", "id": id},
                        url: "./api.php", success: function(datos,texto,jqXHR){
                                swal("Buen trabajo!", "La persona ha sido borrada", "success");
                                //$('#modalCargaPersonaGimnasio').modal('hide');
                                $().initPanelGimnasio();
                        }
                });
        });
}

function actualizarPorMes(op){
        //console.log(op);
        if(op=="after"){
                d.setMonth(d.getMonth()+1);
        } else if (op=="before"){
                d.setMonth(d.getMonth()-1);
        } else if(op=="current"){
                d = new Date();
        }
        $().initPanelGimnasio();
        actualizarNombreMes(d.getMonth());

        if(op=="after"){
                agregarPersonasDelMesAnterior();
        }
}

function actualizarNombreMes(m){
        var meses=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        $('#nombreMes').html(meses[m] +" "+ d.getFullYear());
}

function agregarPersonasDelMesAnterior(){
        var cantPersonas = document.getElementById('panelGimnasio').childNodes.length;
        var d1 = d.getFullYear()+"-"+((d.getMonth())).pad()+"-01";
        console.log(d1);

        if(cantPersonas==0){
                swal({title:"No hay personas cargadas este mes",text:"¿Desea cargar las personas del mes anterior?",type:"info",showCancelButton:true,confirmButtonClass:"btn-info",confirmButtonText:"Si",closeOnConfirm:false},function(){
                        $.ajax({
                                type: "POST",cache: false,   dataType:'json', data: {"t":"cargarPersonasMesAnterior", "fechaD": $('#fechaGym').val(), "fechaA": d1}, //fechaD es la fecha de despues, y fechaA es la fecha donde se sacan las personas
                                url: "./api.php", success: function(datos,texto,jqXHR){
                                        swal("Buen trabajo!", "Se han cargado las personas del mes anterior", "success");   //La idea de esto es que no tenga que cargar las personas del mes anterior todas de nuevo una por una
                                        $().initPanelGimnasio();
                                }
                        });
                });
        }
}


//---- Aca se deberia modificar el buscador de personas del mes porque es al pedo tener dos partes que hacen lo mismo
function buscarPersona(bus, elementos){   
    var bus = document.getElementById(bus).value.toUpperCase();        
    var elementos = document.getElementsByName(elementos);       
         if(bus != ''){
            for(var i = 0; i < elementos.length; i++){                     
              if(elementos[i].textContent.toUpperCase().indexOf(bus) >= 0)
                  elementos[i].style.display = "block";
              else
                  elementos[i].style.display = "none";
            }
        }else{
            for(var i = 0; i < elementos.length; i++)
                elementos[i].style.display = "block";
        }
}

function cambiarFecha(){
        var array = $("#datepicker3").val().split("/");
        d.setDate(array[0]);
        d.setMonth(array[1]-1);
        d.setFullYear(array[2]);
        $().initPanelGimnasio();
}

//---- Se muestran todos los deudores que hay hasta el mes de la fecha
function mostrarDeudores(){
            $('#resultadobusquedaclientes').empty();
            $('#busCliente').val('');
         $.ajax({
                type: "POST",cache: false,   dataType:'json', data: {"t":"traerDeudoresGym"},
                url: "./api.php", success: function(datos,texto,jqXHR){
                        var html = '';
                        for (var i = 0; i < datos.deudores.length; i++) {
  
                                    
                            html +='<li class="list-group-item list-group-item" name="deudor" id="'+datos.deudores[i].id+'">'+datos.deudores[i].nombre+ ' - ' + datos.deudores[i].fecha+ '<button onclick="borrarPersona('+datos.deudores[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#2C3E50; border-color:#2C3E50; margin-left:5px" title="Eliminar persona del sistema"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><button onclick="borrarPago('+datos.deudores[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#E74C3C; border-color:#E74C3C; margin-left:5px" title="Borrar del mes"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button><button onclick="pagar('+datos.deudores[i].id+')" type="button" class="btn btn-primary btn-xs" style="float:right; margin-bottom:15px; background-color:#3498DB; border-color:#3498DB" title="Asentar pago"><span class="glyphicon glyphicon-usd" aria-hidden="true"></span></button></li>';
                                        

                        }

                        if(html==''){
                            html = '<li  class="list-group-item list-group-item">Todos los clientes han pagado</li>'
                        }

                        $('#resultadobusquedaclientes').append(html);
                        //-- Porque pudo haber modificado el pago de nuna persona del mes actual
                        $().initPanelGimnasio();
                }
        });   
}

$("#botonCancelar").click(function (){
  $("#modalMostrarNoPagos").modal("hide");
});