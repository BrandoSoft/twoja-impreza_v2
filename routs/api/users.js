const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User')

// @route   POST api/users
// @desc    Register user
// @access  Public

router.post('/', [
    check('name', 'Nazwa użytkownika jest wymagana').not().isEmpty(),
    check('email', 'Adres email jest wymagany').isEmail(),
    check('password', 'Hasło musi zawierać minimum 3 znaki').isLength({ min: 3 }),

], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User alredy exists' }] })
        }

        // Get users gravatar

        const avatar = gravatar.url(email, {
            s: 200,
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name, email, avatar, password
        })
        // Encrypt password

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save();

        // Return jsonwebtoken

        const payload = {
            user: {
                id: user.id,
                role: 'admin'
            }
        }
        jwt.sign(payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error23')
    }
});


module.exports = router;