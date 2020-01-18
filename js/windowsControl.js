ipcRenderer = require('electron').ipcRenderer
comun2 = require('../js/comun.js')

String.prototype.format = comun2.formatString

document.getElementById('minimizar').addEventListener("click", function(){ ipcRenderer.send('minimizar'); })
document.getElementById('fullscreen').addEventListener("click", function(){ ipcRenderer.send('fullscreen'); })
document.getElementById('cerrar').addEventListener("click", function(){ ipcRenderer.send('cerrar'); })
//$(document).on('ready', function()
//{ 
//	debugger
	comun2.sql("SELECT * FROM logueado")
		.then(result => 
		{
			//debugger
			comun2.sql("SELECT image FROM admint WHERE admint = '"+result.rows[0].usuario+"'")
				.then(result => 
				{//debugger
					$("#imagenprincipal").attr('src',result.rows[0].image)	
				})
		})
		.catch(function()
		{
			
		})
//})


function playSound(soundFile) {
    if(soundFile === undefined) return; 
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
    
    return ( mes+ "/"+ dia+ "/" + anno  )

}

//window.onload = function {
var intevalo = setInterval('notificar()',3000000);

//}

function diferencia_fecha(fecha, fecha_actual){
var date1 = new Date(fecha)
var date1Msec = date1.getTime();
var date2 = new Date(fecha_actual)
var date2Msec = date2.getTime();
var interval = date1Msec - date2Msec;
return (Math.floor(interval / 86400000 ))
}


function notificar(){
debugger
consulta="select statusproject,title,endDate,tiempo_notificacion from project where (statusproject='Asignado' and tiempo_notificacion<3) ;"
	comun2.sql(consulta)
			.then(result =>{
			console.log(result)
if(result.rows.length>0){				
				
				var i = -1;


  var intervalo = setInterval(function() {

    i += 1;

    if (i == result.rows.length) {
      clearInterval(intervalo);
    }
    
   if(result.rows.length>i){
    
    if(result.rows[i].tiempo_notificacion<3){
							fecha=fecha_transformada(result.rows[i].enddate)
							var fecha_actual = new Date();
							fecha_actual=   (fecha_actual.getMonth() +1)+ "/" + fecha_actual.getDate() + "/" +fecha_actual.getFullYear()
							if(diferencia_fecha(fecha,fecha_actual)<=1){
							iziToast.warning({title: 'Alerta',message: 'Se acerca la entrega del proyecto: "'+result.rows[i].title+'"',
								 buttons: [
        ['<button><b>SI</b></button>', function (instance, toast) {
			comun2.proyectosRedirec(result.rows[i].title,'VentanaProyecto.html')

        }, true],
        ['<button>NO</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
 
        }],
    ],
								}); 
							playSound('../sound/message_received.mp3');
							}
	}else{
								if(result.rows[i].tiempo_notificacion==3){
										actualizar_tiempo="update project set tiempo_notificacion=0 where title='"+result.rows[i].title+"'; "
										comun.sql( actualizar_tiempo )
										.then(  function si(result2) {
										
										})
										.catch(err => {
											console.log(err)         
										});
								}else{
										actualizar_tiempo="update project set tiempo_notificacion='"+(result.rows[i].tiempo_notificacion+1)+"' where title='"+result.rows[i].title+"'; "
										comun.sql( actualizar_tiempo )
										.then(  function si(result2) {
										
										})
										.catch(err => {
											console.log(err)
											//iziToast.error({title: 'Verificar insertar imagen',message: err});
											//playSound('../sound/message_received.mp3');
									         
										});
								}
						
		}
    
    }

  }, 300000);

	
}		
			
			})
			.catch(err =>{
				
				console.log(err)
						
			})

}   

	
