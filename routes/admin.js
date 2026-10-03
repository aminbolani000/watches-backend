const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();


// ======================================================
// 1. ADMIN LOGIN API
// ======================================================

router.post('/login', (req, res) => {

    const { username, password } = req.body;

    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;

    if (username === envUser && password === envPass) {

        // Generate JWT Token valid for 24 hours
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({

            success: true,

            message: 'Access Granted',

            token: token

        });

    }

    return res.status(401).json({

        success: false,

        message: 'Invalid Username or Password'

    });

});


// ======================================================
// 2. ADMIN TOKEN VERIFICATION
// ======================================================

router.get('/verify', (req, res) => {

    const authHeader = req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];


    if (!token) {

        return res.status(401).json({

            valid: false

        });

    }


    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, user) => {

            if (err) {

                return res.status(403).json({

                    valid: false

                });

            }


            return res.status(200).json({

                valid: true,

                user: user

            });

        }
    );

});


module.exports = router;