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