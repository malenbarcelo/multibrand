module.exports = (sequelize, DataTypes) => {

   const alias = "Master"

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
      item:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_measurement_units:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      mu_per_box:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      weight_kg:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      volume_m3:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      fob:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      special_price_factor:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      brand:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      has_breaks:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      origin:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
      
   }
   const config = {
      tableName : 'master',
      timestamps : false,
   }

   const Master = sequelize.define(alias, cols, config)

   Master.associate = (models) => {
      Master.belongsTo(models.Data_suppliers,{
          as:'supplier_data',
          foreignKey: 'id_suppliers'
      }),
      Master.belongsTo(models.Data_measurement_units,{
         as:'mu_data',
         foreignKey: 'id_measurement_units'
     })
   }
   
   return Master
}