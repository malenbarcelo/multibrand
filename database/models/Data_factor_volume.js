module.exports = (sequelize, DataTypes) => {

   const alias = "Data_factors_volume"
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
      std_volume:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_mu:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_container:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_terminal_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      terminal_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_dispatch_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      dispatch_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_maritime_agency_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      maritime_agency_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_domestic_freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      domestic_freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_volume_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_expenses_mu:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      custom_agent:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      insurance:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      transference:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      import_duty:{
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
      },
   }
   const config = {
      tableName : 'data_factors_volume',
      timestamps : false,
   }

   const Data_factor_volume = sequelize.define(alias, cols, config)

   Data_factor_volume.associate = (models) => {
      Data_factor_volume.belongsTo(models.Data_suppliers,{
         as:'supplier_data',
         foreignKey: 'id_suppliers'
     })
   }
   
   return Data_factor_volume
}