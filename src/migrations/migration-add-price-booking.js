module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Bookings',
                'priceId',
                {
                    type: Sequelize.STRING
                }
            ),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Bookings', 'priceId'),
        ]);
    }
};