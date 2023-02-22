import express from 'express'
import routerProduct from './routes/productos.routes.js';
import routerCart from "./routes/cart.routes.js";
import routerSocket from './routes/socket.routes.js';
import { __dirname } from "./path.js";
import multer from 'multer';
import { engine } from 'express-handlebars';
import * as path from 'path'
import { Server } from 'socket.io';
import { ProductManager } from "./controllers/productManager.js";

const productManager = new ProductManager('src/models/productos.json');

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
app.use(express.urlencoded({extended:true})) 
app.use(express.json()) 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); 

//ServerIO
const io = new Server(server)
io.on("connection", async (socket) => { 
  console.log("Cliente conectado")

  socket.on("addProduct", async info => {
      socket.emit("msgAddProduct", await productManager.addProduct(info))
      socket.emit("getProducts", await productManager.getProducts())
  })
  

  socket.on("deleteProduct", async id => {
      socket.emit("msgDeleteProduct", await productManager.deleteProduct(parseInt(id)))
      socket.emit("getProducts", await productManager.getProducts())
  })

  socket.emit("getProducts", await productManager.getProducts());
})

//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use('/api/carts', routerCart)
app.use('/', routerSocket)
app.use('/realtimeproducts', routerSocket)

app.post('/upload',upload.single('product'), (req,res) => {
    console.log(req.file)
    res.send("Imagen subida")
})

