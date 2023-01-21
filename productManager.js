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

const licuadora = new Productos ("Licuadora Atma", "procesar de alimentos", 1500, "https://www.fravega.com/", 2502, 20)
const batidora = new Productos ("Batidora Oster", "procesar de alimentos", 2000, "https://www.fravega.com/", 2503, 25)
const cafetera = new Productos ("Cafetera Philips", "Preparar infusión", 3250, "https://www.fravega.com/", 2503, 19)

class ProductManager{
    constructor(){
        this.products = [];
    }
    addProduct(newProduct) {
        const prodCode = this.products.map((product) => product.code);
        const codeExist = prodCode.includes(newProduct.code);
        if (codeExist) {
          console.log("El codigo de producto ya existe");
        } else if (Object.values(newProduct).includes(undefined)) {
          console.log(
            "No se pudo agregar el producto ya que no se completaron todos los campos obligatorios"
          );
        } else {
          let id;
          this.products.length === 0 ? (id = 1) : (id = this.products.length + 1);
          const newObject = { ...newProduct, id };
          this.products.push(newObject);
        }
      }

    getProducts(){
        return console.log(this.products) 
    }
    getPorductById(id) {
        const productFind = this.products.find((product) => id === product.id);
        if (productFind) {
          return console.log(productFind);
        } else {
          console.log("Not Found");
        }
      }
}

const cargaUno = new ProductManager()

cargaUno.getProducts()

cargaUno.addProduct(licuadora)
cargaUno.addProduct(batidora)

cargaUno.getProducts()

cargaUno.addProduct(cafetera)

cargaUno.getPorductById(2)

cargaUno.getPorductById(4)
