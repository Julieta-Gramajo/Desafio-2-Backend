import fs from 'fs';

class ProductManager {
    constructor() {
        this.products = [];
        this.path = './products.json'
    }

    //Método para obtener todos los productos.
    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const cart = JSON.parse(data);
            return console.log(cart);
        }
        return console.log(this.products);
    }

    //Método para agregar un producto al array.
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //Validamos si el campo "code" se repite.
        const found = this.products.find(productos => productos.code === product.code)
        if(found) {
            console.error(`Error en agregar el producto debido a que el campo "CODE" se está encuentra repetido.`);
            return null;
        }

        
        //Validamos si el producto está completo.
        if(!Object.values(product).every(property => property)) {
            console.error(`Error en agregar el producto debido a que el producto está incompleto`);
            return null;
        }

        //Validamos si ya existen productos en el array
        if (this.products.length === 0) {
            product.id = 1;
        } // Si no existe, agregamos el primer ID que será 1.
        else {
            product.id = this.products[this.products.length-1].id+1;
        } // Si ya existe, sumamos uno al último ID ya encontrado.

        //Push para agregar el producto al array
        this.products.push(product);

        const _json = JSON.stringify(this.products, null, '\t');
        const data = await fs.promises.writeFile(this.path, _json);

        return data;
    }

    //Busca productos por su ID.
    getProductById = async (_id) => {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const cart = JSON.parse(data);
        const product = cart.find(p => p.id === _id);
        if (product) {
            return console.log(product);
        } 
        else {
            console.error("Not found");
            return null;
        }
    }

    updateProduct = async (_id, atribute, value) => {
        const item_index = this.products.findIndex(p => p.id === _id)

        if (item_index < 0) {
            console.info(`no product with the next id: ${_id}`)
            return null
        }

        const selectedItem = this.products[item_index];
        selectedItem[atribute] = value;
        this.products[item_index] = selectedItem;

        const cartJson = JSON.stringify(this.products, null, '\t')
        await fs.promises.writeFile(this.path, cartJson);
    }

    deleteProduct = async (_id) => {
        const res = this.products.filter(p => p.id !== _id);

        const cartJson = JSON.stringify(res, null, '\t')
        await fs.promises.writeFile(this.path, cartJson);

        this.products = res
        return;
    }
}

//Creamos un nuevo producto.
let producto = new ProductManager();
await producto.getProducts(); //Llamamos a getProducts para corroborar que devuelve un array vacío.

await producto.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25); //Agregamos un nuevo producto al array con id automático.
await producto.addProduct("producto prueba 2", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25); //Este producto arrojará un mensaje en consola y no se agregará al array debido a que valor CODE es igual al del anterior producto.
await producto.addProduct("producto prueba 3", "Este es un producto prueba", 200, "Sin imagen", "abc1234", 25); //Agregamos un nuevo producto al array con nuevo id automático.
await producto.getProducts(); //Llamamos a getProducts para corroborar los nuevos productos agregados al array.

await producto.addProduct("producto prueba", "Este es un producto prueba", 200, "", "abc12345", 25); //Agregamos un nuevo producto sin una propiedad (thumbnail) al array y corroboramos que, como no cumple con la condución, no se muestra el producto.

await producto.getProductById(3); //Buscamos un producto por su ID (no existente).
await producto.getProductById(2); //Buscamos un producto por su ID (existente).

await producto.updateProduct(1, 'title', 'producto prueba v2'); //Se actualiza una atributo (title) de un producto cuyo id sea (1).
await producto.getProducts(); //Llamamos a getProducts para corroborar los cambios en el producto con id (1).

await producto.deleteProduct(1); //Eliminamos el producto cuyo id sea (1);
await producto.getProducts(); //Llamamos a getProducts para corroborar los cambios en el producto con id (1).