module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists_names"

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
      price_list_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      image:{
         type: DataTypes.STRING(45),
         allowNull: true,
      }
   }

   const config = {
      tableName : 'prices_lists_names',
      timestamps : false
   }

   const Price_list_name = sequelize.define(alias, cols, config)

   Price_list_name.associate = (models) => {
      Price_list_name.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      }),
      Price_list_name.hasMany(models.Prices_lists_categories,{
          as:'prices_lists_categories',
          foreignKey: 'id_prices_lists_names'
      })
   }

   return Price_list_name
}
