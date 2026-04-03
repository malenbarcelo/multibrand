module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists_to_print"

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
      id_prices_lists:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price_list_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      price_list_factor:{
         type: DataTypes.DECIMAL(3,2),
         allowNull: false,
      },
      include_in_consolidated_list:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'prices_lists_to_print',
      timestamps : false
   }

   const Price_list_to_print = sequelize.define(alias, cols, config)

   Price_list_to_print.associate = (models) => {
      Price_list_to_print.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      }),
      Price_list_to_print.belongsTo(models.Prices_lists,{
          as:'price_list_data',
          foreignKey: 'id_prices_lists'
      })
   }

   return Price_list_to_print
}
