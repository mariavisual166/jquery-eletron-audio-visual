const comun = require('../js/comun.js')
fs = require('fs')

function modificar_tamanno_imagen(direccion_imagen,direccion_destino,username,nombre_imagen){

	var Jimp = require("jimp");
	
Jimp.read(direccion_imagen)
	.then(function (lenna) {

		lenna.resize(256, 256)           
         .quality(100)                
         .write(direccion_destino); 
        
		copiar_imagen(nombre_imagen,username,direccion_destino)
	})
	.catch(function (err) {
		console.error(err);
	});
	

}

function imprimir_imagen(){
username = document.getElementById("nombre").value
const consultar_imprimir_imagen= "select image,data_image from collaborator where username='"+username+"';"
	comun.sql(consultar_imprimir_imagen)
	.then(  function si(readResult) {
		
		
				url = window.location.pathname.split('View')[0];
				url=url.replace('/',''); 
				var reg = /\//; 
				while(url.match(reg)=='/'){
				url=url.replace('/',"\\");
				}
				while(url.split('%20').length>1){	
				url=url.replace('%20',' ')
				}	
				url=url+"temporal\\"+ readResult.rows[0].image	
				
					
			fs.writeFileSync(url, readResult.rows[0].data_image);
   			
   			$('#imagen').attr('src', url);
   			$('#imagen1').attr('src', url);
   			//writeFileSync
	 })
	.catch( function(err){			
						//	iziToast.error({title: 'No copio imagen',message: err});
						//	playSound('../sound/message_received.mp3');
	})	 
	 
}

function eliminar_archivo(dir_path){
	const fs = require('fs-extra')
   fs.remove(dir_path, err => {
  
})}

var openFile = function(event){
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      var output = document.getElementById('imagen1');
      output.src = dataURL;
       var output2 = document.getElementById('imagen2');
      output2.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
  };
 
function playSound(soundFile) {
        if(soundFile === undefined) return; 
        var audio = document.createElement('audio');
        audio.src = soundFile;
        audio.play();
        audio = undefined;
    }
    
function localizacion(){
	
		 
		 username = document.getElementById("nombre").value
		const obtener_nombre_imagen= "select image from collaborator where username='"+username+"';"
		 comun.sql(obtener_nombre_imagen)
				.then(  function si(results) {
					console.log(results)							
							if(results.rows.length>0){
							if(results.rows[0].image.split('/').length==1)
							{
								var reg = /\//; 
								var	url = window.location.pathname.split('View')[0];
									url=url.replace('/',''); 
										while(url.match(reg)=='/'){
											url=url.replace('/',"\\");
										}
										while(url.split('%20').length>1){	
											url=url.replace('%20',' ')
										}	
				
									url=url+"temporal\\"+ results.rows[0].image
								
								//	eliminar_archivo(url)				
							}
						}							
							 window.location = "../View/VentanaColaboradores.html";																	
						})
						.catch( function(err){
								iziToast.error({title: 'Verificar',message:err});									
								playSound('../sound/message_received.mp3');										
						}) 
						
						
			
 }   

	
 	
function MostrarTodo(resultado){
									 
				const request2 = "select distinct l.idProject,l.stage,l.currentlyDevelopment,e.tipo,e.email,e.price,e.image from assignedProject as l join collaborator as e on l.currentlyDevelopment=e.userName where '"+resultado+"'=currentlyDevelopment;"
        
			comun.sql( request2 )
			.then( function Contenido(results){
				
											
                        $("#nombre").attr('value',results.rows[0].currentlydevelopment);
                        $("#email").attr('value',results.rows[0].email);
                        $("#precio").attr('value',results.rows[0].price);						
						$("#TipodeColaborador").attr('value',results.rows[0].tipo);
								for(var i=0;i<results.rowCount;i++){                         
										$("#Proyecto").append('<ul>').append($('<li>', { 
										value: 0,
										text : results.rows[i].idproject
										}));                                
									}
									$("#Proyecto").append('<br/>')
							
							$('#imagen1').attr('src', results.rows[0].data_image)
							$('#imagen2').attr('src', results.rows[0].data_image)
						
						           			
			})
			.catch( function(err){
				
						const request22 = "select * from collaborator where '"+resultado+"'=username;"
						comun.sql( request22 )
						.then( function Imprimir(results){
							$("#nombre").attr('value',results.rows[0].username);
							$("#email").attr('value',results.rows[0].email);
							$("#precio").attr('value',results.rows[0].price);
							$("#Proyecto").append('<ul>').append($('<li>', { 
										value: 0,
										text : 'No tiene proyecto asignado'
										}));
											$("#Proyecto").append('<br/>')
							$("#TipodeColaborador").attr('value',results.rows[0].tipo);	
							
							$('#imagen1').attr('src', results.rows[0].data_image)
							$('#imagen2').attr('src', results.rows[0].data_image)
							
							
						})
						.catch( function(err){
						    iziToast.error({title: 'Verificar ',message: err});									
						    playSound('../sound/message_received.mp3');
								
						})
			
			}) 
			
     }
 
 $(document).ready(function(){           
            const request = 'select * from acceso;'
           comun.sql( request )
			.then( function Usuario(results){ 			                      
              MostrarTodo(results.rows[0].usuario); 
									const anotaciones="select * from collaborator where '"+results.rows[0].usuario+"'=username;"
									comun.sql( anotaciones )
									.then( function Contenido2(results){
																													                               											
											if(results.rowCount==0)
											{
												$("#textoanotacion").attr( 'rows',10).append('No tiene anotaciones asignadas')
												 
											}else{                                              

											    $("#textoanotacion").attr( 'rows',10).append(results.rows[0].anotacion)

											}
										
									})
									.catch( function(err){

									    iziToast.error({
									        title: 'Verificar',
									        message: err
									    });
									
									    playSound('../sound/message_received.mp3');
												
											
									})
             
              const request3 = 'truncate table acceso;'            
						 comun.sql( request3 );                          														
			})
            .catch( function(err){
                localizacion()
			
		})

})		
    
