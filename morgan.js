const morgan = require("morgan")

//.token para crear mensajes a discreción. "body" es el nombre con el que después lo voy a llamar.  req.body para recoger lo que haya en el body de la petición y mediante el método stringify convierto ese objeto en un string que se pueda mostrar en la consola
morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
})

module.exports = morgan;