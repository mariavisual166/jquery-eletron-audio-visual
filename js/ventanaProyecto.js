const comun = require('../js/comun.js')
String.prototype.format = comun.formatString
var infoProyecto = undefined
var finalizado =false

function eliminar_archivo(dir_path){
	const fs = require('fs-extra')
   fs.remove(dir_path, err => {
})
}

function playSound(soundFile) {
    if (soundFile === undefined) return;
    var audio = document.createElement('audio');
    audio.src = soundFile;
    audio.play();
    audio = undefined;
}

function fecha_transformada(fecha_2) {

    fecha = fecha_2.toString();
    mes = fecha.split(' ')[1] 
    switch (mes) {
        case "Ene": mes=  "01"
            break;
        case "Feb": mes=  "02"
            break;
        case "Mar": mes = "03"
            break;
        case "Abr": mes = "04"
            break;
        case "May": mes = "05"
            break;
        case "Jun": mes = "06"
            break;
        case "Jul": mes = "07"
            break;
        case "Ago": mes = "08"
            break;
        case "Sep": mes = "09"
            break;
        case "Oct": mes = "10"
            break;
        case "Nov": mes = "11"
            break;
        case "Dec": mes = "12"
            break;
        default:
            
    }
    fecha=fecha.replace(" ", "-")
    dia = fecha.split(' ')[1]
    fecha = fecha.replace(" ", "-")
    anno = fecha.split(' ')[1]
    
    return ( anno+ "-"+mes + "-" + dia  )

}

function eliminar( elemento){
	titulo_del_proyecto = document.getElementById("Nombre").value
	direccion=elemento.getAttribute('id')
	document.getElementById(elemento.getAttribute('id')).remove()
	document.getElementById('ajus').childNodes[1].setAttribute('class','carousel-item active')
		
	while (direccion.split('%%%%%').length>1){
			direccion=direccion.replace('%%%%%','\\')	
			}
	while (direccion.split('#####').length>1){
			direccion=direccion.replace('#####',' ')	
			}		
			
			 const requesteliminarimagen = "delete from imagesProject where ('"+titulo_del_proyecto+"'=idProject and imageName='"+direccion+"');"  
          comun.sql(requesteliminarimagen)
				.then( function Contenido3(results){
					eliminar_archivo(direccion)
							iziToast.success({
							title: 'OK',
							message: 'Se ha eliminado',
							
									});
							playSound('../sound/message_received.mp3');
						
				})
				.catch( function(err){
					iziToast.error({
							title: 'Verificar',
							message: err
									});
									
							playSound('../sound/message_received.mp3');
				})
			
}

function abrir_o_eliminar(e){
	
   if(e.timerID){
          clearTimeout(e.timerID);
          e.timerID=null;
          titulo_del_proyecto = document.getElementById("Nombre").value
         debugger
          direccion=e.getAttribute('text')
          while (direccion.split('%%%%%').length>1){
			direccion=direccion.replace('%%%%%',' ')	
			}
          document.getElementById(e.getAttribute('id')).remove()
          
		
         
          const requesteliminarasignado = "delete from archivosProject where ('"+titulo_del_proyecto+"'=idProject and archivoName='"+direccion+"');"  
          comun.sql(requesteliminarasignado)
				.then( function Contenido3(results){
							iziToast.success({
							title: 'OK',
							message: 'Se ha eliminado',
							
									});
							playSound('../sound/message_received.mp3');
						
				})
				.catch( function(err){
					iziToast.error({
							title: 'Verificar',
							message: err
									});
									
							playSound('../sound/message_received.mp3');
				})
         }
       else{
          e.timerID=setTimeout(function(){
                                            fs = require('fs')
                                            e.timerID=null;
                                           debugger
                                            const {shell} = require('electron')
                                            direccion=e.getAttribute('id')
                                            while (direccion.split('%%%%%').length>1){
											direccion=direccion.replace('%%%%%','%20')	
											}
											fs.exists(direccion, function(err, result){
												if (err)
												{
													iziToast.error({
                                        title: 'Verificar',
                                        message: 'El archivo no existe o fue removido'
                                    });
                                    playSound('../sound/message_received.mp3');
												}else
												{
													 shell.showItemInFolder(direccion)
												}
												
												
											})
                                            
                                            },350)}
}

