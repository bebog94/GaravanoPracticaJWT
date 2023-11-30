import { existsSync, promises } from "fs";

class ProductManager {

    constructor(path) {
        this.path = path
    }


    async getProducts(queryObj) {
        const { limit = null } = queryObj || {};
        try {
            if (existsSync(this.path)) {
                const productFile = await promises.readFile(this.path, "utf8");
                const productData = JSON.parse(productFile);
                return limit !== null ? productData.slice(0, +limit) : productData;
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(product) {
        try {
            const productList = await this.getProducts()

            /*  const isCodeRepeat = productList.some((p) => p.code === code);
             if (isCodeRepeat) {
                 throw new Error("Code already used");
             } */

            let id;
            if (!productList.length) {
                id = 1;
            } else {
                id = productList[productList.length - 1].id + 1;
            }
            const newProduct = { id, ...product, status: true };
            productList.push(newProduct);
            await promises.writeFile(this.path, JSON.stringify(productList));
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(idProduct) {
        try {

            const productList = await this.getProducts({})
            const product = productList.find(p => p.id === idProduct)
            return product
        }

        catch (error) {
            return error
        }

    }
   
        async deleteProduct(id) {
            try {
    
                let product = await this.getProducts()
                product = product.filter(p => p.id !== id)
                await promises.writeFile(this.path, JSON.stringify(product))
    
            } catch (error) {
                return error
            }
    
        }
     
        async updateProduct(id,productUpdate){
            try {
    
                let products = await this.getProducts()
                const productId = products.findIndex(p => p.id === +id)       
                products[productId] = { ...products[productId], ...productUpdate };
                await promises.writeFile(this.path, JSON.stringify(products));
                return products[productId];
                
                
            } catch (error) {
                return error;
            }
        }
     
}

export const manager = new ProductManager('productos.json');