const comun = require('../js/comun.js')
String.prototype.format = comun.formatString
const sound    = '../sound/message_received.mp3'

$('#guardarNuevoProyecto').on('click', function()
{
	const nombre      = $("#NombreNuevoProyecto").val()
	const fecha       = ($("#FechaNuevoProyecto").val())? $("#FechaNuevoProyecto").val() : "2200-12-31"
	const descripcion = $("#DescripcionNuevoProyecto").val()
	const fileImage   = $('#imagenNuevoProyecto')[0].files[0]

	$("#NombreNuevoProyecto").val('')
	$("#FechaNuevoProyecto").val('')
	$("#DescripcionNuevoProyecto").val('')

	if(!nombre)
	{
		comun.notificacion('error', 'Verificar', 'Ingrese el nombre del proyecto', sound)
	}
	else
	{
		if(fileImage)
		{
			comun.getBase64(fileImage).then(data =>
				{  
					guardarProyecto(nombre, descripcion, fecha, data)  
				})
		}
		else
		{
			guardarProyecto(nombre, descripcion, fecha, comun.defaultImage)
		}		
	}
})

function guardarProyecto(nombre, descripcion, fecha, image)
{
	const query = "INSERT INTO project (title, description, endDate, image) VALUES('{0}','{1}','{2}','{3}')"
	comun.sql(query.format(nombre, descripcion, fecha, image))
		.then(function()
		{
			comun.notificacion('success','OK', 'Proyecto guardado exitosamente', sound)
		})
		.catch(function()
		{
			comun.notificacion('error','Error', 'El proyecto no se ha podido guardar', sound)
		})
}

$('#imagenNuevoProyecto').on('change', function()
{
	$('.imagenNuevoProyectoMostrar').attr('src',$(this)[0].files[0].path)
})