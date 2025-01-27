const mongoose = require("mongoose");

const Connection = () => {
    mongoose.connect(process.env.db_connect)
        .then((connect) => 
            { 
                console.log("Database connect.....") 
            })
            .catch((err) => 
                { 
                console.log(err) 
        }   
    );
} 

module.exports = Connection ;