$("#id_archivo_carga_de_archivo").change(function(){
	nombre_proyecto = document.getElementById("Nombre").value
	nombre_archivo=document.getElementById("id_archivo_carga_de_archivo").files[0].name
	direccion=document.getElementById("id_archivo_carga_de_archivo").files[0].path
	path=document.getElementById("id_archivo_carga_de_archivo").files[0].path
								
										//Sustituir los espacio para que se puedo reconocer cuando se pase para la otra funcion 
										while (direccion.split(' ').length>1){
											direccion=direccion.replace(' ','%%%%%')	
										}
										while (path.split('\\').length>1){
											path=path.replace('\\','/')	
										}						
									$("#archivos").append(
									"<li class='list-group-item' id={1} text={1} onclick='abrir_o_eliminar(this)'>{0}</li>"
									.format(nombre_archivo,direccion))
										
	 $('#id_archivo_carga_de_archivo').val(null); 
	  const consulta = 'insert into archivosProject(idProject,archivoName) VALUES($1,$2) RETURNING *'
				const	values = [nombre_proyecto,path]
				comun.sql2( consulta,values )
						.then(  function si(results) {
										iziToast.success({
										title: 'OK',
										message: 'Se han guadados los cambios'
										});
											playSound('../sound/message_received.mp3');
						})
						.catch(err =>{
                                    
                                    iziToast.error({
                                        title: 'Verificar',
                                        message: err
                                    });
                                    playSound('../sound/message_received.mp3');
								
                         })	
})

function cambiar_colaborador( nombre_colaborador){
	
	nombre_proyecto = document.getElementById("Nombre").value
	
	tipo_colaborador=nombre_colaborador.getAttribute('id')
	
	 switch (tipo_colaborador) {
        case '0':
			nombre_seleccionado=$("#0 option:selected").text()
			const actualizar_creador_contenido= "update project set  contentcreator='"+nombre_seleccionado+"' where  title='"+nombre_proyecto+"';"                   
				comun.sql( actualizar_creador_contenido )
					.then(  function validacion(results) {
									const actualizar_estatus_creador_contenido= "update project set  statusContentCreator='Asignado' where  title='"+nombre_proyecto+"';"
											comun.sql( actualizar_estatus_creador_contenido )
											.then(  function validacion(results) {
													$('#00').attr('value','Asignado')
													iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
													playSound('../sound/message_received.mp3');
											})
											.catch( function(err){
													iziToast.error({title: 'Verificar',message: err});
													playSound('../sound/message_received.mp3');
											})
							
			
					})
					.catch( function(err){
							iziToast.error({title: 'Verificar',message: err});
							playSound('../sound/message_received.mp3');
			
					})             
            break;
		case '1':
		
				nombre_seleccionado=$("#1 option:selected").text()
			const actualizar_escritor= "update project set  writer='"+nombre_seleccionado+"' where  title='"+nombre_proyecto+"';"                   
				comun.sql( actualizar_escritor )
					.then(  function validacion(results) {
									const actualizar_estatus_escritor= "update project set  statuswriter='Asignado' where  title='"+nombre_proyecto+"';"
											comun.sql( actualizar_estatus_escritor )
											.then(  function validacion(results) {
													$('#11').attr('value','Asignado')
													iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
													playSound('../sound/message_received.mp3');
											})
											.catch( function(err){
													iziToast.error({title: 'Verificar',message: err});
													playSound('../sound/message_received.mp3');
											})
							
			
					})
					.catch( function(err){
							iziToast.error({title: 'Verificar',message: err});
							playSound('../sound/message_received.mp3');
			
					}) 
		
            break;
        case '2':
		
		const request2 = "select writer from project where '"+nombre_proyecto+"'=title;"
        
			comun.sql( request2 )
			.then( function Contenido(results){
			
			
		//document.getElementById("1").options[0].innerText=='No asignado'
        if( results.rows[0].writer==null ){
													iziToast.error({title: 'Verificar',message: 'Asigne un colaborador para la etapa anterior'});
													playSound('../sound/message_received.mp3');
		}else{
				nombre_seleccionado=$("#2 option:selected").text()
				const actualizar_locutor= "update project set  announcer='"+nombre_seleccionado+"' where  title='"+nombre_proyecto+"';"              
      
				comun.sql( actualizar_locutor )
					.then(  function validacion(results) {
									const actualizar_estatus_locutor = "update project set  statusannouncer='Asignado' where  title='"+nombre_proyecto+"';"
											comun.sql( actualizar_estatus_locutor )
											.then(  function validacion(results) {
													$('#22').attr('value','Asignado')
													iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
													playSound('../sound/message_received.mp3');
											})
											.catch( function(err){
													iziToast.error({title: 'Verificar',message: err});
													playSound('../sound/message_received.mp3');
											})
							
			
					})
					.catch( function(err){
							iziToast.error({title: 'Verificar',message: err});
							playSound('../sound/message_received.mp3');
			
					}) 

			}
           
           })
			.catch( function(err){
													iziToast.error({title: 'Verificar',message: err});
													playSound('../sound/message_received.mp3');
			})
            break;
		case '3': 
		
		const request3 = "select announcer from project where '"+nombre_proyecto+"'=title;"
        
			comun.sql( request3 )
			.then( function Contenido(results){
			
			
		//document.getElementById("1").options[0].innerText=='No asignado'
        if( results.rows[0].announcer==null ){
													iziToast.error({title: 'Verificar',message: 'Asigne un colaborador para la etapa anterior'});
													playSound('../sound/message_received.mp3');
		}else{
        nombre_seleccionado=$("#3 option:selected").text()
			const actualizar_editor= "update project set  editor='"+nombre_seleccionado+"' where  title='"+nombre_proyecto+"';"              
      
				comun.sql( actualizar_editor )
					.then(  function validacion(results) {
									const actualizar_estatus_editor = "update project set  statuseditor='Asignado' where  title='"+nombre_proyecto+"';"
											comun.sql( actualizar_estatus_editor )
											.then(  function validacion(results) {
													$('#33').attr('value','Asignado')
													$('#exampleCheck1').attr('checked', true).attr('disabled',true)
													iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
													playSound('../sound/message_received.mp3');
											})
											.catch( function(err){
													iziToast.error({title: 'Verificar',message: err});
													playSound('../sound/message_received.mp3');
											})
							
			
					})
					.catch( function(err){
							iziToast.error({title: 'Verificar',message: err});
							playSound('../sound/message_received.mp3');
			
					}) 
			}
			 })
			.catch( function(err){
													iziToast.error({title: 'Verificar',message: err});
													playSound('../sound/message_received.mp3');
			})
         
            break;        
	  default:         
    }	
}

