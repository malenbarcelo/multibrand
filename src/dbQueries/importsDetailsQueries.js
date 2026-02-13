const db = require('../../database/models')
const { Op,fn,col } = require('sequelize')
const utils = require("../utils/utils")
const model = db.Imports_details

const importsQueries = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    },

    delete: async (condition,data) => {

        let whereCondition = {}

        if (condition == 'id') {
            whereCondition = { id: data }
        }

        if (condition == 'id_imports') {
            whereCondition = { id_imports: data }
        }

            await model.destroy(
                { where: whereCondition }
            )
    },
}       

module.exports = importsQueries