'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Patient_Infor', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            patientId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            birthday: {
                type: Sequelize.STRING
            },
            doctorRequest: {
                type: Sequelize.ARRAY(Sequelize.STRING)
            },
            reason: {
                type: Sequelize.STRING
            },
            statusUpdate: {
                type: Sequelize.STRING
            },
            personalHistory: {
                type: Sequelize.STRING
            },
            bloodGroup: {
                type: Sequelize.STRING
            },
            bloodPressure: {
                type: Sequelize.STRING
            },
            weight: {
                type: Sequelize.INTEGER
            },
            height: {
                type: Sequelize.INTEGER
            },
            temperature: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Patient_Infor')
    }
}
