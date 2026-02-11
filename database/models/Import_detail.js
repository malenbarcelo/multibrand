module.exports = (sequelize, DataTypes) => {

   const alias = "Imports_details"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      id_imports:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_master:{
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
      mu_quantity:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      fob:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_m3:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      weight_kg:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      pays_duties_tarifs:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      estimated_unit_cost:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      }
   }
   
   const config = {
   tableName : 'imports_details',
   timestamps : false
   }

   const Import_detail = sequelize.define(alias, cols, config)

   Import_detail.associate = (models) => {
      Import_detail.belongsTo(models.Imports,{
          as:'import_data',
          foreignKey: 'id_imports'
      }),
     Import_detail.belongsTo(models.Master,{
         as:'master_data',
         foreignKey: 'id_master'
     }),
     Import_detail.belongsTo(models.Data_measurement_units,{
         as:'mu_data',
         foreignKey: 'id_measurement_units'
     })

   }
   
   return Import_detail
}