import {promises as fs} from 'fs';

const ruta = "../models/productos.json";

//Creamos la clase para crear los productos
class Productos{
    constructor(title, description, price, thumbnail, code, stock, category, status){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.category = category
        this.status = status
    }

}

//Creamos los productos
const licuadora = new Productos ("Licuadora Atma", "procesar de alimentos", 1500, ["public/img/licuadoraLiliana.jpg"], 2502, 20, "Electro", true)
const batidora = new Productos ("Batidora Oster", "procesar de alimentos", 2000, ["public/img/batidora.jpg"], 2503, 25, "Electro", true)
const cafetera = new Productos ("Cafetera Philips", "Preparar infusión", 3250, ["public/img/cafetera.jpg"], 2513, 19, "Electro", true)
const tostadora = new Productos ("Tostadora Oster", "Calentar pan", 1150, ["public/img/tostadora.jpg"], 2504, 23, "Electro", true)
const minipimer = new Productos ("Minipimer Liliana", "procesar alimentos", 1350, ["public/img/procesadora.jpg"], 2505, 10, "Electro", true)
const sandwichera = new Productos ("Minipimer Liliana", "procesar alimentos", 1350, ["public/img/tostadora2.jpg"], 2506, 15, "Electro", true)

//producto por ID, modificar o eliminar un producto.
export class ProductManager{
    constructor(path){
        this.path = path;
    }
    addProduct = async (newProduct) => {
        const prodArray = JSON.parse(await fs.readFile(this.path, 'utf-8'));
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
          const newObject = {id, ...newProduct };
          prodArray.push(newObject);
          await fs.writeFile(this.path, JSON.stringify(prodArray), 'utf-8')
        }
    }

    getProducts = async() => {
        const read = await fs.readFile(this.path, 'utf-8')
        const prodArray = JSON.parse(read)
        return prodArray
    }
    getProductById = async (id) => {
        const prodArray = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const productFind = prodArray.find((product) => product.id === parseInt(id));
        if (productFind) {
          console.log(productFind);
          return productFind;
        } else {
          return console.log("Not Found");
       }
    }

    updateProduct = async (id, {title, description, price, thumbnail, code, stock, category, status}) => {
      const prodArray = JSON.parse(await fs.readFile(this.path, "utf-8"));
      const index = prodArray.findIndex((product) => product.id === parseInt(id));
      if(!prodArray[index]){
          console.log("Producto no encontrado.")
      } else {
          prodArray[index].title = title;
          prodArray[index].description = description;
          prodArray[index].price = price;
          prodArray[index].thumbnail = thumbnail;
          prodArray[index].code = code;
          prodArray[index].stock = stock;
          prodArray[index].category = category;
          prodArray[index].status = status;
          await fs.writeFile(this.path, JSON.stringify(prodArray));
          console.log("El producto se ha modificado de la siguiente manera:")
          console.log(prodArray[index]);
       }
   }

    deleteProduct = async (id) => {
        const prodArray = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const productoEliminado = JSON.stringify(prodArray.find((product) => product.id === parseInt(id)));
        const newArray = prodArray.filter((product) => product.id !== parseInt(id));
        await fs.writeFile(this.path, JSON.stringify(newArray), "utf-8");
        console.log(`Producto Eliminado:`);
        console.log(JSON.parse(productoEliminado))
    }

    async createJson() {
      await fs.writeFile(this.path, "[]");
    }

    async createProducts() {
      await this.addProduct(licuadora);
      await this.addProduct(batidora);
      await this.addProduct(tostadora);
      await this.addProduct(minipimer);
      await this.addProduct(cafetera);
      await this.addProduct(sandwichera);
      }

}


