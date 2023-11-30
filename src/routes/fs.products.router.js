import { Router } from "express";
import { manager } from "../ProductManager.js"
const router = Router();


router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts(req.query)
    
        res.status(200).json({ message: 'Products Found ', products })
    
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
})
router.get('/:idProducts', async (req, res) => {
    const { idProducts } = req.params;
    try {
        const product = await manager.getProductById(+idProducts);
        if (!product) {
            return res
                .status(404)
                .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product found", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})

 router.post('/', async(req,res)=>{

    const { title, description, code, price, stock, category} = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({error: 'Some data is missing'})
       }
    try {
        const newProduct = await manager.addProduct(req.body);
        res.status(200).json({message: "Product created", product: newProduct})
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }


}) 

router.delete("/:idProducts", async(req,res)=>{
    const { idProducts } = req.params;
    try {
        const product = await manager.getProductById(+idProducts);
        if (!product) {
            return res
                .status(404)
                .json({ message: "Product not found with the id provided" });
        }
        await manager.deleteProduct(+idProducts)
        res.status(200).json({ message: "Product Deleted"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})
    router.put("/:idProducts", async (req, res) => {
        const { idProducts } = req.params;
        const productUpdate = req.body;
        try {
            const product = await manager.getProductById(+idProducts);
            if (!product) {
                return res
                    .status(404)
                    .json({ message: "Product not found with the id provided" });
            }
            const updatedProduct = await manager.updateProduct(+idProducts, productUpdate);
            res.status(200).json({ message: 'Product updated', product: updatedProduct });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }) 
export default router;