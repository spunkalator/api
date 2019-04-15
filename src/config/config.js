 
module.exports = {
    'secret': 'super secret',
    'port' : process.env.PORT||3002,
    dbUrl: {
        dev: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds139946.mlab.com:39946/heroku_gr5b9d4f`,
        //dev: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        prod: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&authSource=admin`,
    }
};
