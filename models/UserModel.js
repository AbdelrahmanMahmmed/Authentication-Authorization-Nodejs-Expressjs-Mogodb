const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
    name :{
        type: String,
        trim : true,
        required : [true , "name required"],
    },
    slug :{
        type : String,
        lowercase : true,
    },
    email :{
        type : String,
        required : [true , "email required"],
        unique : true,
        lowercase : true,
    },
    phone : String,
    profileImg : String,
    password : {
        type : String,
        required : [true , "password required"],
        minlength : [6, "password must be at least 8 characters long"],
    },
    passwordChanagedAt :{
        type: Date
    },
    passwordResetCode : String,
    passwordResetExpiret : Date,
    passwordResetVerifed : Boolean ,
    role : {
        type: String,
        enum : ["user", "admin"],
        default : "user",
    },
    isActive : {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

UserSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    // Hash the password before saving it to the database
    this.password = await bcrypt.hash(this.password , 12);
    next();
})

const user = mongoose.model('User', UserSchema);

module.exports = user;