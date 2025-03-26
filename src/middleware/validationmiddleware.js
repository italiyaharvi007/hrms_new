const { validationResult } = require('express-validator');

exports.AdminValidation = (req,res,next)=>{
  const result = validationResult(req).array();
  if(!result.length) return next();

  const error = result[0].msg;
  res.json({Success: false, message: error})
}

exports.LocationValidation = (req,res,next)=>{
  const result = validationResult(req).array();
  if(!result.length) return next();

  const error = result[0].msg;
  res.json({Success: false, message: error})
}

exports.othervalidation = (req,res,next)=>{
  const result = validationResult(req).array();
  if(!result.length) return next();

  const error = result[0].msg;
  res.json({Success: false, message: error})

}