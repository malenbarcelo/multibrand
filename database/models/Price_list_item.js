module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists_items"

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
      erp_item:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      supplier_item:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      price_list_item:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      units_per_item:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_prices_lists_categories:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'prices_lists_items',
      timestamps : false
   }

   const Prices_list_item = sequelize.define(alias, cols, config)

   Prices_list_item.associate = (models) => {
      Prices_list_item.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      }),
      Prices_list_item.belongsTo(models.Prices_lists_categories,{
          as:'category_data',
          foreignKey: 'id_prices_lists_categories'
      })
   }

   return Prices_list_item
}