$(document).on("change", "#000", function(){
	
nombre_proyecto		= document.getElementById("Nombre").value
fecha_introducida	= $(this).val()

fecha_comprobar=fecha_introducida
var anno_introducido = fecha_comprobar.split('-')[0]
//var mes_introducido = fecha_comprobar.split('-')[1]
//fecha_comprobar=fecha_comprobar.replace('-','/')
//var dia_introducido = fecha_comprobar.split('-')[1]

var hoy = new Date();
//var dd = hoy.getDate();
//var mm = hoy.getMonth()+1; 
var yyyy = hoy.getFullYear();

if(yyyy<=anno_introducido && anno_introducido<2200){

const actualizar_fecha= "update project set  enddatecontent='" + fecha_introducida + "' where  title='" + nombre_proyecto + "';"
      
				comun.sql(actualizar_fecha)
						.then(  function si(results){
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						})

}

})
	
$(document).on("change", "#111", function(){
	
nombre_proyecto		= document.getElementById("Nombre").value
fecha_introducida	= $(this).val()

fecha_comprobar=fecha_introducida
var anno_introducido = fecha_comprobar.split('-')[0]
//var mes_introducido = fecha_comprobar.split('-')[1]
//fecha_comprobar=fecha_comprobar.replace('-','/')
//var dia_introducido = fecha_comprobar.split('-')[1]

var hoy = new Date();
//var dd = hoy.getDate();
//var mm = hoy.getMonth()+1; 
var yyyy = hoy.getFullYear();

if(yyyy<=anno_introducido && anno_introducido<2200){

const actualizar_fecha= "update project set  enddatewriter='" + fecha_introducida + "' where  title='" + nombre_proyecto + "';"
      
				comun.sql(actualizar_fecha)
						.then(  function si(results){
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						})

}

})

$(document).on("change", "#222", function(){
	
nombre_proyecto		= document.getElementById("Nombre").value
fecha_introducida	= $(this).val()

fecha_comprobar=fecha_introducida
var anno_introducido = fecha_comprobar.split('-')[0]
//var mes_introducido = fecha_comprobar.split('-')[1]
//fecha_comprobar=fecha_comprobar.replace('-','/')
//var dia_introducido = fecha_comprobar.split('-')[1]

var hoy = new Date();
//var dd = hoy.getDate();
//var mm = hoy.getMonth()+1; 
var yyyy = hoy.getFullYear();

if(yyyy<=anno_introducido && anno_introducido<2200){

const actualizar_fecha= "update project set  enddateannouncer='" + fecha_introducida + "' where  title='" + nombre_proyecto + "';"
      
				comun.sql(actualizar_fecha)
						.then(  function si(results){
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						})

}

})

