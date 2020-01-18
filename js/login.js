
var path = require('path')

function playSound(soundFile) {
        if(soundFile === undefined) return; 
        var audio = document.createElement('audio');
        audio.src = soundFile;
        audio.play();
        audio = undefined;
    }


function pulsar(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
		
        e.preventDefault();
        iniciar_sesion()
        
        
	}
	
}
document.getElementById('inicio').addEventListener("click", function(){
iniciar_sesion()
})


 function iniciar_sesion(){

	usuario = document.getElementById("usuario").value
	clave = document.getElementById("password").value
	
	const config = {database: 'audio', password: '0000', user:'postgres'}
	const request = 'SELECT admint, password FROM admint WHERE admint = $1'
	const values = [usuario]
	const { Client } = require('pg')
	const client = new Client(config)
	client.connect()
 
	try
	{
		
							
		client.query('DELETE FROM logueado').then()
		
		try
		{
			client.query(request,values).then(function (res) {
			   
			    if(res.rows[0]){
					if(res.rows[0].password == clave){
						client.query('INSERT INTO logueado(usuario) VALUES($1)',[usuario]).then()
						location.href = '../index.html'
						
					}
					else{
						iziToast.error({
							title: 'Error',
							message: 'Contraseña Incorrecta'
									});
							playSound('../sound/message_received.mp3');
					}
				}
				else{
						iziToast.error({
							title: 'Error',
							message: 'Usuario erroneo'
									});
							playSound('../sound/message_received.mp3');
					
				}
			})
		}
		catch(err)
		{
						iziToast.error({
							title: 'Error',
							message: 'error consulta'
									});
							playSound('../sound/message_received.mp3');
			
		}
	}
	catch(err)
	{
						iziToast.error({
							title: 'Error',
							message: 'error coneccion'
									});
							playSound('../sound/message_received.mp3');
		
	}

    

}
