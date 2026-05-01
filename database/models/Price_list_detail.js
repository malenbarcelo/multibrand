module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists_details"

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
      id_suppliers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      erp_item:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      supplier_item:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      price_list_item:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      units_per_item:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING(5000),
         allowNull: true,
      },
      id_prices_lists_names:{
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
      tableName : 'prices_lists_details',
      timestamps : false
   }

   const Prices_list_detail = sequelize.define(alias, cols, config)

   Prices_list_detail.associate = (models) => {
      Prices_list_detail.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      }),
      Prices_list_detail.belongsTo(models.Data_suppliers,{
          as:'supplier_data',
          foreignKey: 'id_suppliers'
      }),
      Prices_list_detail.belongsTo(models.Prices_lists_names,{
          as:'list_name_data',
          foreignKey: 'id_prices_lists_names'
      }),
      Prices_list_detail.belongsTo(models.Prices_lists_categories,{
          as:'category_data',
          foreignKey: 'id_prices_lists_categories'
      }),
      Prices_list_detail.hasMany(models.Master,{
          as:'master_data',
          foreignKey: 'item',
          sourceKey: 'supplier_item'
      })
   }

   return Prices_list_detail
}
