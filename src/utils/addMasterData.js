const masterQueries = require("../dbQueries/masterQueries")
const { getMaster } = require("./getMaster")

async function addMasterData(data, idBranch) {

    // get master details
    const masterIds = data.rows
        .filter(r => r.master_data && r.master_data.id)
        .map(r => r.master_data.id)

    if (masterIds.length > 0) {
        const masterFilters = { id: masterIds, id_branches: idBranch }
        let masterData = await masterQueries.get({ filters: masterFilters })
        masterData = await getMaster(masterData, idBranch)

        const masterMap = {}
        masterData.rows.forEach(m => { masterMap[m.id] = m })

        data.rows.forEach(row => {
            row.master_details = row.master_data ? (masterMap[row.master_data.id] || null) : null
        })
    } else {
        data.rows.forEach(row => { row.master_details = null })
    }

    return data

}

module.exports = { addMasterData }
