import { Router } from "express";
import { productsManager } from "../dao/managers/productsManager.js";
const router = Router();


// TRAER TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  try {
    const lean = false;
    const products = await productsManager.findAll(req.query,lean);
    res.status(200).json({ message: "Products", products });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TRAER EL PRODUCTO POR ID
router.get("/:idProduct", async (req, res) => {
    const {idProduct} = req.params
    try {
      const products = await productsManager.findById(idProduct);
      res.status(200).json({ message: "Product found", products });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// CREAR UN PRODUCTO
router.post("/", async (req, res) => {
  try {
    const createdProduct = await productsManager.createOne(req.body);
    res
      .status(200)
      .json({ message: "Product created", product: createdProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ACTUALIZAR UN PRODUCTO

router.put("/:idProducts", async (req, res) => {
    const { idProducts } = req.params;
    const productUpdate = req.body;
    try {
        const product = await productsManager.findById(idProducts);
        if (!product) {
            return res
                .status(404)
                .json({ message: "Product not found with the id provided" });
        }
        const updatedProduct = await productsManager.updateOne(idProducts, productUpdate);
        res.status(200).json({ message: 'Product updated', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}) 

// ELIMINAR UN PRODUCTO
router.delete("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    await productsManager.deleteOne(idProduct);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