$(document).on("change", "#333", function(){
	
nombre_proyecto		= document.getElementById("Nombre").value
fecha_introducida	= $(this).val()

fecha_comprobar=fecha_introducida
var anno_introducido = fecha_comprobar.split('-')[0]
//var mes_introducido = fecha_comprobar.split('-')[1]
//fecha_comprobar=fecha_comprobar.replace('-','/')
//var dia_introducido = fecha_comprobar.split('-')[1]

var hoy = new Date();
//var dd = hoy.getDate();
//var mm = hoy.getMonth()+1; 
var yyyy = hoy.getFullYear();

if(yyyy<=anno_introducido && anno_introducido<2200){

const actualizar_fecha= "update project set  enddateeditor='" + fecha_introducida + "' where  title='" + nombre_proyecto + "';"
      
				comun.sql(actualizar_fecha)
						.then(  function si(results){
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						})

}

})

$(document).ready(function(){
	
        var request = "SELECT * FROM proyectoVisualizado"
        path = require('path')

        comun.sql(request)
            .then(result =>
            {	
            	debugger
                if (result.rows.length)
                {
                    request2   = "select title, description, enddate, image, anotacion," +
                                "contentcreator,enddatecontent, enddatewriter,writer, enddateannouncer,announcer,enddateeditor, editor," +
                                "statuscontentcreator, statuswriter, statusannouncer, statuseditor," +
                                "statusproject " +
                                "FROM project WHERE title = '{0}'".format(result.rows[0].proyecto)
					debugger
                    comun.sql(request2)
                        .then(result2 =>
                        {
							debugger
               				//MOSTRAR IMAGEN DEL PROYECTO		
							transformar_direccion_para_id='principalImagen'
												while (transformar_direccion_para_id.split(' ').length>1){
												transformar_direccion_para_id=transformar_direccion_para_id.replace(' ','%%%%%')	
												}
												
                            $("#ajus").append(
                                "<div class='carousel-item active' > <img id='{1}' class='d-block w-100' src='{0}'></div>"
                                .format(result2.rows[0].image,transformar_direccion_para_id)
                                
                            )

                            //Imegenes del slider
                            request3 = "select id, idProject, imageName FROM imagesProject WHERE idProject = '{0}';".format(result2.rows[0].title)
                            comun.sql(request3)
                                .then(result3 =>{
                                   
                                    for (var i = 0; i < result3.rows.length; i++)
                                    {

											direccion=result3.rows[i].imagename
                                    while (direccion.split('\\').length>1){
											direccion=direccion.replace('\\','%%%%%')
												
										}
										while (direccion.split(' ').length>1){
											direccion=direccion.replace(' ','#####')
												
										}
										
                                        $("#ajus").append(
                                                ("<div class='carousel-item ' id={2} onclick=eliminar(this)>" +
                                                "<img class='d-block w-100' src='{1}'>" +
                                                "</div>")
                                                .format(result3.rows[i].idproject,result3.rows[i].imagename,direccion)
                                            )
                                    }

                                }).catch(err =>
                                {
                                	comun.notificacion('error','Error',err)
                                })

							debugger
                            $("#Nombre").attr("value", result2.rows[0].title)
                            $("#labelNombre").attr("class",'active')

                            $("#Descripcion").attr("value",result2.rows[0].description)
                          	$("#labelDescripcion").attr("class",'active')
                            
                            $("#Fecha").attr("value", fecha_transformada(result2.rows[0].enddate))
							$("#labelFecha").attr("class",'active')

                            $("#Estado").attr("value",result2.rows[0].statusproject)
                          	$("#labelEstado").attr("class",'active')

                            a = [

                             ["Creador de contenido", result2.rows[0].contentcreator, result2.rows[0].statuscontentcreator, result2.rows[0].enddatecontent],
                             ["Escritor", result2.rows[0].writer, result2.rows[0].statuswriter, result2.rows[0].enddatewriter],
                             ["Locutor", result2.rows[0].announcer, result2.rows[0].statusannouncer, result2.rows[0].enddateannouncer],
                             ["Editor", result2.rows[0].editor, result2.rows[0].statuseditor, result2.rows[0].enddateeditor]

                            ]
                            
							if(a[3][2]!="Asignado"){
								$("#checkbox").remove()
							}else{
							$("#exampleCheck1").on('click', function(){
								finalizado=!finalizado
								})
							}
                           
                            for (var i = 0; i < 4; i++){
                                if (a[i][1] == null)
                                {
                                    a[i][1] = 'No asignado'
                                }                               
                                if (a[i][3] == null)
                                {
                                    a[i][3] = result2.rows[0].enddate//"Sat Dic 31 2200 continuara" //
                                }
                                                                                            
                                $("#colaboradores").append(
                                    "<li class='ist-group-item'> "+a[i][0]+" :</br>Nombre del colaborador:<select onchange='cambiar_colaborador(this)' class='form-control' id="+i+" placeholder='Ordenar' ><option value='"+a[i][1]+"' selected='selected'>"+a[i][1]+"</option></select></li>Fecha de entrega: <input type='date' id="+i+i+i+" class='form-control'  value="+fecha_transformada(a[i][3])+"><label for='Nombre'>Estatus: </label><input type='text' class='form-control' id="+i+i+" disabled='true' value='"+a[i][2]+"'> </br></br>"                                                       
                                ) 
                                                                                               
                            }
                             
                             
                             const colaboradores_tipo="select userName from collaborator where tipo='"+a[0][0]+"';"
                              comun.sql(colaboradores_tipo)
                                
                                .then(resultado =>{										
											
											for(var j=0;j<resultado.rows.length;j++){
												if(resultado.rows[j].username!=a[0][1]){												
												$('#0').append(	"<option value={0}>{0}</option>".format(resultado.rows[j].username))					
												}
											}	
								})
                                .catch(err =>{
                                    
                                    iziToast.error({title: 'Verificar',message: err});
                                    playSound('../sound/message_received.mp3');
								
                                })
                                
                                const colaboradores_tipo1="select userName from collaborator where tipo='"+a[1][0]+"';"
                              comun.sql(colaboradores_tipo1)                                
                                .then(resultado =>{										
											
											for(var j=0;j<resultado.rows.length;j++){
												if(resultado.rows[j].username!=a[1][1]){												
												$('#1').append(	"<option value={0}>{0}</option>".format(resultado.rows[j].username))					
												}
											}	
								})
                                .catch(err =>{
                                    
                                    iziToast.error({title: 'Verificar',message: err});
                                    playSound('../sound/message_received.mp3');
								
                                })
                          
								const colaboradores_tipo2="select userName from collaborator where tipo='"+a[2][0]+"';"
                              comun.sql(colaboradores_tipo2)                                
                                .then(resultado =>{										
											
											for(var j=0;j<resultado.rows.length;j++){
												if(resultado.rows[j].username!=a[2][1]){												
												$('#2').append(	"<option value={0}>{0}</option>".format(resultado.rows[j].username))					
												}
											}	
								})
                                .catch(err =>{
                                    
                                    iziToast.error({title: 'Verificar',message: err});
                                    playSound('../sound/message_received.mp3');
								
                                })


								const colaboradores_tipo3="select userName from collaborator where tipo='"+a[3][0]+"';"
                              comun.sql(colaboradores_tipo3)                                
                                .then(resultado =>{										
											
											for(var j=0;j<resultado.rows.length;j++){
												if(resultado.rows[j].username!=a[3][1]){												
												$('#3').append(	"<option value={0}>{0}</option>".format(resultado.rows[j].username))					
												}
											}	
								})
                                .catch(err =>{
                                    
                                    iziToast.error({title: 'Verificar',message: err});
                                    playSound('../sound/message_received.mp3');
								
                                })
                
                                                       
                           //Consulta para mostrar todos los archivos de los proyectos
                            request = "select id, idProject, archivoName FROM archivosProject WHERE idProject = '{0}'".format(result2.rows[0].title)
                            comun.sql(request)
                                
                                .then(resultado =>{
                                  
									//For para mostrar todos los archivos de los proyectos
									for(var i=0;i<resultado.rows.length;i++)
									{	
										nombre_archivo=resultado.rows[i].archivoname
										direccion=resultado.rows[i].archivoname
										//Sustituir para conseguir solo el nombre del proyecto y no la direccion completa 
										while (nombre_archivo.split('/').length>2){
											nombre_archivo=nombre_archivo.replace('/','\\')	
										}
										//Sustituir los espacio para que se puedo reconocer cuando se pase para la otra funcion 
										while (direccion.split(' ').length>1){
											direccion=direccion.replace(' ','%%%%%')	
										}
									
									nombre_archivo=nombre_archivo.split('/')[1]
                                        $("#archivos").append(
                                            "<li class='list-group-item' id={1} text={1} onclick='abrir_o_eliminar(this)'>{0}</li>"
                                            .format(nombre_archivo,direccion))

                                    }
                                })
                                .catch(err =>{
                                    
                                    iziToast.error({
                                        title: 'Verificar',
                                        message: err
                                    });
                                    playSound('../sound/message_received.mp3');
								
                                })
                             
                            $("#anotacion").attr('rows', 20).append(result2.rows[0].anotacion)
                           
                        })
                        .catch(err =>
                        {
                            iziToast.error({ title: 'Verificar',message: err});
                            playSound('../sound/message_received.mp3');
						

                        })
                }
            })
            .catch(function()
            {
                iziToast.error({title: 'Verificar',message: 'Error'});
                playSound('../sound/message_received.mp3');
            })
})

