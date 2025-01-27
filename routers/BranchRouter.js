const express = require('express');
const authUser = require('../services/authservices')
const protectedRoter = authUser.protect;
const authoriationRoter = authUser.allwedTo("admin");
const {
    getbranchValiadtors,
    updatebranchValiadtors,
    createbranchValidators,
    deletebranchValiadtors
} = require('../utils/validators/BranchVailators');

const router = express.Router();

const {
    getBranch,
    getBranchs,
    UpdateBranch,
    DeleteBranch,
    createBranch
} = require('../services/BranchServices');

router
    .route('/')
    .get(getBranchs)
    .post(protectedRoter, authoriationRoter, createbranchValidators, createBranch);

router
    .route('/:id')
    .get(getbranchValiadtors, getBranch)
    .put(updatebranchValiadtors, UpdateBranch)
    .delete(deletebranchValiadtors, DeleteBranch);

module.exports = router;