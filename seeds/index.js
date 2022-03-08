require('dotenv').config();

const seeder = async() => {
    try {
        await require('../startup/db')();
        await require('./user.seeder')();
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
}

seeder();