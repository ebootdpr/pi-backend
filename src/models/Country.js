const { raw } = require('body-parser');
const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el mode lo
  sequelize.define('Country', {
    cca3: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flags: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    continents: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Europe', 'Asia', 'North America', 'Africa', 'Antarctica', 'South America', 'Oceania', 'Other']],
      }
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subregion: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.REAL,
      get() {
        const rawValue = '' + this.getDataValue('area') + '';
        return rawValue
      }
    },
    population: {
      type: DataTypes.INTEGER,
      get() {
        const rawValue = '' + this.getDataValue('population') + '';
        return rawValue
      }
    },

  },
    { timestamps: false }
  );
};
