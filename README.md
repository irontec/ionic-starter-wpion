# ionic-stater-wpion

Esto es un starter creado por [Ionic Framework](http://ionicframework.com/).

### Cómo usar este template con la herramienta de Ionic:

Instalamos la base de Ionic y Cordova y luego instalamos el template, siendo `myApp` un nombre cualquiera para nuestra aplicación.

```bash
$ npm install -g ionic cordova
$ ionic start myApp https://github.com/irontec/ionic-stater-wpion
```
Luego, dentro de la carpeta `myApp`, ejecutar:

```bash
$ ionic platform add android
$ ionic build android
$ ionic emulate android
```
Sustituye android por ios si estás en un Mac.

Si queremos verlo en nuestro servidor, ejecutamos el siguiente comando:

```bash
$ ionic serve
```