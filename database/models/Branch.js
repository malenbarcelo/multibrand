module.exports = (sequelize, DataTypes) => {

   const alias = "Branches"
   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      branch:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      pos_suffix:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_currencies:{
         type: DataTypes.INTEGER,
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
   }

   const config = {
      tableName : 'branches',
      timestamps : false
   }

   const Branch = sequelize.define(alias, cols, config)

   Branch.associate = (models) => {
      Branch.belongsTo(models.Data_currencies,{
          as:'currency_data',
          foreignKey: 'id_currencies'
      })
   }
   
   return Branch

}