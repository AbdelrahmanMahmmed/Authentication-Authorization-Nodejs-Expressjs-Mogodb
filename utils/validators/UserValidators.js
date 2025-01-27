
const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');
const User = require('../../models/UserModel')
const slugify = require('slugify');
const bcrypt = require('bcryptjs');


exports.getUserValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

exports.createUserValidators = [
    body("name")
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (name, { req }) => {
            req.body.slug = slugify(name);
        }),

    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email, { req }) => {
            const userExists = await User.findOne({ email });
            if (userExists && userExists._id.toString() !== req.params.id) {
                throw new Error('Email already exists');
            }
        })
    ,

    body("password")
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .custom(async (password, { req }) => {
            if (password !== req.body.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ,

    body("confirmPassword")
        .notEmpty()
        .withMessage('Confirm Password is required'),

    body("role")
        .optional(),

    body("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage('Invalid phone number')
    ,
    body("isActive")
        .optional(),
    validatorsMiddleware,
];

exports.updateUserValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body("name")
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (name, { req }) => {
            req.body.slug = slugify(name);
        }),

    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email, { req }) => {
            const userExists = await User.findOne({ email });
            if (userExists && userExists._id.toString() !== req.params.id) {
                throw new Error('Email already exists');
            }
        })
    ,

    body("password")
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .custom(async (password, { req }) => {
            if (password !== req.body.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ,

    body("confirmPassword")
        .notEmpty()
        .withMessage('Confirm Password is required'),

    body("role")
        .optional(),

    body("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage('Invalid phone number')
    ,
    body("isActive")
        .optional(),
    validatorsMiddleware,
];

exports.deleteUserValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

exports.ChanagepasswordValiadtors = [
    param('id')
        .isMongoId()
        .withMessage('Invalid User id'),
    body("currentPassword")
        .notEmpty()
        .withMessage('Current Password is required')
    ,
    body("PasswordConfirm")
        .notEmpty()
        .withMessage('New Password is required')
        .isLength({ min: 6 })
        .withMessage('New Password must be at least 6 characters long')
    ,
    body("password")
        .notEmpty()
        .withMessage('Confirm Password is required')
        .custom(async (password, { req }) => {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('User not found');
            }
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if (!isCorrectPassword) {
                throw new Error('Incorrect current password');
            }

            return true;
        })
    ,
    validatorsMiddleware,
];


exports.updateAllDataUserValiadtors = [
    body("name")
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .custom(async (name, { req }) => {
            req.body.slug = slugify(name);
        }),
    body("email")
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email, { req }) => {
            const userExists = await User.findOne({ email });
            if (userExists && userExists._id.toString() !== req.params.id) {
                throw new Error('Email already exists');
            }
        }),

    body("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage('Invalid phone number'),
    validatorsMiddleware,
];