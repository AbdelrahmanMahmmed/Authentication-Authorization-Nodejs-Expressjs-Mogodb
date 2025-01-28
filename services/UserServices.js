const { json } = require('express');
const User = require('../models/UserModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// @desc   Find User
// @router Get   api/v1/User
// @access   Private
exports.getUsers = asyncHandler(async (req, res) => {
    const USER = await User.find({});
    res.status(200).json({ results: USER.length, data: USER });
});

// @desc   Get User By Id
// @router Get   api/v1/User/:id
// @access   Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const USER = await User.findById(id);
    if (!USER) { return next(new ApiError(`No User for this id :  ${id}`, 404)) };
    res.status(200).json({ data: USER });
})
// @desc   Update   Categorey By Id
// @router PUT      api/v1/Categories/:id
// @access          Private
exports.UpdateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, slug, email, phone, profileImg, role } = req.body;

    const USER = await User.findByIdAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name),
            email,
            phone,
            profileImg,
            role,

        },
        { new: true }
    );
    if (!USER) { return next(new ApiError(`No User for this id :  ${id}`, 404)) };
    res.status(200).json({ data: USER });
})
// @desc   Delete   Categorey By Id
// @router Delete   api/v1/Categories/:id
// @access          Private
exports.DeleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const USER = await User.findByIdAndDelete(id);
    if (!USER) { return next(new ApiError(`No User for this id :  ${id}`, 404)) };
    res.status(200).json({ data: USER });
})
// @desc     Create   User
// @router   Post     api/v1/User
// @access            Private
exports.createUser = asyncHandler(async (req, res) => {
    const { name, slug, email, phone, profileImg, password, role } = req.body;
    const USER = await User.create({
        name,
        slug: slugify(name),
        email,
        phone,
        profileImg,
        password,
        role,
    });
    res.status(201).json({ data: USER });
});
// @desc     Change Password
exports.ChangePassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    const USER = await User.findByIdAndUpdate(
        { _id: id },
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChanagedAt: Date.now()
        },
        { new: true }
    );
    if (!USER) { return next(new ApiError(`No User for this id :  ${id}`, 404)) };
    res.status(200).json({ data: USER });
})


// @desc   get User
// @router Get   api/v1/User/:id
// @access   Private/protect

exports.getMyAccount = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})


// @desc   Update password for current user
// @router PUT   api/v1/User/:id
// @access   Private/protect

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChanagedAt: Date.now()
        },
        { new: true }
    );

    const token = jwt.sign({ userId: USER }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    // save user login history
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7776000
    });
    res.status(200).json({
        message: 'Password has been updated successfully',
        token
    });
});

// @desc   Update All data for current user
// @router PUT   api/v1/User/:id
// @access   Private/protect
exports.updatealldataUser = asyncHandler(async (req, res, next) => {
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        { new: true }
    );
    res.status(200).json({
        message: 'Data updated successfully',
        data: USER,
    });
});


// @desc   UnActive for current user
// @router POST   api/v1/User/:id
// @access   Private/protect
exports.UnactiveUser = asyncHandler(async (req, res, next) => {
    const updatedData = {
        isActive : false,
    };
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        { new: true }
    );
    res.status(200).json({
        message: 'You unactive Now',
    });
});

// @desc   Active for current user
// @router POST   api/v1/User/:id
// @access   Private/protect
exports.activeMe = asyncHandler(async (req, res, next) => {
    const updatedData = {
        isActive : true,
    };
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        { new: true }
    );
    res.status(200).json({
        message: 'You Active Now',
    });
});