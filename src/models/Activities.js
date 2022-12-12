const { DataTypes } = require('sequelize');
const { get } = require('../routes');
const { isAlphaNumeric } = require('../validators')
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Activities', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidName(value) {
          const array = isAlphaNumeric(value)
          if (array[0] === false) {
            throw new Error(array[1])
          }
        }
      }
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5,
        min: 1,
      }
    },
    season: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Verano', 'Otoño', 'Invierno', 'Primavera']],
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNonCero(value) {
          if (value < 1) {
            throw new Error('Duracion debe ser mayor a 0 en minutos')
          }
        }
      },
      set(value) {
        this.setDataValue('duration', value)
      }
    },
  },
    { timestamps: false }
  );
};