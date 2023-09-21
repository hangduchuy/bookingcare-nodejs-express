module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Clinics',
                'latitude',
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                'Clinics',
                'longitude',
                {
                    type: Sequelize.STRING
                }
            ),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Clinics', 'latitude'),
            queryInterface.removeColumn('Clinics', 'longitude')
        ]);
    }
};