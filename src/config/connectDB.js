const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('bookingcare', 'root', '246938', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});


let connectDB = async () => {
    try {
        const isConnected =await sequelize.authenticate()  .then(() => true)
        .catch(() => false);
        if (!isConnected) {
            // Reconnect logic here
            async function reconnectToDatabase() {
                try {
                  await sequelize.authenticate(); // Reauthenticate the connection
                  console.log('Reconnected to the database.');
                } catch (error) {
                  console.error('Failed to reconnect to the database:', error);
                }
              }
              
              // Call the reconnect function
              reconnectToDatabase();
          }
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;