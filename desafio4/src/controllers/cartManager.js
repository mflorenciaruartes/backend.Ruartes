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
        !existsSync(this.path) && fs.writeFile(this.path, "[]", 'utf-8'); 
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
        if(carts.some(cart => cart.id === parseInt(idCart))) {
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(idCart))
            const objetoCarrito = new Cart(idCart, carts[cartIndex].products)
            const prodIndex = objetoCarrito.products.findIndex(obj => obj.product === parseInt(idProduct))
            if(prodIndex === -1) {
                objetoCarrito.products.push({product: idProduct, quantity: prodQty})
                carts[cartIndex] = objetoCarrito;
            } else {
                carts[cartIndex].products[prodIndex].quantity += prodQty;
            } 
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
