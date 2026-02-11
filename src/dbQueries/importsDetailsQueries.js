const db = require('../../database/models')
const { Op,fn,col } = require('sequelize')
const utils = require("../utils/utils")
const model = db.Imports_details

const importsQueries = {
    create: async(data) => {
        const createdData = await model.bulkCreate(data)
        return createdData
    }
}       

module.exports = importsQueries