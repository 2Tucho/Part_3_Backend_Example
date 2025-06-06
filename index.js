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

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => { // Usando el método findById de Mongoose
    response.json(note)
  })
})

//POST NEW PERSON http://localhost:3001/api/notes
app.post("/api/notes", (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: "content missing" })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    response.json(savedNote)
  })
})

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint) //Agreguemos el siguiente middleware después de nuestras rutas, que se usa para capturar solicitudes realizadas a rutas inexistentes. Para estas solicitudes, el middleware devolverá un mensaje de error en formato JSON.

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})