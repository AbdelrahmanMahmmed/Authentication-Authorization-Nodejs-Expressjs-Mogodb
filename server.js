const express = require('express');
const app = express();
const dotenv = require("dotenv");
const morgan = require('morgan');
const PORT = process.env.PORT || 5000 ;

// Load env variables
dotenv.config({ path: 'config.env' })

// Error Handler
const ApiError = require('./utils/APIError.js');
const globalError = require('./middleware/errormiddleware.js');


// Middleware
app.use(express.json());
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
    console.log(process.env.NODE_ENV);
}



// Import Routes

const UserRouter = require('./routers/UserRouter.js');
const AuthRouter = require('./routers/AuthRouter.js');
const BranchRouter = require('./routers/BranchRouter.js');

// Connection to DataBase
const DBconnection = require('./config/dbconnection');
DBconnection();


// Router

app.use('/api/v1/Users', UserRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/Branchs', BranchRouter);

// Error handling middleware on Express
app.all('*' , (req , res, next) =>{
    next(new ApiError(`This is the err No route ${req.originalUrl}` , 400));
});

// Error handling middleware globally  (it will be called in case of any error)
app.use(globalError);

// Start server  (app.listen)
app.listen(PORT , (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});

// Unhandled rejections
process.on('unhandledRejection' , (err) =>{
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server(()=>{
        process.exit(1);
    })
});