var exports = module.exports = {};
iziToast = require('./iziToast.min')
function formatString()
{
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(a, num){
    return args[num] || a
  })
}
exports.formatString = formatString
String.prototype.format = formatString

exports.sql2 =  function( sqlCommand2, value ){
	
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
function sql( sqlCommand )
{
	const config = {database: 'audio', password: '0000', user:'postgres'}
	
	return new Promise( (resolve, reject) => {
	const { Client } = require('pg')
	let pgCliente = new Client(config)
	 
    pgCliente.connect((err) => {
		if (err) return reject(err)
		pgCliente.query(sqlCommand, (err, result) => {
			pgCliente.end()
			if (err) return reject(err)
            return resolve(result)
       })
     
	})
   })
}
exports.sql = sql

function copyFile(source, target)
{
   
	fs = require('fs')
	var result
	
	result = true
	
	var rd = fs.createReadStream(source);
	rd.on("error", function(err) {
		result = false;
	});
	var wr = fs.createWriteStream(target);
	wr.on("error", function(err) {
		result = false;
	});
	
	try
	{
	    rd.pipe(wr) ;
	}
	catch(err)
	{
		result = false;
	}
	
	return result
}
exports.copyFile = copyFile

function rimraf(dir_path)
{
    var fs = require('fs')
    var path = require('path')
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry)
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path)
            } else {
                fs.unlinkSync(entry_path)
            }
        })
        fs.rmdirSync(dir_path)
    }
}
exports.rimraf = rimraf

function proyectosCarga(sql_)
{
	path = require('path')
	columna = 0
	request = sql_
	sql( request )
		.then(result =>
		{
			
			const htmlProyecto =  ("<div id='{2}' title='{1}'class='row Proyecto'>" +
          					"<div class='col s12 m12 l12'>" +
            					"<div class='card'>" +
              						"<div class='card-image'>" +
                						"<img src='{0}'>" +
                						"<p class='card-title'>{1}</p>" +
                						"<a class='btn-floating halfway-fab waves-effect teal darken-1'><i onclick='comun.proyectosRedirec(`{1}`,`VentanaProyecto.html`)' >+</i></a>" +
              						"</div>" +
              						"<div class='card-content'>" +
                						"<p>Finalizado</p>" +
              						"</div>" +
            					"</div>" +
          					"</div>" +
        				"</div>")
			result.rows.forEach(function(proyecto)
			{
				
			    html = htmlProyecto.format(proyecto.image,proyecto.title,proyecto.id)
				$("#tipo" + ((columna % 5) + 1)).append(html)
				columna++
			
			})
		})
		.catch(err =>
		{
			debugger
			notificacion('error', 'Error', err, '../sound/message_received.mp3')
		})
}
exports.proyectosCarga = proyectosCarga

function proyectosRedirec(nombre, dir)
{	
	proyectoNombre = nombre
	comun.sql("DELETE FROM proyectoVisualizado")
		.then(function()
		{
			comun.sql("INSERT INTO proyectoVisualizado(proyecto) VALUES('{0}')".format(proyectoNombre))
				.then(function()
				{
					$( location ).attr("href",dir)
				})
				.catch(function()
				{
					
					alert("No se puede visualizar el proyecto")
					
					
				})
		})
		.catch(err =>
		{
			
			alert("No se puede visualizar el proyecto "+err)
						
		})
}
exports.proyectosRedirec = proyectosRedirec

function fechaValida(fecha)
{
	dicMeses = {"Ene":"01","Feb":"02","Mar":"03","Abr":"04","May":"05","Jun":"06",
				"Jul":"07","Ago":"08","Sep":"09","Oct":"10","Nov":"11","Dic":"12"}
	date = fecha.split(" ")
	return "{0}-{1}-{2}".format(date[3], dicMeses[date[1]], date[2])
}

