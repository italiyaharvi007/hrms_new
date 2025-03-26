const {body} = require('express-validator');

exports.validator = {

    validateInsertCountry : [
        body('country_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter COUNTRY-NAME !'),
    ],
    
    validateUpdateCountry : [
        body('country_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter COUNTRY-NAME !'),
    ],

    validateinsertstate : [
        body('state_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter STATE-NAME !'),
        body('country_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter COUNTRY-NAME !'),
    ], 

    validateupdatestate : [
        body('state_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter STATE-NAME !'),
        body('country_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter COUNTRY-NAME !'),
    ],

    validateInsertCity : [
        body('city_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter CITY-NAME !'),
        body('state_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter STATE-NAME !'),
    ], 

    validateUpdateCity : [
        body('city_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter CITY-NAME !'),
        body('state_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter STATE-NAME !'),
    ],
   
}


