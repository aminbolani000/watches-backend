require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ======================================================
// FRONTEND STATIC FILES
// ======================================================

app.use(express.static(path.join(__dirname, 'public')));


// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Atlas Connected Successfully!');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });


// ======================================================
// ROUTES
// ======================================================

const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/admin');

app.use('/api', productRoutes);
app.use('/api/admin', adminRoutes);


// ======================================================
// HOME / API CHECK
// ======================================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bolani Watches Backend API is running 🚀'
    });
});


// ======================================================
// LOCAL SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}


// ======================================================
// EXPORT APP FOR VERCEL
// ======================================================

module.exports = app;


//=====================


const path = require('path');

// Static files serve karne ke liye (HTML, CSS, JS, Images)
app.use(express.static(__dirname));

// Express Routes for HTML Pages
app.get('/men', (req, res) => {
    res.sendFile(path.join(__dirname, 'men.html'));
});

app.get('/women', (req, res) => {
    res.sendFile(path.join(__dirname, 'women.html'));
});

app.get('/kids', (req, res) => {
    res.sendFile(path.join(__dirname, 'kids.html'));
});

app.get('/couple', (req, res) => {
    res.sendFile(path.join(__dirname, 'couple.html'));
});

app.get('/product-detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'product-detail.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
