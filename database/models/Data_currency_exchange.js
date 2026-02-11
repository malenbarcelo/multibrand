module.exports = (sequelize, DataTypes) => {

   const alias = "Data_currencies_exchanges"
   
   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_branches:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      currency_exchange:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
   }
   const config = {
      tableName : 'data_currencies_exchanges',
      timestamps : false,
   }

   const Data_currency_exchange = sequelize.define(alias, cols, config)

   Data_currency_exchange.associate = (models) => {
      Data_currency_exchange.belongsTo(models.Data_currencies,{
          as:'currency_data',
          foreignKey: 'id_currencies'
      }),
      Data_currency_exchange.belongsTo(models.Branches,{
         as:'branch_data',
         foreignKey: 'id_branches'
     })
   }
   
   return Data_currency_exchange
}