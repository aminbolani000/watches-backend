const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String, required: true },
    colors: [{ type: String }],
    price: { type: Number, required: true },
    images: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);