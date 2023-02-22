import express from 'express'
import routerProduct from './routes/productos.routes.js';
import routerCart from "./routes/cart.routes.js";
import routerSocket from './routes/socket.routes.js';
import { __dirname } from "./path.js";
import multer from 'multer';
import { engine } from 'express-handlebars';
import * as path from 'path'
import { Server } from 'socket.io';

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req,file,cb) => {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({storage:storage});

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})  

//Middleware
app.use(express.urlencoded({extended:true})) //Permite realizar consultas en la URL (req.query)
app.use(express.json()) //Permite manejar archivos JSON
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); //__dirname + './views'

//ServerIO
const io = new Server(server)
const mensajes = []

io.on("connection", (socket) => {
    console.log("Cliente conectado")
    socket.on("mensaje", info => {
      console.log(info)
      mensajes.push(info)
      io.emit("mensajes", mensajes)
    })
})

/* clase 11
io.on("connection", (socket) => { //io.on es cuando se establece la conexion
  console.log("Cliente conectado")

  socket.on("mensaje", info => {//Cuando recibo informacion de mi cliente
    console.log(info)
  })  

  socket.emit("mensaje-gral", [])

  socket.broadcast.emit("mensaje-ppio", "Hola, desde mensaje socket propio") //Envio un mensaje a todos los clientes conectados a otros sockets menos al que esta conectado a este socket actualmente
})
 */

//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use('/api/carts', routerCart)
app.use('/', routerSocket)
app.post('/upload',upload.single('product'), (req,res) => {
    console.log(req.file)
    res.send("Imagen subida")
})

/* //HBS
app.get('/', (req,res) => {
    const user = {
      nombre: "Pablo",
      email: "p@p.com",
      rol: "Tutor"
    }
      const cursos = [
        {numero: 123, dia: "LyM", horario: "Noche"},
        {numero: 456, dia: "MyJ", horario: "Mañana"},
        {numero: 789, dia: "S", horario: "Mañana"}
      ]
  
      res.render("home", { //Renderizar el siguiente contenido
        titulo: "Ecommerce Backend",
        mensaje: "Pepe",
        usuario: user,
        isTutor: user.rol === "Tutor",
        cursos
      })

  }) */

  
