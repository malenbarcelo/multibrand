module.exports = (sequelize, DataTypes) => {

   const alias = "Data_items"

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
      erp:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      supplier:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      price_list:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      units_per_item:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'data_items',
      timestamps : false
   }

   const Data_item = sequelize.define(alias, cols, config)

   Data_item.associate = (models) => {
      Data_item.belongsTo(models.Branches,{
          as:'branch_data',
          foreignKey: 'id_branches'
      })
   }

   return Data_item
}
