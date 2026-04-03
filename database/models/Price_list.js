module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists"

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
      price_list:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'prices_lists',
      timestamps : false
   }

   const Price_list = sequelize.define(alias, cols, config)

   Price_list.associate = (models) => {
      Price_list.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      }),
      Price_list.hasMany(models.Prices_lists_to_print,{
          as:'prices_lists_to_print',
          foreignKey: 'id_prices_lists'
      }),
      Price_list.hasMany(models.Prices_lists_categories,{
          as:'prices_lists_categories',
          foreignKey: 'id_prices_lists'
      })
   }

   return Price_list
}
