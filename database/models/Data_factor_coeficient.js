module.exports = (sequelize, DataTypes) => {

   const alias = "Data_factors_coeficient"

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
      factor:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      sales_margin_percentage:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'data_factors_coeficient',
      timestamps : false,
   }

   const Data_factor_coeficient = sequelize.define(alias, cols, config)

   Data_factor_coeficient.associate = (models) => {
      Data_factor_coeficient.belongsTo(models.Data_suppliers,{
         as:'supplier_data',
         foreignKey: 'id_suppliers'
     })
   }
   
   return Data_factor_coeficient
   
}