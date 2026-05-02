const fs = require('fs')
const path = require('path')

const printPdfUtils = {

    drawHeader:(doc,pageWidth) => {
        
        const headerHeight = 70
        const padding = 20

        // white background
        doc.save()
        doc.rect(0, 0, pageWidth, headerHeight).fill('#FFFFFF')
        doc.restore()

        // logo
        const logoPath = path.resolve(__dirname, '../../public/images/companyLogo3.jpg')
        const logoHeight = 35
        const logoX = padding
        const logoY = (headerHeight - logoHeight) / 2

        doc.image(logoPath, logoX, logoY, { height: logoHeight })

        doc.y = headerHeight

    },

    drawFrontPageHeader:(doc,pageWidth) => {
        
        const headerHeight = 100
        const padding = 390

        doc.save()
        doc.rect(0, 0, pageWidth, headerHeight).fill('#F60000')
        doc.restore()

        const logoPath = path.resolve(__dirname, '../../../public/images/companyLogo.jpg')
        const logoHeight = 45
        const logoX = padding
        const logoY = (headerHeight - logoHeight) / 2

        doc.image(logoPath, logoX, logoY, { height: logoHeight })

        doc.y = headerHeight + 20

    },

    drawFrontPageFooter: (doc, pageWidth, pageHeight) => {
        
        const footerHeight = 50
        const footerY = pageHeight - footerHeight

        doc.save()
        doc.rect(0, footerY, pageWidth, footerHeight).fill('#F60000')
        doc.restore()

        doc.y = footerY - 20
    },

    drawTitle:(doc,name,period) => {
        
        // main title
        doc        
         .fillColor('#15A89D')
         .font('Helvetica-BoldOblique')
         .fontSize(20)
         .text(name, { align: 'center' })

        doc.moveDown(0.2)

        // period
        doc
         .fillColor('#666666')
         .font('Helvetica-Oblique')
         .fontSize(10)
         .text(period, { align: 'center' })
    },

    drawFrontPageTitles:(doc,name,period) => {

        doc.moveDown(10)

        doc        
         .fillColor('#F60000')
         .font('Helvetica-BoldOblique')
         .fontSize(26)
         .text('LISTAS DE PRECIOS', { align: 'center' })

         doc.moveDown(1)
        
        doc        
         .fillColor('black')
         .font('Helvetica-BoldOblique')
         .fontSize(25)
         .text(name, { align: 'center' })

         doc.moveDown(0.25)

        doc
         .fillColor('#000000')
         .font('Helvetica-Oblique')
         .fontSize(18)
         .text(period, { align: 'center' })

    },

    drawFooter:(doc) => {

        const pageWidth = doc.page.width

        doc.x = 0
        doc.y = 780
        
        doc
        .fillColor('#999999')
        .font('Helvetica')
        .fontSize(7)
        .text('MULTIBRAND  |  ventas@multibrand.com  |  www.multibrand.com', { align: 'center' })

    },

    drawTableTitle:(doc) => {

        const headers = ['Artículo','Descripción','Precio unitario\n+ IVA', 'Unidades\npor caja']
        let currentY = doc.y + 6
        const columnWidths = [80, 280, 80, 60]
        const rowHeight = 26
        const fontSize = 8
        const pageWidth = doc.page.width
        const tableWidth = columnWidths.reduce((a, b) => a + b, 0)
        const startX = (pageWidth - tableWidth) / 2
        const radius = 4

        // rounded background for full header row
        doc.save()
            .roundedRect(startX, currentY, tableWidth, rowHeight, radius)
            .fill('#15A89D')
            .restore()

        // titles - vertically centered
        doc.font('Helvetica-Bold').fontSize(fontSize).fillColor('white')

        headers.forEach((text, i) => {
            const cellX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0)
            const textHeight = doc.heightOfString(text, { width: columnWidths[i] - 10, align: 'center' })
            const verticalOffset = (rowHeight - textHeight) / 2
            doc.text(text, cellX + 5, currentY + verticalOffset, {
                width: columnWidths[i] - 10,
                align: 'center'
            })
        })

        currentY += rowHeight

        const data = {
            startX: startX,
            columnWidths: columnWidths,
            currentY: currentY
        }

        return data

    },

    drawData:(doc,tableParams,name,period,unused,data, printType) => {

        let startX = tableParams.startX
        let columnWidths = tableParams.columnWidths
        let currentY = tableParams.currentY
        const rowHeight = 16
        const fontSize = 7
        let globalRowIdx = 0
        let isFirstCategory = true

        let currentCategory = ''

        data.forEach((element) => {

            if (printType == 1) {

                currentCategory = element.product_type

                const maxHeightPage = 770
                const pageWidth = doc.page.width

                // space needed: subtitle + table header + at least one row
                const spaceNeeded = isFirstCategory ? 0 : 60

                if (currentY + spaceNeeded > maxHeightPage) {
                    printPdfUtils.drawFooter(doc)
                    doc.addPage()
                    printPdfUtils.drawHeader(doc, pageWidth)
                    printPdfUtils.drawTitle(doc, name, period)
                    currentY = doc.y + 10
                }

                // spacing before category
                if (!isFirstCategory) {
                    currentY += 16
                } else {
                    currentY += 20
                }

                // category subtitle centered, black, larger
                doc.font('Helvetica-Bold').fontSize(11).fillColor('#333333')
                doc.text(element.product_type, startX, currentY, {
                    width: columnWidths.reduce((a, b) => a + b, 0),
                    align: 'center'
                })

                currentY += 16

                // draw new table header
                doc.y = currentY
                const newTableParams = printPdfUtils.drawTableTitle(doc)
                startX = newTableParams.startX
                columnWidths = newTableParams.columnWidths
                currentY = newTableParams.currentY

                globalRowIdx = 0
                isFirstCategory = false
            }

            element.data.forEach((row, rowIdx) => {

                let cellX = startX
                let maxHeight = rowHeight
                const maxHeightPage = 770
                const pageWidth = doc.page.width

                // calculate row height
                doc.font('Helvetica').fontSize(fontSize)
                doc.lineGap(0)

                row.forEach((raw, i) => {
                    const text = (raw ?? '').toString().trim().replace(/\s+/g,' ')
                    const h = doc.heightOfString(text, {
                        width: columnWidths[i] - 10,
                        align: 'center',
                        lineBreak: true,
                        paragraphGap: 0
                    })
                    if (h > maxHeight) maxHeight = h + 8
                })

                // check if there is space, otherwise add page
                if (currentY + maxHeight > maxHeightPage) {
                    
                    printPdfUtils.drawFooter(doc)
                    doc.addPage()
                    printPdfUtils.drawHeader(doc, pageWidth)
                    printPdfUtils.drawTitle(doc, name, period)
                    
                    // redraw category subtitle
                    currentY = doc.y + 20
                    doc.font('Helvetica-Bold').fontSize(11).fillColor('#333333')
                    doc.text(currentCategory, startX, currentY, {
                        width: columnWidths.reduce((a, b) => a + b, 0),
                        align: 'center'
                    })
                    currentY += 16
                    doc.y = currentY

                    const tableNewParams = printPdfUtils.drawTableTitle(doc)
                    startX = tableNewParams.startX
                    columnWidths = tableNewParams.columnWidths
                    currentY = tableNewParams.currentY
                    globalRowIdx = 0
                }

                // zebra striping
                const bgColor = globalRowIdx % 2 === 0 ? '#FFFFFF' : '#F7F7F7'

                // draw cells
                cellX = startX
                row.forEach((text, i) => {

                    // background
                    doc.save()
                        .rect(cellX, currentY, columnWidths[i], maxHeight)
                        .fill(bgColor)
                        .restore()

                    // text
                    doc.font('Helvetica').fontSize(fontSize).fillColor('#333333')
                    const cellAlign = 'center'
                    const textHeight = doc.heightOfString(text, {
                        width: columnWidths[i] - 10,
                        align: cellAlign
                    })
                    const verticalOffset = (maxHeight - textHeight) / 2 - 1 

                    doc.text(text, cellX + 5, currentY + verticalOffset, {
                        width: columnWidths[i] - 10,
                        align: cellAlign
                    })

                    cellX += columnWidths[i]
                })

                // subtle bottom border
                doc.save()
                    .moveTo(startX, currentY + maxHeight)
                    .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), currentY + maxHeight)
                    .lineWidth(0.5)
                    .strokeColor('#E0E0E0')
                    .stroke()
                    .restore()

                currentY += maxHeight
                globalRowIdx++
            })

        })

    },
}
        

module.exports = printPdfUtils
