import { cartsModel } from "../db/models/carts.model.js";

class CartsManager {
  async createCart() {
    const newCart = { products: [] };
    const response = await cartsModel.create(newCart);
    return response;
  }

  async findCartById(idCart) {
    const response = await cartsModel.findById(idCart).populate('products.product');
    return response;
  }

  async addProductToCart(idCart, idProduct) {
    const cart = await cartsModel.findById(idCart);
    const productIndex = cart.products.findIndex(
      (p) => p.product.equals(idProduct)
    );
    if (productIndex === -1) {
      cart.products.push({ product: idProduct, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }
    return cart.save();
  }

  async deleteProduct(idCart, idProduct) {
    try {
      const cart = await cartsModel.findById(idCart);
      if (!cart) {
        throw new Error('Cart not found');
      }
      const productId = mongoose.Types.ObjectId(idProduct);
      

      cart.products = cart.products.filter((product) => !product.product.equals(productId));

      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
  async updateCartProducts(idCart, productsArray) {
    try {
      const cart = await cartsModel.findById(idCart);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Asigna el arreglo de productos proporcionado al carrito
      cart.products = productsArray;

      // Guarda el carrito actualizado
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
  async updateProductQuantity(idCart, idProduct, newQuantity) {
    try {
      const cart = await cartsModel.findById(idCart);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === idProduct
      );

      if (productIndex === -1) {
        throw new Error('Product not found in the cart');
      }

      // Actualiza la cantidad de ejemplares del producto
      cart.products[productIndex].quantity = newQuantity;

      // Guarda el carrito actualizado
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
  async clearCart(idCart) {
    try {
      const cart = await cartsModel.findById(idCart);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Elimina todos los productos del carrito
      cart.products = [];

      // Guarda el carrito actualizado
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
}



export const cartsManager = new CartsManager();