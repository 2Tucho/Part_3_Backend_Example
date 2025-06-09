require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("./morgan")
const Note = require("./models/note")
const cors = require("cors")

app.use(cors())
app.use(express.static("dist"))
app.use(express.json())

app.use(morgan(":method :url :status - :res[content-length] :response-time ms :body"));

let notes = []

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//POST NEW NOTE http://localhost:3001/api/notes
app.post("/api/notes", (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
      .then((savedNote) => {
    response.json(savedNote)
  })
      .catch(error => next(error))
})

// Cambiar de importancia las notas
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id, { content, important },
    { new: true, runValidators: true, context: 'query' }) // Agregamos el parámetro opcional { new: true }, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original.
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint) //Agreguemos el siguiente middleware después de nuestras rutas, que se usa para capturar solicitudes realizadas a rutas inexistentes. Para estas solicitudes, el middleware devolverá un mensaje de error en formato JSON.

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}

// controlador de solicitudes que resulten en errores
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})