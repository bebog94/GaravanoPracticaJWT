import { existsSync, promises } from "fs";
import { manager } from "./ProductManager.js";

class CartsManager {

    constructor(path) {
        this.path = path
    }


    async getCarts() {
        try {
            if (existsSync(this.path)) {
                const cartsFile = await promises.readFile(this.path, "utf8");
                const cartData = JSON.parse(cartsFile);
                return cartData
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }



    async createCart() {
        try {
            const carts = await this.getCarts()
            let id;
            if (!carts.length) {
                id = 1;
            } else {
                id = carts[carts.length - 1].id + 1;
            }
            const newCart = { id, products:[]};
            carts.push(newCart);
            await promises.writeFile(this.path, JSON.stringify(carts));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {

            const carts = await this.getCarts()
            const cart = carts.find(u => u.id === id)
            return cart;
        }
        catch (error) {
            return error
        }

    }

    async addProductToCart(idCart,idProduct){

        const cart= await this.getCartById(idCart)
        if(!cart){
            throw new Error('there is no cart with this id')
        }
        const product = await manager.getProductById(idProduct)
        if(!product){
            throw new Error('there is no product with this id')
        }
        
        const productIndex = cart.products.findIndex(p=>p.id ===idProduct)
        if (productIndex===-1){
            const newProduct= {product:idProduct,quantity:1}
            cart.products.push(newProduct)
        }else{
            cart.products[productIndex].quantity++;

        }
        await promises.writeFile(this.path, JSON.stringify(cart));
        
    }
}
export const cartsManager = new CartsManager('carts.json');