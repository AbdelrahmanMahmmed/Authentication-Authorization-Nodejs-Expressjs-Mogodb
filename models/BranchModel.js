const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    namebranch: {
        type: String,
        required: [true, "branch Required"],
        unique: [true, "branch must be Unique"],
        minlength: [3, "Too short branch name"],
        maxlength: [32, "Too long branch name"],
    },
    addressbranch: {
        type: String,
        required: [true, "Description Required"],
        minlength: [10, "Too short Description"],
        maxlength: [500, "Too long Description"],
    },
    slugbranch: {
        type: String,
        lowercase: true,
    },
    PhoneNumberBranch: {
        type: String,
    },
    EmailBranch: {
        type: String,
    },
    
    imagebranch: String,

}, { timestamps: true });
const branch = mongoose.model('branch', branchSchema);

module.exports = branch;