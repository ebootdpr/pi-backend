const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Activities', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dificulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5,                  // only allow values <= 23
        min: 1,
      }
    },
    season: {
      type: DataTypes.ENUM(['Verano', 'Otoño', 'Invierno', 'Primavera']),
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
};