'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Patient_Infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Patient_Infor.hasOne(models.History, { foreignKey: 'patientId' })
        }
    }
    Patient_Infor.init(
        {
            patientId: DataTypes.INTEGER,
            birthday: DataTypes.STRING,
            doctorRequest: DataTypes.ARRAY(DataTypes.STRING),
            reason: DataTypes.STRING,
            statusUpdate: DataTypes.STRING,
            personalHistory: DataTypes.STRING,
            bloodGroup: DataTypes.STRING,
            bloodPressure: DataTypes.STRING,
            weight: DataTypes.INTEGER,
            height: DataTypes.INTEGER,
            temperature: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Patient_Infor',
            freezeTableName: true
        }
    )
    return Patient_Infor
}
