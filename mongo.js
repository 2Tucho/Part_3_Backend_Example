const mongoose = require("mongoose")

if (process.argv.length<3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2] // Cuando el código se ejecuta con el comando node mongo.js yourPassword, Mongo agregará un nuevo documento a la base de datos.

const url =
  `mongodb+srv://2tucho:${password}@cluster0.nuqctwi.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery",false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

// const note = new Note({
//   content: "GET and POST are the most important methods of HTTP protocol",
//   important: true,
// })

// note.save().then(result => {
//   console.log("note saved!")
//   mongoose.connection.close()
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})