document.getElementById('guardaranotacion').addEventListener("click", function(){
       
username = document.getElementById("Nombre").value
anotacion = document.getElementById("anotacion").value
   
const cantidadanotaciones = request = "select anotacion from project where title='" + username + "';"
  comun.sql( cantidadanotaciones )
  .then(  function verificar(results) {
		if(results.rowCount>0){
														
		    const actualizaranotaciones = "update project set  anotacion='" + anotacion + "' where  title='" + username + "';"
      
				comun.sql( actualizaranotaciones)
						.then(  function si(results) {
							
							$('#anotacion').empty();                          							                          
							$("#anotacion").attr( 'rows',20).append(anotacion)							           
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');
																								
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						}) 
			
		}else{
		
		    const consulta = 'insert into project(title,anotacion) VALUES($1,$2) RETURNING *'
				const	values = [username,anotacion]
				comun.sql2( consulta,values )
						.then(  function si(results) {
			           
						    $('#anotacion').empty();
                            
						    $("#anotacion").attr( 'rows',20).append(anotacion)
						   
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');																					
				 
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						})
		
		}
			
 
  })
	.catch(function (err) {
	    iziToast.error({title: 'Verificar',message: err});
	    playSound('../sound/message_received.mp3');
	
		        
		})		            
})

document.getElementById('guardar_proyecto').addEventListener("click", function(){
	nombre_proyecto = document.getElementById("Nombre").value
	//seleccion_estado_proyecto  = document.getElementById("exampleCheck1").checked;
	nueva_fecha_entrega = document.getElementById("Fecha").value
	var consulta
	if($("#checkbox").length > 0 && finalizado)
	{
		consulta = "update project set  enddate='" + nueva_fecha_entrega + "', statusProject = 'Finalizado'  where  title='" + nombre_proyecto + "';"
	}
	else
	{
		consulta = "update project set  enddate='" + nueva_fecha_entrega + "'  where  title='" + nombre_proyecto + "';"
	}
	debugger
				comun.sql( consulta )
						.then(  function si(results) {
							iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
							playSound('../sound/message_received.mp3');							
						})
						.catch(function (err) {
						    iziToast.error({title: 'Verificar',message: err});
						    playSound('../sound/message_received.mp3');
			
						})
})

