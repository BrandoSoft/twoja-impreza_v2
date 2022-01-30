const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose')


const Profile = require('../../models/Profile')
const User = require('../../models/User')


// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'Nie ma profilu dla tego użytkownika' })
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.post('/', auth, async (req, res) => {

    const { imprezy, zainteresowania } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (imprezy) profileFields.imprezy = imprezy.split(',').map(e => e.trim());
    if (zainteresowania) profileFields.zainteresowania = zainteresowania.split(',').map(e => e.trim());

    try {
        let profile = await Profile.find({ user: req.user.id });

        if (profile.length > 0) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )
            return res.json(profile)
        }

        // Create profile

        profile = new Profile(profileFields);

        console.log(typeof [])

        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile
// @desc    get all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    get profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Nie znaleziono profilu' });

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Nie znaleziono profilu' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/profile
// @desc    delete profile, user and posts
// @access  Private

router.delete('/', auth, async (req, res) => {
    try {
        console.log(req.user.id)
        // // Remove profile
         await Profile.findOneAndRemove({user: req.user.id});
        // // Remove user
         await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User deleted'})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;