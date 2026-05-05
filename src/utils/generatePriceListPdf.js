const PDFDocument = require('pdfkit')
const ppdf = require('./printPdfUtils')
const pricesListsDetailsQueries = require('../dbQueries/pricesListsDetailsQueries')
const { addMasterData } = require('./addMasterData')

async function generatePriceListPdf(idPricesListsName, idBranch, month, year, branchData) {

    // get data to print
    const filters = {
        id_branches: idBranch,
        order: [["list_name", "ASC"], ["list_category", "ASC"], ["price_list_item", "ASC"]],
        price_list_item_null: false,
        id_prices_lists_names: idPricesListsName,
        enabled: 1
    }

    let dataToPrint = await pricesListsDetailsQueries.get({ undefined, undefined, filters })

    // add master details
    dataToPrint = await addMasterData(dataToPrint, idBranch)
    dataToPrint = dataToPrint.rows

    // filter data
    dataToPrint = dataToPrint.filter(row =>
        row.master_details &&
        row.master_details.sells_price_local_currency != null &&
        row.master_details.sells_price_local_currency != '' &&
        row.description != null &&
        row.description != ''
    )

    if (dataToPrint.length === 0) return null

    const listName = dataToPrint[0].list_name_data.price_list_name
    const listImage = dataToPrint[0].list_name_data.image
    const period = month + ' ' + year

    const doc = new PDFDocument({ margin: 27, size: 'A4' })

    // collect buffer
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))

    const pageWidth = doc.page.width

    // print header
    ppdf.drawHeader(doc, pageWidth, listImage)

    // print title
    ppdf.drawTitle(doc, listName, period)

    // prepare table params
    const columnWidths = [80, 280, 80, 60]
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0)
    const startX = (pageWidth - tableWidth) / 2
    const tableParams = {
        startX: startX,
        columnWidths: columnWidths,
        currentY: doc.y
    }

    // group data by category
    const grouped = []
    const categoryMap = {}
    dataToPrint.forEach(row => {
        const catId = row.id_prices_lists_categories
        if (!categoryMap[catId]) {
            categoryMap[catId] = {
                product_type: row.category_data.category_name,
                data: []
            }
            grouped.push(categoryMap[catId])
        }
        categoryMap[catId].data.push([
            row.price_list_item || '',
            row.description || '',
            row.master_details && row.master_details.sells_price_local_currency ? Math.ceil(row.master_details.sells_price_local_currency).toLocaleString('es-AR') : '',
            row.units_per_item || ''
        ])
    })

    // print data
    ppdf.drawData(doc, tableParams, listName, period, listImage, grouped, 1, branchData)

    // print footer
    ppdf.drawFooter(doc, branchData)

    // end and return buffer
    return new Promise((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.end()
    })
}

module.exports = { generatePriceListPdf }
