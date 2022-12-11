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
      },
      get(value) {
        const convertMinutes = (minutes) => {
          if (minutes === null || minutes == 0 || isNaN(minutes)) return "Undefined";
          let h = Math.trunc(time / 60);
          let m = time % 60;

          let hDisplay = h > 0 ? h + (h === 1 ? " Hour " : " Hours ") : "";
          let mDisplay = m > 0 ? m + (m === 1 ? " Minute " : " Minutes ") : "";

          return hDisplay + mDisplay;
        }
        return convertMinutes(value)
      }
    },
  },
    { timestamps: false }
  );
};