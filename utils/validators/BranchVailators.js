
const { param, body } = require('express-validator');
const validatorsMiddleware = require('../../middleware/validatormiddleware');

exports.getbranchValiadtors = [
    param('id').isMongoId().withMessage('Invalid branch id'),
    validatorsMiddleware,
];


exports.createbranchValidators = [
    
    body('namebranch')
        .notEmpty()
        .withMessage("branch Required")
        .isLength({ min: 3 })
        .withMessage("Too short branch name")
        .isLength({ max: 32 })
        .withMessage("Too long branch name"),

    body('addressbranch')
        .notEmpty()
        .withMessage("branch Required")
        .isLength({ min: 10 })
        .withMessage("Too short branch name")
        .isLength({ max: 500 })
        .withMessage("Too long branch name"),

    body('PhoneNumberBranch')
        .notEmpty()
        .withMessage("branch Required")
        .isLength({ min: 10 })
        .withMessage("Too short Phone number")
        .isLength({ max: 15 })
        .withMessage("Too long Phone number"),

    body('EmailBranch')
        .notEmpty()
        .withMessage("branch Required")
        .isEmail()
        .withMessage("Invalid Email"),        
    validatorsMiddleware,
];


exports.updatebranchValiadtors = [
    param('id').isMongoId().withMessage('Invalid branch id'),
    validatorsMiddleware,
];

exports.deletebranchValiadtors = [
    param('id').isMongoId().withMessage('Invalid branch id'),
    validatorsMiddleware,
];