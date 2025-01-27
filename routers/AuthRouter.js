const express = require('express');
const {
    signupValidators,
    loginValidators
} = require('../utils/validators/AuthValidators');

const router = express.Router();

const {
    signup,
    login,
    forgetpassword,
    verifypasswordcode,
    Resetpassword
} = require('../services/authservices');

router
    .route('/signup')
    .post(signupValidators, signup);

router
    .route('/login')
    .post(loginValidators, login);

router
    .route('/forgotPassword')
    .post(forgetpassword);

router
    .route('/verifyResetCode')
    .post(verifypasswordcode);

router
    .route('/Resetpassword')
    .post(Resetpassword);


module.exports = router;