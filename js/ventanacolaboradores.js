fs = require('fs')
/*
function modificar_tamanno_imagen(direccion_imagen,direccion_destino){
	var Jimp = require("jimp");
Jimp.read(direccion_imagen, function (err, lenna) {
    if (err) throw err;
    lenna.resize(256, 256)           
         .quality(100)                
         .write(direccion_destino); 
});

}*/
	
	/*
function actualizar_imagen(path_origen,nombre_imagen,nombre_colaborador){
	while(path_origen.split('\\').length>1){	
	path_origen=path_origen.replace('\\','/')
	}
	url = window.location.pathname.split('View')[0];
	url=url.replace('/','')
	while(url.split('/').length>1){	
	url=url.replace('/','\\')
	}	
	
	url=url+"temporal\\"+nombre_imagen
	
fs = require('fs')
modificar_tamanno_imagen(path_origen,url)
fs.readFile(path_origen,'hex', (err, imgData) => {     	
			imgData = '\\x' + imgData;			
    sql("update collaborator set  image='"+nombre_imagen+"', data_image='"+imgData+"' where  username='"+nombre_colaborador+"';")
        .then(() => {			
			            
        })
        .catch(error => {          
        });
});


}*/

var sql = function( sqlCommand ){
	
    const config = {database: 'audio', password: '0000', user:'postgres'}
	
    return new Promise( (resolve, reject) => {
        const { Client } = require('pg')
        let pgCliente = new Client(config)
	 
        pgCliente.connect((err) => {
            if (err) return reject(err)
            pgCliente.query(sqlCommand, function(err, result) {
                if (err) return reject(err)
                resolve(result)
                pgCliente.end()
            })
     
        })
    })
}

var sql2 = function( sqlCommand2, value ){
	
    const config = {database: 'audio', password: '0000', user:'postgres'}
	
    return new Promise( (resolve, reject) => {
        const { Client } = require('pg')
        let pgCliente = new Client(config)
	 
        pgCliente.connect((err) => {
            if (err) return reject(err)
            pgCliente.query(sqlCommand2,value, function(err, result) {
                if (err) return reject(err)
                resolve(result)
                pgCliente.end()
            })
     
        })
    })
}

function playSound(soundFile) {
    if(soundFile === undefined) return; 
    var audio = document.createElement('audio');
    audio.src = soundFile;
    audio.play();
    audio = undefined;
}

function modificar(consulta){
		sql( consulta )
                   
				 .then( function Contenido(results){
					 i=0;
					 while($("#id1"+i).length > 0){
						$("#id1"+i).remove();
						i++;
					 }
					
							for(var i = 0; i < results.rowCount; i++){
								imprimir_imagen_todos_colaboradores(results.rows[i].username,results.rows[i].image ,i, results.rows[i].data_image)								
							};       
						           			
                    })
                    .catch( function(err){
						iziToast.error({title: 'ERROR',message: err});
                        playSound('../sound/message_received.mp3');
                    })

}

function cambiar(si){
   
    if(si==0)
    {
        
        const request1 = "select * FROM collaborator where (username!='No asignar locutor' and username!='No asignar editor' and username!='No asignar creador de contenido' and username!='No asignar escritor');"
        modificar(request1)
    }
    if(si==1)
    {
              
        const request2 = "select * FROM collaborator where (tipo='Escritor' and username!='No asignar escritor');"
        modificar(request2)
    }
    if(si==2)
    {
            
        const request3 = "select * FROM collaborator where (tipo='Locutor' and username!='No asignar locutor');"
        modificar(request3)
    }
    if(si==3)
    {
        const request4 = "select * FROM collaborator where (tipo='Creador de contenido' and username!='No asignar creador de contenido');"
       modificar(request4)
    }
    if(si==4)
    {
        const request5 = "select * FROM collaborator where (tipo='Editor' and username!='No asignar editor');"
        modificar(request5)
    }


}

function abrir(res) {
    const text = 'insert into acceso(usuario) VALUES($1) RETURNING *'
    const values = [res]
    sql2( text,values )
              .then( function Contenido(results){
                               
                  window.location = "../View/VentanaColaborador.html";						
              })
              .catch( function(err){
                  iziToast.error({
                      title: 'ERROR',
                      message: err
                  });
                  playSound('../sound/message_received.mp3');

              })  
                
   
                
}


function imprimir_imagen_todos_colaboradores(nombre_colaborador, nombre_imagen,i,data_image){
					
					var elem  = document.createElement('div');
			        elem.className = "colarborador";
			        elem.setAttribute('id','id1'+i );
			        var imagen = document.createElement('img');
			        var newlink  =  document.createElement( 'a' ); 
			        var tex = document.createTextNode(nombre_colaborador);
			        var union_id = document.getElementById("mas");
				  			
					imagen.setAttribute('src',data_image);
			        imagen.setAttribute('id','imagen'+i);
			        newlink.setAttribute('href' ,"#");
			        newlink.appendChild(tex);
			        newlink.setAttribute('onclick',"abrir(this.firstChild.nodeValue);return false;");
			        elem.appendChild(imagen);	
			        elem.appendChild(newlink);
			        if(union_id!=null){
			            union_id.appendChild(elem);
			         }
			       
 
			        
			 

}

function pulsar(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
		
        e.preventDefault();
        
       texbuscar= document.getElementById("buscar").value
       const colaboradores = "select * from collaborator  where   (userName='"+texbuscar+"' and username!='No asignar locutor' and username!='No asignar editor' and username!='No asignar creador de contenido' and username!='No asignar escritor');"
       sql( colaboradores )
                   
				 .then( function Contenido(results){
					 i=0;
					 while($("#id1"+i).length > 0){
						$("#id1"+i).remove();
						i++;
					 }
									if(results.rowCount>0){
										
										
										for(var i = 0; i < results.rowCount; i++){
											imprimir_imagen_todos_colaboradores(results.rows[i].username,results.rows[i].image ,i, results.rows[i].data_image)
										};
										     
									}else{
												iziToast.error({title: 'Busqueda finalizada',message: 'No hay colaboradores con este nombre'});
												playSound('../sound/message_received.mp3');

									}	           			
                    })
                    .catch( function(err){
                        iziToast.error({title: 'ERROR',message: err});
                        playSound('../sound/message_received.mp3');
                    })
       
    }
}

$(document).ready(function(){
const request = "select * FROM collaborator where (username!='No asignar locutor' and username!='No asignar editor' and username!='No asignar creador de contenido' and username!='No asignar escritor');"
sql( request )
			.then( function Contenido(results){
											
			           
			    for(var i = 0; i < results.rowCount; i++){
						imprimir_imagen_todos_colaboradores(results.rows[i].username,results.rows[i].image ,i, results.rows[i].data_image)
			    };       
						           			
			})
            .catch( function(err){
				iziToast.error({title: 'ERROR',message: err});
                playSound('../sound/message_received.mp3');

            })
	
})
