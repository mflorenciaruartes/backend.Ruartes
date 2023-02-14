import express from 'express'
import routerProduct from './routes/productos.routes.js';
import routerCart from "./routes/cart.routes.js";
import { __dirname } from "./path.js";
import multer from 'multer';

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

//Middleware
app.use(express.urlencoded({extended:true})) //Permite realizar consultas en la URL (req.query)
app.use(express.json()) //Permite manejar archivos JSON


//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', routerProduct)
app.use('/api/carts', routerCart)
app.post('/upload',upload.single('product'), (req,res) => {
    console.log(req.file)
    res.send("Imagen subida")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})    
