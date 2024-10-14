export default () => ({
    database: {
        host: process.env.HOST,
        port: parseInt(process.env.PORT,10),
        database: process.env.DATABASE,
        username: process.env.USER,
        password: process.env.PASSWORD
    }
})