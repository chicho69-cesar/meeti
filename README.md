# Meeti

Aplicación clon de Meetup, donde los usuarios pueden crear grupos enfocados a algún tema en especifico y en base a esos grupos puede crear meetis, las cuales pueden ser atendidas por un cierto numero de usuarios, pueden agregar comentarios a ellos, etc.

## Ejecutar el proyecto

Para ejecutar el proyecto lo primero que se debe de hacer es instalar las dependencias:

```bash
pnpm install
```

Creamos la base de datos, utilizando `PostgreSQL`

Configuramos las variables de entorno, copiando el archivo `.env.template` al archivo `.env` y configuramos, el puerto en el que queremos que se ejecute el servidor, la información de la base de datos (usuario, password, base de datos, puerto), configuramos nuestro servicio para envió de emails, en este caso para desarrollo se puede usar _Mailtrap_ y para producción se puede usar _GMail_ por ejemplo. Configuramos las keys personales para la autenticación y los JSON Web Tokens.

Instalamos nodemon como dependencia del proyecto o instalación global:

```bash
npm i -g nodemon
pnpm install nodemon -D
```

Ejecutamos la aplicación con los comandos:

```bash
pnpm run dev # -> nodemon
pnpm run start # -> node
```

## Pendiente

- [ ] Hacer apartado para agregar categorías
- [ ] Hacer apartado para perfil publico de usuario
