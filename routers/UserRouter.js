const express = require('express');

// Validators
const {
    getUserValiadtors,
    updateUserValiadtors,
    createUserValidators,
    deleteUserValiadtors,
    ChanagepasswordValiadtors,
    updateAllDataUserValiadtors
} = require('../utils/validators/UserValidators');

// Services
const {
    createUser,
    getUsers,
    getUser,
    DeleteUser,
    UpdateUser,
    ChangePassword,
    getMyAccount,
    updatePassword,
    updatealldataUser,
    UnactiveUser,
    activeMe
} = require('../services/UserServices');

// Authentication and Authorization Module
const authservices = require('../services/authservices');
const protectedRouter = authservices.protect;
const authorizationRouter = authservices.allwedTo("admin");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectedRouter);

// User-specific routes
router.get('/getMe', getMyAccount, getUser);
router.put('/UpdateMyPassword', updatePassword);
router.put('/UpdateMy', updateAllDataUserValiadtors, updatealldataUser);
router.delete('/deleteMy', UnactiveUser);
router.post('/activeMe', activeMe);

// Admin-specific routes (authorization required)
router.use(authorizationRouter);

router
    .route('/')
    .get(getUsers)
    .post(createUserValidators, createUser);

router
    .route('/ChangePassword/:id')
    .put(ChanagepasswordValiadtors, ChangePassword);

router
    .route('/:id')
    .get(getUserValiadtors, getUser)
    .put(updateUserValiadtors, UpdateUser)
    .delete(deleteUserValiadtors, DeleteUser);

module.exports = router;