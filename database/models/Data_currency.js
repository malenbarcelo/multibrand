module.exports = (sequelize, DataTypes) => {

   const alias = "Data_currencies"
   
   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      currency:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'data_currencies',
      timestamps : false,
   }

   const Data_currency = sequelize.define(alias, cols, config)

   Data_currency.associate = (models) => {
      Data_currency.hasMany(models.Data_currencies_exchanges,{
         as:'exchanges',
         foreignKey: 'id_currencies'
      })
   }
   
   return Data_currency
}