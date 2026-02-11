module.exports = (sequelize, DataTypes) => {

   const alias = "Imports"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      purchase_order:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      po_number:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      id_branches:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_suppliers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      reception_date:{
         type: DataTypes.DATE,
         allowNull: true,
      },
      freight_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      insurance_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      cif_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      forwarder_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      domestic_freight_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      dispatch_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      office_fees_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      container_costs_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      port_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      duties_tarifs_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      container_insurance_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      port_contribution_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      other_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull:false
      },
   }
   
   const config = {
   tableName : 'imports',
   timestamps : false
   }

   const Import = sequelize.define(alias, cols, config)

   Import.associate = (models) => {
      Import.belongsTo(models.Data_suppliers,{
          as:'supplier_data',
          foreignKey: 'id_suppliers'
      }),
     Import.belongsTo(models.Branches,{
         as:'branch_data',
         foreignKey: 'id_branches'
     })
     Import.hasMany(models.Imports_details,{
      as:'details',
      foreignKey: 'id_imports'
     })
   }
   
   return Import
}