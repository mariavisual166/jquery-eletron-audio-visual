const comun = require('../js/comun.js')
String.prototype.format = comun.formatString

function localizacion(){
	 window.location = "../View/Configuracion.html";	
}

function playSound(soundFile) {
        if(soundFile === undefined) return; 
        var audio = document.createElement('audio');
        audio.src = soundFile;
        audio.play();
        audio = undefined;
    }
    
//Cambiar clave
$("#cambiarClave").on('click', function()
{
	
	const claveAnterior = $("#claveAnterior").val()
	const claveNueva = $("#claveNueva").val()
	if(!claveAnterior || !claveNueva)
	{
		
		 iziToast.error({title: 'Verificar',message:'Ingrese clave, anterior y nueva'});
									    playSound('../sound/message_received.mp3');
							
//		notificacion = new Notification("Ingrese clave, anterior y nueva")
	}
	else
	{
		comun.sql("SELECT * FROM logueado")
			.then(result =>{
				var request = "SELECT password FROM admint WHERE admint = '{0}'"
				logueado = result.rows[0].usuario
				comun.sql(request.format(logueado))
					.then(result =>{
						if(result.rows[0].password != claveAnterior)
						{
							 iziToast.error({title: 'Verificar',message: "Clave, no es igual a la anterior"});
									    playSound('../sound/message_received.mp3');
											
						//	notificacion = new Notification("Clave, no es igual a la anterior")
						}
						else
						{
							request = "UPDATE admint SET password = '{0}' WHERE admint = '{1}'"
							comun.sql(request.format(claveNueva,logueado))
								.then(result =>{
										iziToast.success({title: 'OK',message: 'Clave, cambiada exitosamente',});
										playSound('../sound/message_received.mp3');

									
								})
								.catch(err =>{
									notificacion = new Notification("Error, al cambiar clave")
								})
						}
					})
					.catch(err =>{
						notificacion = new Notification("Error, al cambiar clave")
					})
			})
			.catch(err =>{
				notificacion = new Notification("Error, al cambiar clave")
			})
		}
})

$("#cambiarEmail").on('click',function()
{
	nuevoEmail = $("#nuevoEmail").val()
	if(!nuevoEmail)
	{
		notification = new Notification("Ingrese nuevo correo electronico")
	}
	else
	{
		comun.sql("SELECT * FROM logueado")
			.then(result =>{
				request = "UPDATE admint SET correo = '{0}' WHERE usuario = '{1}'"
				comun.sql(request.format(nuevoEmail, result.rows[0].usuario))
				.then(result =>{
					iziToast.success({title: 'OK',message: 'Correo cambiado exitosamente',});
										playSound('../sound/message_received.mp3');
				
				})
				.catch(err =>{
					notification = new Notification("Error, al cambiar correo")
				})
			})
			.catch(err =>{
				notification = new Notification("Error, al cambiar correo")
			})
	}
	
})

//Cambiar imagen -- falta probar
$("#nuevaImagen").on('change', function()
{
	
	if($(this)[0].files[0])
	{
		$("#ImagenUsuario").attr('src', $(this)[0].files[0].path)	
	}

})
$("#cambiarImagen").on('click', function()
{
	const query = "UPDATE admint SET image = '{0}'"
	comun.getBase64($("#nuevaImagen")[0].files[0]).then(data => 
	{  
		
		comun.sql(query.format(data))
			.then(function()
			{
				//$("#ImagenUsuario").attr('src', data)
				
				iziToast.success({title: 'OK',message: 'Imagen cambiada exitosamente',});
										playSound('../sound/message_received.mp3');
										setTimeout('localizacion()',2000);
			})
			.catch(err =>
			{
				console.log(err)
			})
	})
})

//Cambiar usuario
$("#cambiarUsuario").on('click', function()
{
	nuevoNombre = $("#nuevoUsuario").val()
	if(!nuevoNombre)
	{
		notification = new Notification("Ingrese nuevo correo electronico")
	}
	else
	{
		comun.sql("SELECT * FROM logueado")
			.then(result =>{
				request = "UPDATE admint SET admint = '{0}' WHERE admint = '{1}'"
				comun.sql(request.format(nuevoNombre, result.rows[0].usuario))
				.then(result =>{
					iziToast.success({title: 'OK',message: 'Usuario cambiado exitosamente'});
										playSound('../sound/message_received.mp3');
					
				})
				.catch(err =>{
					notification = new Notification(err + "Error, al cambiar usuario")
				})
			})
			.catch(err =>{
				notification = new Notification(err + "Error, al cambiar correo")
			})
	}
})
