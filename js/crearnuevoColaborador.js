const comun = require('../js/comun.js')
fs = require('fs')



function openFile(event){

			var input = event.target;
			var reader = new FileReader();
			reader.onload = function(){
			var dataURL = reader.result; 
			
			var output = document.getElementById('imagen1');
			var output2 = document.getElementById('imagen2');
			output2.src = dataURL;
			output.src = dataURL;
					
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
	
		  window.location = "../View/VentanaColaboradores.html";
		  	 
 } 
			
document.getElementById('guardar').addEventListener("click", function(){
 
	username = document.getElementById("nombre").value
 
 
 if(!username ||  username.length>20){
							if(!username){
								iziToast.error({title: 'Verificar',message: 'Ingrese un nombre'});
								playSound('../sound/message_received.mp3');
							}else{
								iziToast.error({title: 'Verificar',message: 'Ingrese un nombre con menos de 20'});
								playSound('../sound/message_received.mp3');
							}
							
 }else{
    email = document.getElementById("email").value
    price = document.getElementById("precio").value
    tipo = $("#TipoColaborador").val()
    
 file = document.getElementById("file").files[0];;
				
	if(file!=undefined){	
			   		
			username = document.getElementById("nombre").value;
		

						
				comun.getBase64(file).then(data => 
				{  
								
							const consulta = 'INSERT INTO collaborator(username,email,price,image,data_image,tipo) VALUES($1,$2,$3,$4,$5,$6) RETURNING *'
									const	values = [username,email,price,file,data,tipo]
										comun.sql2( consulta,values )
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
							var image =comun.defaultImage
							const consulta = 'INSERT INTO collaborator(username,email,price,data_image,tipo) VALUES($1,$2,$3,$4,$5) RETURNING *'
								const	values = [username, email,price,image,tipo]
									comun.sql2( consulta,values )
										.then(  function si(results) {
											iziToast.success({title: 'OK',message: 'Se han guadados los cambios'});
											playSound('../sound/message_received.mp3');	
											setTimeout('localizacion()',1000);
										})
										.catch(err => {
											iziToast.error({title: 'Verificar insertar imagen',message: err});
											playSound('../sound/message_received.mp3');
									          
										});
											
	}
														        
}       
  
})
  
  
