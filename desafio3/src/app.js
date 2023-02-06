import express from 'express'
import ProductManager from './productManager.js';

const app = express()
const PORT = 8080
const ruta = new ProductManager("./src/productos.json") ;


app.use(express.urlencoded({extended:true})) //Permite realizar consultas en la URL (req.query)
app.use(express.json()) //Permite manejar archivos JSON

app.get('/', (req,res) => {
    res.send("Aplicando servidor con Express")
})

//Consultar productos
app.get('/product', async (req, res) => {
    const arrayProducts = await ruta.getProducts();
    let {limit} = req.query;
    let listado;
    if(!limit){
        listado = arrayProducts;
    }else{
        listado = arrayProducts.slice(0, parseInt(limit));
        }
    res.send(JSON.stringify(listado))
})

//Consultar productos por ID
app.get('/product/:id', async (req,res) => {
    const product = await ruta.getProductById(parseInt(req.params.id));
    product === null ? res.send("El producto no existe") : res.send(`El producto con ID ${product.id} es el siguiente: ${(JSON.stringify(product))}`);
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})    
