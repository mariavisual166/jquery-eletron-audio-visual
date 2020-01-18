const comun = require('./js/comun.js')
String.prototype.format = comun.formatString

var vacio = true
var opcion = ''
var droppable
var draggable

contentCreator = []
writer = []
announcer = []
editor = []

dicOrder = {'tipo5':5,'tipo4':4,'tipo3':3,'tipo2':2, 'tipo1':1}
dicQuery = {
	'tipo2':['contentCreator','endDateContent','statusContentCreator',''], 
    'tipo3':['writer','endDateWriter','statusWriter','statusContentCreator'],
    'tipo4':['announcer','endDateAnnouncer','statusAnnouncer','statusWriter'],
    'tipo5':['editor','endDateEditor','statusEditor','statusAnnouncer']
}
$( document ).ready(function()
{
	
	cargar("tipo1","statusProject", "No asignado","Ninguno")
	cargar("tipo2","statusContentCreator", "Asignado", "contentCreator")
	cargar("tipo3","statusWriter", "Asignado", "writer")
	cargar("tipo4","statusAnnouncer", "Asignado","announcer")
	cargar("tipo5","statusEditor", "Asignado","editor")
	
	comun.sql("SELECT userName FROM collaborator WHERE tipo = 'Creador de contenido'")
		.then(result =>
		{
			contentCreator = result.rows
		}).catch(function(){})
	comun.sql("SELECT userName FROM collaborator WHERE tipo = 'Escritor'")
		.then(result =>
		{
			writer = result.rows
		}).catch(function(){})
	comun.sql("SELECT userName FROM collaborator WHERE tipo = 'Locutor'")
		.then(result =>
		{
			announcer = result.rows
		}).catch(function(){})
	comun.sql("SELECT userName FROM collaborator WHERE tipo = 'Editor'")
		.then(result =>
		{
			editor = result.rows
		}).catch(function(){})
})

