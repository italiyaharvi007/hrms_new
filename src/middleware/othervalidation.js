const {body} = require('express-validator');

exports.validator = {

    validateinsertattendance : [
        // body('user_id')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter USER !'),
        // body('intime')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter valid IN-TIME !')
    ],
    
    validateupdateattendance : [
        // body('outtime')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter valid OUT-TIME '),
        // body('remark')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter REMARK !')
    ],

    validateinsertdepartment : [
        body('dep_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DEPARTMENT-NAME !'),
        body('description')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DESCRIPTION !')
    ], 

    validateupdatedepartment : [
        body('dep_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DEPARTMENT-NAME !'),
        body('description')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DESCRIPTION !'),
    ],

    validateinsertproject : [
        body('pro_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter PROJECT-NAME !'),
        body('status')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter STATUS!'),
        body('description')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DESCRIPTION!'),
        body('tec_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter TECHNOLOGY-ID!'),
    ],

    validateupdateproject : [
        // body('pro_name')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter PROJECT-NAME !'),
        body('status')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter STATUS !'),
        // body('description')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter DESCRIPTION !'),
        // body('tec_id')
        //     .trim()
        //     .not()
        //     .isEmpty()
        //     .withMessage('please enter TECHNOLOGY-ID!'),
    ],

    validateinsertrole : [
        body('role_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter ROLE-NAME!')
    ],

    validationupdaterole : [
        body('role_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter ROLE-NAME !'),
    ],

    validationinsertsalary : [
        body('salary')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 10})
            .withMessage('SALARY must be within 3 to 6 character !'),
        body('bank_detail')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter your BANK-DETAIL !'),
    ],

    validationupdatesalary : [
        body('salary')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 10})
            .withMessage('Salary must be within 3 to 6 character !'),
        body('bank_detail')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter your BANK-DETAIL !'),
    ],

    validationinserttechnology : [
        body('tec_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter TECHNOLOGY-NAME !'),
        body('dep_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DEPARTMENT-ID !'),
    ],

    validationupdatetechnology : [
        body('tec_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter TECHNOLOGY-NAME !'),
        body('dep_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter DEPARTMENT-ID !'),
    ],

    validationinsertuser : [
        body('firstname')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('FIRST-NAME must be within 3 to 20 character!'),
        body('middlename')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('MIDDLE-NAME must be within 3 to 20 character!'),
        body('lastname')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 20})
            .withMessage('LAST-NAME must be within 3 to 20 character!'),
        body('official_email')
            .normalizeEmail()
            .isEmail()
            .withMessage('invalid OFFICIAL-EMAIL'),
        body('personal_email')
            .normalizeEmail()
            .isEmail()
            .withMessage('invalid PERSONAL-EMAIL'),
        body('username')
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
            .withMessage('PASSWORD must be within 6 to 20 character!'),
        body('city_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please select CITY-NAME!'),
        body('address')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 5,max: 100})
            .withMessage('please enter valid ADDRESS!'),
        body('birth_date')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter BIRTH-DATE!'),
        body('age')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter AGE'),
        body('gender')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter GENDER'),
        body('role_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter USER-ROLE!'),
        body('phoneno')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 10,max: 10})
            .withMessage('Enter 10 degites of CONTACT!'),
        body('alternet_phoneno')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 10,max: 10})
            .withMessage('Enter 10 degites of CONTACT!'),
    ],

    validationupdateuser : [
        body('firstname')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 3,max: 20})
        .withMessage('FIRST-NAME must be within 3 to 20 character!'),
    body('middlename')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 3,max: 20})
        .withMessage('MIDDLE-NAME must be within 3 to 20 character!'),
    body('lastname')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 3,max: 20})
        .withMessage('LAST-NAME must be within 3 to 20 character!'),
    body('official_email')
        .normalizeEmail()
        .isEmail()
        .withMessage('invalid OFFICIAL-EMAIL'),
    body('personal_email')
        .normalizeEmail()
        .isEmail()
        .withMessage('invalid PERSONAL-EMAIL'),
    body('username')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 3,max: 20})
        .withMessage('USER-NAME must be within 3 to 20 character!'),
    body('city_id')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please select CITY-NAME!'),
    body('address')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 5,max: 100})
        .withMessage('please enter valid ADDRESS!'),
    body('birth_date')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter BIRTH-DATE!'),
    body('age')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter AGE'),
    body('gender')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter GENDER'),
    body('role_id')
        .trim()
        .not()
        .isEmpty()
        .withMessage('please enter USER-ROLE!'),
    body('phoneno')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 10,max: 10})
        .withMessage('Enter 10 degites of CONTACT!'),
    body('alternet_phoneno')
        .trim()
        .not()
        .isEmpty()
        .isLength({min: 10,max: 10})
        .withMessage('Enter 10 degites of CONTACT!'),
    ],

    validationaddbankdetail : [
        body('user_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter USER_ID!'),
        body('bank_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 50})
            .withMessage('BANK_NAME enter minimum 3 charactor!'),  
        body('acc_no')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 11,max: 11})
            .withMessage('please enter 11 degits of ACCOUNT_NUMBER!'),
        body('branch_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 50})
            .withMessage('BRANCH_NAME enter minimum 3 charactor!'),
        body('city_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter CITY_ID'),
        body('ifsc_code')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 11,max: 11})
            .withMessage('please enter 11 degits of IFSC_CODE!'),
        body('acc_type')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter ACCOUNT_TYPE!'),
    ],

    validationupdatebankdetail : [
        body('user_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter USER_ID!'),
        body('bank_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 50})
            .withMessage('BANK_NAME enter minimum 3 charactor!'),  
        body('acc_no')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 11,max: 11})
            .withMessage('please enter 11 degits of ACCOUNT_NUMBER!'),
        body('branch_name')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 3,max: 50})
            .withMessage('BRANCH_NAME enter minimum 3 charactor!'),
        body('city_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter CITY_ID'),
        body('ifsc_code')
            .trim()
            .not()
            .isEmpty()
            .isLength({min: 11,max: 11})
            .withMessage('please enter 11 degits of IFSC_CODE!'),
        body('acc_type')
            .trim()
            .not()
            .isEmpty()
            .withMessage('please enter ACCOUNT_TYPE!'),
    ]
}