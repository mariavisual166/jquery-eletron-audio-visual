CREATE TABLE IF NOT EXISTS collaborator(
	id SERIAL,
	userName text NOT NULL,
	email text DEFAULT NULL,
	price DOUBLE PRECISION DEFAULT 0,
	image text DEFAULT NULL,
	data_image text,
	tipo text NOT NULL,
	anotacion text DEFAULT NULL,
	PRIMARY KEY (userName)
);
CREATE TABLE IF NOT EXISTS project(
	id SERIAL,
	orden int Default 1,
	tiempo_notificacion int Default 0,
	title text NOT NULL UNIQUE,
	description text,
	endDate DATE DEFAULT '2200-12-31',
	image text,
	anotacion text DEFAULT NULL,
	
	contentCreator text DEFAULT NULL,
	endDateContent DATE DEFAULT '2200-12-31',
	writer text DEFAULT NULL,
	endDateWriter DATE DEFAULT '2200-12-31',
	announcer text DEFAULT NULL,
	endDateAnnouncer DATE DEFAULT '2200-12-31',
	editor text DEFAULT NULL,
	endDateEditor DATE DEFAULT '2200-12-31',
	statusContentCreator VARCHAR(20) DEFAULT 'No asignado',
	statusWriter VARCHAR(20) DEFAULT 'No asignado',
	statusAnnouncer VARCHAR(20)DEFAULT 'No asignado',
	statusEditor VARCHAR(20) DEFAULT 'No asignado',
	statusProject VARCHAR(20) DEFAULT 'No asignado',
	
	PRIMARY KEY (id,title),
	FOREIGN KEY (contentCreator) REFERENCES collaborator(userName) ON UPDATE CASCADE,
	FOREIGN KEY (writer) REFERENCES collaborator(userName) ON UPDATE CASCADE,
	FOREIGN KEY (announcer) REFERENCES collaborator(userName) ON UPDATE CASCADE,
	FOREIGN KEY (editor) REFERENCES collaborator(userName) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS imagesProject(
	id SERIAL,
	idProject text NOT NULL,
	imageName text DEFAULT NULL,
	PRIMARY KEY (id, idProject),
	FOREIGN KEY (idProject) REFERENCES project(title) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS archivosProject(
	id SERIAL,
	idProject text NOT NULL,
	archivoName text DEFAULT NULL,
	PRIMARY KEY (id, idProject),
	FOREIGN KEY (idProject) REFERENCES project(title) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS assignedProject(
	id SERIAL,
	idProject text NOT NULL,
	currentlyDevelopment text DEFAULT NULL,
	stage text NOT NULL,
	PRIMARY KEY (id, idProject, currentlyDevelopment),
	FOREIGN KEY (idProject) REFERENCES project(title) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (currentlyDevelopment) REFERENCES collaborator(userName) ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS admint(
	admint text NOT NULL,
	password text NOT NULL,
	email text NOT NULL,
	image text ,
	PRIMARY KEY (admint)
);
CREATE TABLE IF NOT EXISTS logueado(usuario text);
CREATE TABLE IF NOT EXISTS colaboradorVisualizado(colaborador text);
CREATE TABLE IF NOT EXISTS proyectoVisualizado(proyecto text);
CREATE TABLE IF NOT EXISTS acceso(usuario text);
INSERT INTO admint(admint,password,email,image) VALUES('dani','12345678','daniselect86@gmail.com', 'data:image/jpeg;base64,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');
insert into collaborator(username,tipo) values('No asignar locutor','Locutor');
insert into collaborator(username,tipo) values('No asignar editor','Editor');
insert into collaborator(username,tipo) values('No asignar creador de contenido','Creador de contenido');
insert into collaborator(username,tipo) values('No asignar escritor','Escritor');
