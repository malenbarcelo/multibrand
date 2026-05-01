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
      category_name:{
         type: DataTypes.STRING(500),
         allowNull: false,
      },
      id_prices_lists_names:{
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
      Price_list_category.belongsTo(models.Prices_lists_names,{
          as:'price_list_name_data',
          foreignKey: 'id_prices_lists_names'
      })
   }

   return Price_list_category
}
