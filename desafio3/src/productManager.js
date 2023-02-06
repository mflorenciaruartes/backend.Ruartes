import {promises as fs} from 'fs';
const ruta = "./productos.json";

//Creamos la clase para crear los productos
class Productos{
    constructor(title, description, price, thumbnail, code, stock){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}

//Creamos los productos
const licuadora = new Productos ("Licuadora Atma", "procesar de alimentos", 1500, "https://www.fravega.com/", 2502, 20)
const batidora = new Productos ("Batidora Oster", "procesar de alimentos", 2000, "https://www.fravega.com/", 2503, 25)
const cafetera = new Productos ("Cafetera Philips", "Preparar infusión", 3250, "https://www.fravega.com/", 2503, 19)
const tostadora = new Productos ("Tostadora Oster", "Calentar pan", 1150, "https://www.fravega.com/", 2504, 23)
const minipimer = new Productos ("Minipimer Liliana", "procesar alimentos", 1350, "https://www.fravega.com/", 2505, 10)
const sandwichera = new Productos ("Minipimer Liliana", "procesar alimentos", 1350, "https://www.fravega.com/", 2506, 15)
const juguera = new Productos ("Juguera Philips", "Procesar alimentos", 1850, "https://www.fravega.com/", 2507, 40)
const multiprocesador = new Productos ("multiprocesador Liliana", "procesar alimentos", 1490, "https://www.fravega.com/", 2508, 50)
const pava = new Productos ("Pava Moulinex", "Calentar alimentos", 1150, "https://www.fravega.com/", 2509, 40)
const batidoraL = new Productos ("batidoraL Liliana", "Procesar alimentos", 1780, "https://www.fravega.com/", 2510, 30)

//Creamos la clase ProductManager para manejar los productos disponibles (agregar productos, ver productos disponibles, obtener un 
//producto por ID, modificar o eliminar un producto.
class ProductManager{
    constructor(path){
        this.path = path;
    }
    addProduct = async (newProduct) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const prodArray = JSON.parse(read);
        const prodCode = prodArray.map((product) => product.code);
        const codeExist = prodCode.includes(newProduct.code);
        if (codeExist) {
          console.log("El codigo de producto ya existe");
        } else if (Object.values(newProduct).includes(undefined)) {
          console.log(
            "No se pudo agregar el producto ya que no se completaron todos los campos obligatorios"
          );
        } else {
          let id;
          prodArray.length === 0 ? (id = 1) : (id = prodArray.length + 1);
          const newObject = { ...newProduct, id };
          prodArray.push(newObject);
          await fs.writeFile(this.path, JSON.stringify(prodArray), 'utf-8')
        }
    }

    getProducts = async() => {
        const read = await fs.readFile(this.path, 'utf-8')
        const prodArray = JSON.parse(read)
        console.log(prodArray) 
    }
    getPorductById = async(id) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const prodArray = JSON.parse(read);
        const productFind = prodArray.find((product) => id === product.id);
        if (productFind) {
          console.log(productFind);
        } else {
          console.log("Not Found");
       }
    }

    updateProduct = async (id, key, newValue) => {
       const read = await fs.readFile(this.path, "utf-8");
       const prodArray = JSON.parse(read);
       const index = prodArray.findIndex((product) => product.id === id);
       if(!prodArray[index]){
           console.log("Producto no encontrado.")
       } else {
           prodArray[index][key] = newValue;
           await fs.writeFile(this.path, JSON.stringify(prodArray));
           console.log("El producto se ha modificado de la siguiente manera:")
           console.log(prodArray[index]);
        }
    }

    deleteProduct = async (id) => {
        const read = await fs.readFile(this.path, "utf-8");
        const prodArray = JSON.parse(read);
        const productoEliminado = JSON.stringify(prodArray.find((product) => product.id === id));
        const newArray = prodArray.filter((product) => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(newArray), "utf-8");
        console.log(`Producto Eliminado:`);
        console.log(JSON.parse(productoEliminado))
    }

}

//Creamos el objeto que manejará nuestra carga de productos
const cargaUno = new ProductManager(ruta);

// //Comprobamos funcionamiento de metodos
// const test = async() => {
//     //Creamos archivo TXT.
//     await fs.writeFile(ruta, "[]");
//     // Mostramos array de productos vacío.
//     await cargaUno.getProducts(); 
//     // Cargamos los productos.
//     await cargaUno.addProduct(licuadora);
//     await cargaUno.addProduct(batidora);
//     await cargaUno.addProduct(tostadora);
//     await cargaUno.addProduct(minipimer);
//     // Listamos nuevamente el array de productos para ver los cargados.
//     await cargaUno.getProducts(); 
//     //Agregamos un nuevo producto
//     await cargaUno.addProduct(cafetera);
//     await cargaUno.addProduct(sandwichera);
//     await cargaUno.addProduct(juguera);
//     await cargaUno.addProduct(multiprocesador);
//     await cargaUno.addProduct(pava);
//     await cargaUno.addProduct(batidoraL);
//     // Buscamos dos productos por ID, uno existe el otro no.
//     await cargaUno.getPorductById(2);
//     await cargaUno.getPorductById(12);
//     // Actualizamos una propiedad de un producto e intentamos modificar uno que no existe.
//     await cargaUno.updateProduct(3, "price", 1200 );
//     await cargaUno.updateProduct(6, "price", 1200 );
//     // Listamos nuevamente los productos.
//     await cargaUno.getProducts();
//     // Eliminamos un producto.
//     await cargaUno.deleteProduct(4);
//     // Listamos nuevamente los productos.
//     await cargaUno.getProducts();

// }

// test('./productos.txt')

export default ProductManager;
