const {body} = require('express-validator');

exports.validator = {

    validateAdminRegister : [
        body('admin_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('ADMIN-NAME must be within 3 to 20 character!'),
        body('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('invalid EMAIL'),
        body('contact')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 10,max: 10})
            .withMessage('Enter 10 degites of CONTACT!'),
        body('user_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('USER-NAME must be within 3 to 20 character!'),
        body('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password is Empty!')
            .isLength({min: 6,max: 20})
            .withMessage('PASSWORD must be with in 6 to 20 character!'),  
        body('city_id')  
            .trim()
            .not()
            .isEmpty()
            .withMessage('CITY_ID is empty !'),
        body('address')  
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 30})
            .withMessage('Enter ADDRESS minimum 3 charactor !'),
    ],
    
    validateAdminLogin : [
        body('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('invalid EMAIL'),
        body('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Password is Empty!')
            .isLength({min: 6,max: 20})
            .withMessage('PASSWORD must be with in 6 to 20 character!'),
    ],


    validateAdminUpdate : [
        body('admin_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('ADMIN-NAME must be within 3 to 20 character!'),
        body('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('invalid EMAIL'),
        body('contact')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 10,max: 10})
            .withMessage('Enter 10 degites of CONTACT!'),
        body('user_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('USER-NAME must be within 3 to 20 character!'),
        body('city_id')  
            .trim()
            .not()
            .isEmpty()
            .withMessage('CITY_ID is empty !'),
        body('address')  
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 30})
            .withMessage('Enter ADDRESS minimum 3 charactor !'),
    ],


    // validateUserLogin : [
    //     body('email')
    //         .normalizeEmail()
    //         .isEmail()
    //         .withMessage('invalid EMAIL'),
    //     body('password')
    //         .trim()
    //         .not()
    //         .isEmpty()
    //         .withMessage('PASSWORD is empty!')
    //         .isLength({min: 4,max: 20})
    //         .withMessage('PASSWORD must be with in 4 to 20 character!'),
    // ],

    changepasswordvalidator: [
        body('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('PASSWORD is empty!')
            .isLength({min: 6,max: 20})
            .withMessage('PASSWORD must be with in 6 to 20 character!'),
        body('confirmpassword')
            .trim()
            .not()
            .isEmpty()
            .withMessage('CONFIRM-PASSWORD is empty!')
            .isLength({min: 6,max: 20})
            .withMessage('PASSWORD must be with in 6 to 20 character!'),
    ]
    
}



