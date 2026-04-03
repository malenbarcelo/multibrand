module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists_categories"

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
      price_list_category:{
         type: DataTypes.STRING(500),
         allowNull: false,
      },
      id_prices_lists:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'prices_lists_categories',
      timestamps : false
   }

   const Price_list_category = sequelize.define(alias, cols, config)

   Price_list_category.associate = (models) => {
      Price_list_category.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      }),
      Price_list_category.belongsTo(models.Prices_lists,{
          as:'price_list_data',
          foreignKey: 'id_prices_lists'
      })
   }

   return Price_list_category
}
