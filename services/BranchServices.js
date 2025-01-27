const { json } = require('express');
const Branch = require('../models/BranchModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');



// @desc   Find Branches
// @router Get   api/v1/Branches
// @access   Public

exports.getBranchs = asyncHandler(async(req, res) => {
    const BRANCH = await Branch.find({});
    res.status(200).json( {results : BRANCH.length , data : BRANCH});
});


// @desc   Get Branch By Id
// @router Get   api/v1/Branchs/:id
// @access   Public

exports.getBranch = asyncHandler( async(req , res , next)=>{
    const {id} = req.params ;
    const BRANCH = await Branch.findById(id);
    if(!BRANCH) { return next(new ApiError(`No Branch for this id :  ${id}` , 404))};
    res.status(200).json({data : BRANCH});
})


// @desc   Update   Branch By Id
// @router PUT      api/v1/Branch/:id
// @access          Private

exports.UpdateBranch = asyncHandler( async(req , res , next)=>{
    const {id} = req.params ; 
    const {namebranch , addressbranch ,PhoneNumberBranch , EmailBranch } = req.body ;

    const BRANCH = await Branch.findByIdAndUpdate(
        {_id : id} , 
        {
            namebranch , 
            slugbranch : slugify(namebranch),
            addressbranch,
            PhoneNumberBranch,
            EmailBranch
        }, 
        {new : true}
    );
    if(!BRANCH) { return next(new ApiError(`No Branch for this id :  ${id}` , 404))};
    res.status(200).json({data : BRANCH});
})


// @desc   Delete   Branch By Id
// @router Delete   api/v1/Branches/:id
// @access          Private

exports.DeleteBranch = asyncHandler( async(req , res , next)=>{
    const {id} = req.params ; 
    const BRANCH = await Branch.findByIdAndDelete(id);
    if(!BRANCH) { return next(new ApiError(`No Branch for this id :  ${id}` , 404))};
    res.status(200).json({data : BRANCH});
})

// @desc     Create   Branch
// @router   Post     api/v1/Branches
// @access            Private

exports.createBranch = asyncHandler(async(req, res) => {
    const {namebranch,addressbranch,PhoneNumberBranch,EmailBranch} = req.body;
    const BRANCH = await Branch.create(
        {
            namebranch,
            slugbranch : slugify(namebranch),
            addressbranch,
            PhoneNumberBranch,
            EmailBranch
        });
    res.status(201).json({data : BRANCH});  
});