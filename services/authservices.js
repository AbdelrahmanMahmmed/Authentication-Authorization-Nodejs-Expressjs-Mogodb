const { json } = require('express');
const User = require('../models/UserModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const SendEmail = require('../utils/sendEmail');


// signup route
exports.signup = asyncHandler(async (req, res, next) => {
    // 1- create a new user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    // 2- generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    // 3- send the token to the client
    res.status(201).json({
        data: user,
        token
    });
});

// login route
exports.login = asyncHandler(async (req, res, next) => {
    // 1- check if password and email in the body
    // 2- check if user is exist and password is correct
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401))
    }
    // 3- generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    // 4- send the token to the client
    res.status(200).json({
        data: user,
        token
    });
})

// protect route middleware
exports.protect = asyncHandler(async (req, res, next) => {
    // 1- check if token exist if exist get
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError('You are not logged in', 401));
    }
    // 2- Verify token (no chanage happens , expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user is Exist or Not
    const user = await User.findById(decoded.userId);
    if (!user) {
        return next(new ApiError('User no longer exists', 401));
    }
    // 4- check if user chanage is password after token created
    if (user.passwordChanagedAt) {
        const passChanagedTimestamp = parseInt(user.passwordChanagedAt.getTime() / 1000, 10);

        // if password chanaged after token created then return error
        if (passChanagedTimestamp > decoded.iat) {
            return next(new ApiError('Your password has been changed, please login again', 401));
        }
    }
    req.user = user;
    next();
});

// allow route middleware (for specific roles)
exports.allwedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!(roles.includes(req.user.role))) {
        return next(new ApiError('You are not authorized to access this route', 403));
    }
    next();
});

// resetpassword route
exports.forgetpassword = asyncHandler(async (req, res, next) => {
    // 1) get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`User not found for ${req.body.email}`, 404));
    }
    // 2) if user is exist , hash generate a 6-digit Random and save it in db
    const resetpassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResertCode = crypto.
        createHash('sha256')
        .update(resetpassword)
        .digest('hex');

    // 3) save a hashResertCode in model
    user.passwordResetCode = hashResertCode;
    user.passwordResetExpiret = Date.now() + 10 * 6 * 1000;
    user.passwordResetVerifed = false;
    await user.save();
    const resetMessage = `
    Hello,
    
    You have requested to reset your password. Please use the following code to complete the process:
    
    Reset Code: ${resetpassword}
    
    If you did not request this, please ignore this email or contact our support team for assistance.
    
    Thank you,
    E-shop Team
    `;
    // 3) send a email to user with the random code
    try {
        await SendEmail({
            to: user.email,
            subject: 'Reset Password Code',
            text: resetMessage
        });
    } catch (e) {
        user.passwordResetCode = undefined,
            user.passwordResetExpiret = undefined,
            user.passwordResetVerifed = undefined
        await user.save();
        return next(new ApiError('Failed to send email, please try again later', 500));
    }
    // 4) send response with success message
    res.status(200).json({ message: 'Reset password code sent successfully' });
});

// verifypasswordcode route
exports.verifypasswordcode = asyncHandler(async (req, res, next) => {
    // 1) get user based on resert code
    const hashResertCode = crypto.
        createHash('sha256')
        .update(req.body.passwordResetCode)
        .digest('hex');
    const user = await User.findOne({ passwordResetCode: hashResertCode });
    if (!user) {
        return next(new ApiError('Invalid or expired reset password code'));
    }
    // 2) reset code vaild
    user.passwordResetVerifed = true;
    await user.save();
    res.status(200).json({ message: 'Password reset code verified successfully' });
})


// resetpassword route
exports.Resetpassword = asyncHandler(async (req, res, next) => {
    // 1) get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError('There is no user with email ' + req.body.email, 404));
    }
    if (!(user.passwordResetVerifed)) {
        return next(new ApiError('Invalid or expired reset password code', 400));
    }
    // 2) hash the new password and save it in db
    user.password = req.body.Newpassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpiret = undefined;
    user.passwordResetVerifed = undefined;
    await user.save();

    // 3) generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    res.status(200).json({
        message: 'Password has been reset successfully',
        token
    });
})