import { Router } from "express";
import { cartsManager } from "../dao/managers/cartsManager.js";

const router = Router();

router.get("/:idCart", async (req, res) => {

  const { idCart } = req.params;
  try {
    const cart = await cartsManager.findCartById(idCart);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.json({ cart });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:idCart/products/:idProduct", async (req, res) => {

  const { idCart, idProduct } = req.params;
  try {
    const cart = await cartsManager.addProductToCart(idCart, idProduct);
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await cartsManager.createCart();
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/carts/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  try {
    const updatedCart = await cartsManager.deleteProduct(idCart, idProduct);
    res.status(200).json({ message: "Product deleted", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/carts/:idCart", async (req, res) => {
  const { idCart } = req.params;
  const { products } = req.body;

  try {
    const updatedCart = await cartsManager.updateCartProducts(idCart, products);
    res.status(200).json({ message: "Cart updated", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/carts/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartsManager.updateProductQuantity(
      idCart,
      idProduct,
      quantity
    );
    res.status(200).json({ message: "Product quantity updated", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/carts/:idCart", async (req, res) => {
  const { idCart } = req.params;

  try {
    const updatedCart = await cartsManager.clearCart(idCart);
    res.status(200).json({ message: "All products removed from the cart", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





export default router;