document.getElementById('eliminar').addEventListener("click", function(){

     username = document.getElementById("nombre").value
      
	const consulta_eliminar_imagen="select image from collaborator  where  username='"+username+"';"
	const requesteliminarasignado = "delete from assignedProject where '"+username+"'=currentlyDevelopment;" 
	const requesteliminarcollaborator = "delete from collaborator where '"+username+"'=username;"
	//const requesteliminaranotacion = "delete from annotationsCollaborator where '"+username+"'=idCollaborator;" 
	
	comun.sql(consulta_eliminar_imagen)
				.then( function Contenido3(results){
					
					//eliminar_archivo(results.rows[0].image)
					comun.sql( requesteliminarcollaborator );
					comun.sql( requesteliminarasignado );
					
				
				})
				.catch( function(err){
							iziToast.error({title: 'Verificar',message: 'Error en eliminar imagen '+err});									
							playSound('../sound/message_received.mp3');
				})
		
						iziToast.success({title: 'OK',message: 'Se ha eliminado',});
						playSound('../sound/message_received.mp3');
						setTimeout('localizacion()',1500);

})

function copiar_imagen(nombre_imagen,nombre_colaborador,url){
						fs = require('fs')
						fs.readFile(url,'hex', (err, imgData) => { 
							  				
							imgData = '\\x' + imgData;			
								const actualizar_imagen_perfil= "update collaborator set  image='"+nombre_imagen+"', data_image= '"+imgData+"'  where  username='"+nombre_colaborador+"';" 
									comun.sql( actualizar_imagen_perfil )
										.then(  function si(results) {															
											iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
											playSound('../sound/message_received.mp3');		
											//setTimeout('localizacion()',1000);
										})
										.catch(err => {
											iziToast.error({title: 'Verificar insertar imagen',message: err});
											playSound('../sound/message_received.mp3');
									         
										});
						});
}
	    
document.getElementById('guardar').addEventListener("click", function(){
          
    username = document.getElementById("nombre").value
    email = document.getElementById("email").value
    price = document.getElementById("precio").value
  //  tipo = $("#TipoColaborador option:selected").text()
    // image = '../image/User_icon_BLACK-01.png';

    const text= "update collaborator set  email='"+email+"', price='"+price+"' where  username='"+username+"';"              
      
       comun.sql( text )
        .then(  function si(results) {
			           
            
							iziToast.success({
							title: 'OK',
							message: 'Se han guadados los cambios'
									});
							playSound('../sound/message_received.mp3');
							setTimeout('localizacion()',1000);
				
		})
		 .catch( function(err){
			 consle.log(err)
						
			
		})
})
		
document.getElementById('Editar2').addEventListener("click", function(){

		username = document.getElementById("nombre").value;
		
		
		file = $('#file')[0].files[0]
			if(file)
			{
					
				comun.getBase64(file).then(data => 
				{  
					
								 const text= "update collaborator set  image='"+file.name+"', data_image='"+data+"' where  username='"+username+"';"                   
									comun.sql( text )
										.then(  function si(results) {
											
											iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
												playSound('../sound/message_received.mp3');
												setTimeout('localizacion()',1000);
					
											})
											.catch(function (err) {
												console.error(err)
											})
													
				})
						
			}else{
			
			iziToast.error({title: 'Verificar:',message: 'Seleccione una foto'});
			playSound('../sound/message_received.mp3');
			} 	
})

document.getElementById('guardaranotacion').addEventListener("click", function(){
       
    username = document.getElementById("nombre").value
	anotacion = document.getElementById("textoanotacion").value
 
const cantidadanotaciones = "select * from collaborator  where  username='"+username+"';"
 
  comun.sql( cantidadanotaciones )
  .then(  function verificar(results) {
		if(results.rowCount>0){
														
				const actualizaranotaciones= "update collaborator set  anotacion='"+anotacion+"' where  username='"+username+"';"                   
				comun.sql( actualizaranotaciones)
						.then(  function si(results) {							
							$('#textoanotacion').empty();                          							                          
							$("#textoanotacion").attr( 'rows',10).append(anotacion)							           
								iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
								playSound('../sound/message_received.mp3');
																								
						})
						.catch( function(err){
								iziToast.error({title: 'Verificar',message:err});									
								playSound('../sound/message_received.mp3');										
						}) 
			
		}else{		
				const consulta = 'insert into collaborator(username,anotacion) VALUES($1,$2) RETURNING *'
				const	values = [username,anotacion]
				comun.sql2( consulta,values )
						.then(  function si(results) {			           
						    $("#textoanotacion").empty();                           
						    $("#textoanotacion").attr( 'rows',10).append(anotacion)						   
								iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
								playSound('../sound/message_received.mp3');																									 
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
 		            
})