function cargar(tipo, status, valStatus, colaborador)
{

	if(colaborador == "Ninguno")
	{
		query = "SELECT id, title, image FROM project WHERE {0} = '{1}' and statusProject != 'Finalizado' ORDER BY orden ASC".format(status, valStatus)
	}
	else
	{
		query = "SELECT id, title, image, {2} FROM project WHERE {0} = '{1}' and statusProject != 'Finalizado' ORDER BY orden ASC".format(status, valStatus, colaborador)
	}
	
	path = require('path')
	comun.sql(query)
		.then(result =>
		{
			
			const html =  ("<div id='{3}' title='{1}'class='row Proyecto'>" +
          					"<div class='col s12 m12 l12'>" +
            					"<div class='card'>" +
              						"<div class='card-image'>" +
                						"<img src='{0}'>" +
                						"<p class='card-title'>{1}</p>" +
                						"<a class='btn-floating halfway-fab waves-effect teal darken-1'><i onclick='comun.proyectosRedirec(`{1}`,`View/VentanaProyecto.html`)' >+</i></a>" +
              						"</div>" +
              						"<div class='card-content'>" +
                						"<p id='col-{3}'>{2}</p>" +
              						"</div>" +
            					"</div>" +
          					"</div>" +
        				"</div>")

          	_id = "#{0}".format(tipo)     
			
			result.rows.forEach(function(proyecto)
			{
				
				$(_id).append(html.format(proyecto.image, 
										  proyecto.title,
										  (colaborador == "contentCreator")? proyecto.contentcreator : (colaborador == "writer")? proyecto.writer: (colaborador == "announcer")? proyecto.announcer: (colaborador == "editor")? proyecto.editor : "Ninguno",
										  proyecto.id))
				$('.Proyecto').draggable({
					revert: true,
					revertDuration: 0,
					stack: ".Proyecto",
					cursor: "crosshair",
					delay: 500,
					opacity: 0.35,
					start: function(event, ui)
					{
						$("#ModalColaborador").attr('style', "z-index: 2; display: none; opacity: 1; top: 30%; transform: scaleX(1) scaleY(1);")
						$("#Colaborador").empty()
						$("#fecha").val('')
					}
				});
				$('.Proyecto').droppable({
					accept: ".Proyecto",
					tolerance: "pointer",
					drop: function( event, ui ) {

						droppable = $(this);
						draggable = ui.draggable;
						opcion = ((event.pageY- $(this).offset().top) < ($(this).height())/2)? "arriba": "abajo"
						dropParentId = droppable['context'].parentElement.id
						dragParentId = draggable['context'].parentElement.id
						dragId = draggable['context'].id
						
						if (valido(dropParentId, dragParentId)){
							if(dropParentId == 'tipo1' || dropParentId == dragParentId)
							{
								borrarColaboradores(dropParentId, dragId,5)
								$("#" + draggable.children().children().children()['1'].children['0'].id).html("Ninguno")
								insertDragInDrop($(this)['context'].id)
								reordenar(dropParentId)
							}
							else
							{
								lanzarModal(dropParentId, false)
							}
						}
				}
				});
		})
		})
		.catch(err =>
		{
			console.log(err)
		})
}
function lanzarModal(tipo, _vacio)
{
	cargarModal(tipo)
	$('select').formSelect()
	$("#ModalColaborador").attr('style', "z-index: 1003; display: block; opacity: 1; top: 30%; transform: scaleX(1) scaleY(1);") 
	vacio = _vacio	
}
function insertDragInDrop(id)
{
	if(opcion == 'arriba')
	{
		$(draggable).insertBefore("#" + id)
	}
	else
	{
		$(draggable).insertAfter("#" + id)
	}
}
function valido(idDroppable, idDraggable)
{
	result = true

	switch (idDroppable)
	{
		case 'tipo1':
			break;
		case 'tipo2':
			switch (idDraggable)
			{
				case 'tipo1':
				case 'tipo2':
				case 'tipo3':
				case 'tipo4':
				case 'tipo5':
				break;
				default:
					result = false
			}
			break;
		case 'tipo3':
		switch (idDraggable)
			{
				case 'tipo1':
				case 'tipo2':
				case 'tipo3':
				case 'tipo4':
				case 'tipo5':
				break;
				default:
					result = false
			}
			break;
		case 'tipo4':
		switch (idDraggable)
			{
				case 'tipo3':
				case 'tipo4':
				case 'tipo5':
				break;
				default:
					result = false
			}
			break;
		case 'tipo5':
		switch (idDraggable)
			{
				case 'tipo4':
				case 'tipo5':
				break;
				default:
					result = false
			}
			break;
		default:
			result = false
	}
	return result	
}
$('.container1').droppable({
    accept: ".Proyecto",
    tolerance: "pointer",
    drop: function( event, ui ) {
    
    droppable = $(this)
    draggable = ui.draggable
    dropId = droppable['context'].id
    dragId = draggable['context'].id
    dragParentId = draggable['context'].parentElement.id

		if($(this).children().length == 1 && valido(dropId, dragParentId))
		{
			
			if(dropId == 'tipo1')
			{
				
					borrarColaboradores(dropId, dragId,5)
					$("#" + draggable.children().children().children()['1'].children['0'].id).html("Ninguno")
					droppable.append(draggable)
					reordenar(dropId)
			}
			else
			{
				lanzarModal(dropId, true)
			}	
		}
    } 
});
$("#guardar").on('click', function()
{		
	
    $("#ModalColaborador").attr('style', "z-index: 2; display: none; opacity: 1; top: 30%; transform: scaleX(1) scaleY(1);")
	var droppableId = undefined
	$("#" + draggable.children().children().children()['1'].children['0'].id).html($('#Colaborador').val())

	if (vacio)
	{
		droppableId = droppable['context'].id
		droppable.append(draggable)
	}
	else
	{
		droppableId = droppable['context'].parentElement.id
		insertDragInDrop(droppable['context'].id)
	}
	borrarColaboradores(droppableId, draggable['context'].id,5)
	asignarColaborador(droppableId, draggable['context'].id,
		$('#Colaborador').val(), ($('#fecha').val())? $('#fecha').val(): '2200-12-31')
	reordenar(droppableId)
	$("#Colaborador").empty()
	$("#fecha").val('')
})
$("#cancelar").on('click', function()
{
    $("#ModalColaborador").attr('style', "z-index: 2; display: none; opacity: 1; top: 30%; transform: scaleX(1) scaleY(1);")
	$("#Colaborador").empty()
	$("#fecha").val('')
})
function cargarModal(tipo)
{
	listColaboradores = (tipo == 'tipo2')? contentCreator: (tipo == 'tipo3')? writer: (tipo == 'tipo4')? announcer: editor
	$("Colaborador").empty()
	$('#fecha').val('')
	listColaboradores.forEach(function(element, index, array)
	{
		$("#Colaborador").append("<option>{0}</option>".format(element.username))
	})
}
function borrarColaboradores(contDestino, proyectoId, ini)
{
	
	query = "SELECT title, contentCreator, writer, announcer, editor FROM project WHERE id = '{0}'".format(proyectoId)
	comun.sql(query)
		.then(result =>
		{
			
			queryColab = "DELETE FROM assignedProject WHERE" +
						 " (idProject = '{0}' AND currentlyDevelopment = '{1}') OR ".format(result.rows[0].title, result.rows[0].contentCreator) +
						 " (idProject = '{0}' AND currentlyDevelopment = '{1}') OR ".format(result.rows[0].title, result.rows[0].writer) +
						 " (idProject = '{0}' AND currentlyDevelopment = '{1}') OR ".format(result.rows[0].title, result.rows[0].announcer) +
						 " (idProject = '{0}' AND currentlyDevelopment = '{1}')".format(result.rows[0].title, result.rows[0].editor)
			switch(contDestino)
			{
				case 'tipo1':
					var queryProyecto = "UPDATE project SET contentCreator = NULL, endDateContent = '2200-12-31'," +
						"writer = NULL,	endDateWriter = '2200-12-31', announcer = NULL, endDateAnnouncer = '2200-12-31'," +
						"editor = NULL, endDateEditor = '2200-12-31', statusContentCreator = 'No asignado', statusWriter = 'No asignado', " +
						"statusAnnouncer = 'No asignado', statusEditor = 'No asignado', statusProject = 'No asignado' WHERE id = '{0}'"
				break
				case 'tipo2':
					var queryProyecto = "UPDATE project SET " +
						"writer = NULL,	endDateWriter = '2200-12-31', announcer = NULL, endDateAnnouncer = '2200-12-31'," +
						"editor = NULL, endDateEditor = '2200-12-31', statusWriter = 'No asignado', " +
						"statusAnnouncer = 'No asignado', statusEditor = 'No asignado', statusProject = 'Asignado' WHERE id = '{0}'"
				break
				case 'tipo3':
					var queryProyecto = "UPDATE project SET " +
						"announcer = NULL, endDateAnnouncer = '2200-12-31'," +
						"editor = NULL, endDateEditor = '2200-12-31'," +
						"statusAnnouncer = 'No asignado', statusEditor = 'No asignado', statusProject = 'Asignado' WHERE id = '{0}'"
				break
				case 'tipo4':
					var queryProyecto = "UPDATE project SET " +
						"editor = NULL, endDateEditor = '2200-12-31'," +
						"statusEditor = 'No asignado', statusProject = 'Asignado' WHERE id = '{0}'"
				break
				case 'tipo5':
					var queryProyecto = "UPDATE project SET statusProject = 'Asignado' WHERE id = '{0}'"
				break
			}
			comun.sql(queryColab).catch(err =>{ notificacion = new Notification('1---'+err) })
			comun.sql(queryProyecto.format(proyectoId)).catch(err =>{ notificacion = new Notification('2---'+err) })
		})
		.catch(err =>
		{
			notificacion = new Notification('3---'+err)
		})
	
}
function asignarColaborador(contDestino, proyectoId, nombreColaborador, fecha)
{
	datos = dicQuery[contDestino]	
	query = "UPDATE project SET {0} = '{3}', {1} = '{4}', {2} = 'Asignado', statusproject = 'Asignado'{6}WHERE id = '{5}'"
					.format(datos[0],datos[1],datos[2],nombreColaborador,fecha,proyectoId,(contDestino == 'tipo2')? " ": ", {0} = 'Finalizado' ".format(datos[3]))
	
	comun.sql(query)
		.then(function()
		{	
			query = "INSERT INTO assignedProject(idProject,currentlyDevelopment, stage) VALUES('{0}','{1}','Asignado')"
				.format($("#{0}".format(proyectoId))[0].title, nombreColaborador)
			comun.sql(query)
				.then(result =>{	
				})
				.catch(err => { 
					notificacion = new Notification(err)})
		})
		.catch(err => { 
			notificacion = new Notification(err)})
}
function reordenar(tipo)
{
	Children = $("#{0}".format(tipo)).children()
	length = Children.length - 1
	
	for(index = 1; index <= length; index++)
	{
		comun.sql("UPDATE project SET orden = '{0}' WHERE id = '{1}'".format(index, Children[index].id))
		.catch(err => { 
			notificacion = new Notification(err)
		})
	}	
}
