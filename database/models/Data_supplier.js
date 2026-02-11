module.exports = (sequelize, DataTypes) => {

   const alias = "Data_suppliers"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      supplier:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      business_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      address:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      country:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cost_calculation:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }
   const config = {
      tableName : 'data_suppliers',
      timestamps : false
   }

   const Data_supplier = sequelize.define(alias, cols, config)

   Data_supplier.associate = (models) => {
      Data_supplier.belongsTo(models.Data_currencies,{
          as:'currency_data',
          foreignKey: 'id_currencies'
      }),
      Data_supplier.hasMany(models.Data_factors_volume,{
         as:'factors_volume',
         foreignKey: 'id_suppliers'
      }),
      Data_supplier.hasMany(models.Data_factors_coeficient,{
         as:'factors_coeficient',
         foreignKey: 'id_suppliers'
      })
   }
   
   return Data_supplier
}