function getBase64(file) {
	return new Promise((resolve, reject) => {
   		const reader = new FileReader();
   		reader.readAsDataURL(file);
   		reader.onload = () => resolve(reader.result);
   		reader.onerror = error => reject(error);
	});
}
exports.getBase64 = getBase64
exports.defaultImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCADpAV8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9IKKKK/TD+ewooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAO//AGcfB2n+M/HrxalALmG2tjcLGxO1mDKBuHcc9Oh717/N8LvDU8LIfD+jAOCpK2cann0IGR9RXif7JP8AyUS8/wCvB/8A0NK+iq+QzutUWIsm7WP1Hg/DUZ4FynBN8z6LyPkD4naFb+GfH+q2ForJbW1wVjUtu2jrjJ571hV1Pxt/5Kvrn/Xyf5CuWr6fCycqEJPey/I/PMyhGGMqwirJSl+bCiiiug4QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA9S/ZJ/5KJef9eD/APoaV9FV86/sk/8AJRLz/rwf/wBDSvoqvjM9/wB6+SP1jgz/AJF//bz/AEPkz42/8lX1z/r5P8hXLV1Pxt/5Kvrn/Xyf5CuWr6rB/wC7w9F+R+b5r/v1b/HL82FFFFdJ54UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAGt4G8Lt408XWGlq/l/bJQjPjOxerH8ga9z/4ZH8N/wDP7rf/AH+i/wDjdeM/CXxPD4P+Iml6hctst4ZSsrYztVlKk49s5/Cvp3/hZnhv/oYNE/8AA6L/AOKr57Oa+JpziqN7W6dz7jhTB5fWo1HiknJPq+lv87nEf8Mj+G/+f3W/+/0X/wAbo/4ZH8N/8/ut/wDf6L/43Xb/APCzPDf/AEMGif8AgdF/8VR/wszw3/0MGif+B0X/AMVXj/XMd3kfV/2Vk38sPv8A+CY/w7+Bmk/DPWpL6wuNRlllhMJFxIjLgkHsgOeB3rtKztI8YaTr9yYbDVNOvZVXeUt7lJGA6ZwCTjkfnWjXFXqVZy5qu/metgqGHo0+TCpKPkeeeKf2atC8XeIbrUrm71ZJ7x/MdYpYwgPsChP61n/8Mj+G/wDn91v/AL/Rf/G67y+8faFpl28FzrWk288R2vHLeRo6H0IJyKi/4WZ4b/6GDRP/AAOi/wDiq64YrGqKUW7Hm1ctymU3KpGPM3rr169TiP8Ahkfw3/z+63/3+i/+N1DqX7I2iHT5vsl/qq3Ow+UZZI2QN23AIDj8a73/AIWZ4b/6GDRP/A6L/wCKqHUvi14a03T5rg65pUohQvsiu45HfHZVByTVfXMd0cvuMnlWTW1jD7/+CfI80TW8zIwwyEqR6EU2pL25+2XksuMea5fHpk5qOvuFe2p+PzspNR2CiiimSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB6l+yT/yUS8/68H/9DSvoqvnX9kn/AJKJef8AXg//AKGlfRVfGZ7/AL18kfrHBn/Iv/7ef6HyZ8bf+Sr65/18n+Qrlq6n42/8lX1z/r5P8hXLV9Vg/wDd4ei/I/N81/36t/jl+bCiiiuk88KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPUv2Sf+SiXn/Xg/8A6GlfRVfNv7LGrW2l/EaUXM8UH2i0aGLzGC+Y5dMKM9zjgV9ISyrDGzuwREBZmY4CgdzXxuep/Wb+SP1fguS+oNf3n+h8nfG3/kq+uf8AXyf5CuWro/i7qMGrfEvWbi2ljngkuSUkjbcrjgZB7j3rnK+pwiaoQT7L8j83zRp42s1tzS/NhRRRXScAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/2Q=="
function notificacion(type,title, message, sound)
{
	switch(type)
	{
		case 'success':
			iziToast.success({title: title,message: message,});
			playSound(sound)
			break;
		case 'error':
			iziToast.error({title: title,message: message,});
			playSound(sound)
			break;
		default:

	}
}
exports.notificacion = notificacion
function playSound(soundFile) {
    if (soundFile === undefined) return;
    var audio = document.createElement('audio');
    audio.src = soundFile;
    audio.play();
    audio = undefined;
}
exports.playSound = playSound
