import {existsSync, promises as fs} from 'fs';

class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}

export class CartManager {
    constructor(path) {
        this.path = path
    }

    checkJson = () => {
        !existsSync(this.path) && fs.writeFile(this.path, "[]", 'utf-8'); //Creamos archivo JSON.
    }

    addCart = async () => {
        this.checkJson()
        try {
            let carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let newId
            carts.length > 0 ? newId = carts[carts.length - 1].id + 1 : newId = 1;
            const nuevoCarrito = new Cart (newId, []);
            carts.push(nuevoCarrito);
            await fs.writeFile(this.path, JSON.stringify(carts))
            console.log(`Carrito con id: ${nuevoCarrito.id} creado`)
            return newId
        } catch {
            return "Error al crear el carrito."
        }
            
    }

    getCartById = async (idCart) => {
        this.checkJson()
        try {
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            let cartIndex = carts.findIndex(cart => cart.id === idCart);
            
            if (carts[cartIndex]) {
                return carts[cartIndex]
            } else {
                throw `Carrito no encontrado.`
            }
        } catch {
            return "Carrito no encontrado"
        }           
    }

    getCarts = async() => {
        const read = await fs.readFile(this.path, 'utf-8')
        const cartArray = JSON.parse(read)
        return cartArray
    }

    addProductToCart = async (idCart, idProduct, prodQty) => {
        this.checkJson()
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        //Chequeamos que el carrito existe con ese id.
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            //Obtenemos el índice del array de carritos
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            //Obtenemos el índice del prdoucto dentro del carrito
            const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex === -1) {
                //Si no existe pusheamos el producto al array de productos dentro del carrito
                objetoCarrito.products.push({product: idProduct, quantity: prodQty})
                //Actualizamos el carrito en el array de carritos
                carts[cartIndex] = objetoCarrito;
            } else {
                //Si existe aumentamos la cantidad en 1
                carts[cartIndex].products[prodIndex].quantity += prodQty;
            } 
            //Escribimos el Json del carrito con el producto nuevo
            await fs.writeFile(this.path, JSON.stringify(carts), 'utf-8')
            return "Producto agregado exitosamente"
        } else {
            return "Error al agregar el producto al carrito."
        }
    }

    deleteCart = async (id) => {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        if(carts.some(cart => cart.id === parseInt(id))) {
            const cartsFiltrados = carts.filter(cart => cart.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(cartsFiltrados))
            return "Carrito eliminado"
        } else {
            return "Carrito no encontrado"
        }
    }

}

// //Creamos el objeto que manejará nuestra carga de carritos
// const manager = new CartManager("../models/carts.json");

// //Comprobamos funcionamiento de metodos
// const test = async() => {
//     //Creamos archivo JSON.
//     await manager.checkJson(); 
//     // Cargamos los productos.
//     await manager.addCart();
//     await manager.addCart();
//     await manager.addCart();
//     await manager.addCart();
//     // Listamos nuevamente el array de carts para ver los cargados.
//     await manager.getCarts(); 
//     //Agregamos un nuevo producto
//     await manager.addProductToCart(1, 1, 2);
//     await manager.addProductToCart(2, 3, 4);
//     await manager.addProductToCart(3, 5, 2);
//     console.log(await manager.getCarts())
// }

// test()