document.getElementById('eliminar_proyecto').addEventListener("click", function(){
	nombre_proyecto = document.getElementById("Nombre").value
		const consulta_eliminar_imagen_principal= "select image from project where '"+nombre_proyecto+"'=title;"
		const consulta_eliminar_slider_imagenes="select imagename from imagesproject where '"+nombre_proyecto+"'=idproject" 
		const eliminar_proyecto = "delete from project where '"+nombre_proyecto+"'=title;" 
		
		comun.sql(consulta_eliminar_imagen_principal)
          .then(resultado =>{
				 eliminar_archivo(resultado.rows[0].image)
				
						comun.sql(consulta_eliminar_slider_imagenes)
							.then(resultado2 =>{
								
								for(var i=0;i<resultado2.rows.length;i++){
								eliminar_archivo(resultado2.rows[i].imagename)
								
								}
									comun.sql( eliminar_proyecto );
									iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
									playSound('../sound/message_received.mp3');	
									
							})
							.catch(function()
							{
									iziToast.error({title: 'Verificar1',message: 'Error'});
									playSound('../sound/message_received.mp3');
							})			
		 })
		 .catch(function()
          {
									iziToast.error({title: 'Verificar2',message: 'Error'});
									playSound('../sound/message_received.mp3');
          })		 

})
