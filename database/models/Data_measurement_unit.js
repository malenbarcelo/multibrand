module.exports = (sequelize, DataTypes) => {

   const alias = "Data_measurement_units"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      measurement_unit:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      units_per_mu:{
      type: DataTypes.INTEGER,
      allowNull: false,
      }
   }
   const config = {
      tableName : 'data_measurement_units',
      timestamps : false
   }
   const Data_measurement_unit = sequelize.define(alias, cols, config)
   
   return Data_measurement_unit
}