const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/product');


// ======================================================
// CLOUDINARY CONFIGURATION
// ======================================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ======================================================
// CLOUDINARY MULTER STORAGE
// ======================================================

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: 'bolani_watches',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({
    storage: storage
});


// ======================================================
// 1. POST: CREATE / UPLOAD PRODUCT
// ======================================================

router.post(
    '/admin/products',
    upload.fields([
        {
            name: 'mainImage',
            maxCount: 1
        },
        {
            name: 'subImages',
            maxCount: 5
        }
    ]),
    async (req, res) => {

        try {

            const imageUrls = [];


            // Main Image
            if (req.files && req.files.mainImage) {

                imageUrls.push(
                    req.files.mainImage[0].path
                );

            }


            // Sub Images
            if (req.files && req.files.subImages) {

                req.files.subImages.forEach(file => {

                    imageUrls.push(file.path);

                });

            }


            // Colors
            const colorsArray = req.body.colors
                ? req.body.colors
                    .split(',')
                    .map(c => c.trim())
                    .filter(Boolean)
                : [];


            // Create Product
            const newProduct = new Product({

                title: req.body.title,

                description: req.body.description,

                category: req.body.category,

                material: req.body.material,

                colors: colorsArray,

                price: Number(req.body.price),

                images: imageUrls

            });


            // Save Product
            await newProduct.save();


            res.status(201).json({

                success: true,

                product: newProduct

            });

        } catch (err) {

            console.error('CREATE PRODUCT ERROR:', err);

            res.status(500).json({

                success: false,

                error: err.message

            });

        }

    }
);


// ======================================================
// 2. GET: ALL PRODUCTS / CATEGORY PRODUCTS
// ======================================================

router.get('/products', async (req, res) => {

    try {

        // Agar category di gayi hai:
        // sirf us category ke products milenge.

        // Agar category nahi di:
        // saare products milenge.

        const filter = req.query.category
            ? {
                category: req.query.category
            }
            : {};


        const products = await Product
            .find(filter)
            .sort({
                createdAt: -1
            });


        res.status(200).json(products);

    } catch (err) {

        console.error('GET PRODUCTS ERROR:', err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});


// ======================================================
// 3. GET: SINGLE PRODUCT BY ID
// ======================================================

router.get('/products/:id', async (req, res) => {

    try {

        const productId = req.params.id;


        // MongoDB se single product find karo
        const product = await Product.findById(productId);


        // Product nahi mila
        if (!product) {

            return res.status(404).json({

                success: false,

                message: 'Product not found'

            });

        }


        // Product successfully mila
        res.status(200).json(product);


    } catch (err) {

        console.error('GET SINGLE PRODUCT ERROR:', err);


        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});


// ======================================================
// 4. PUT: UPDATE PRODUCT
// ======================================================

router.put('/admin/products/:id', async (req, res) => {

    try {

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!updatedProduct) {

            return res.status(404).json({

                success: false,

                message: 'Product not found'

            });

        }


        res.status(200).json({

            success: true,

            product: updatedProduct

        });


    } catch (err) {

        console.error('UPDATE PRODUCT ERROR:', err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});


// ======================================================
// 5. DELETE: PRODUCT
// ======================================================

router.delete('/admin/products/:id', async (req, res) => {

    try {

        const deletedProduct =
            await Product.findByIdAndDelete(
                req.params.id
            );


        if (!deletedProduct) {

            return res.status(404).json({

                success: false,

                message: 'Product not found'

            });

        }


        res.status(200).json({

            success: true,

            message: 'Product deleted successfully'

        });


    } catch (err) {

        console.error('DELETE PRODUCT ERROR:', err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;