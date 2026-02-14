import { domain } from "../domain.js"
import g from "./globals.js"
import gg from "../globals.js"
import { printImports } from "./printImports.js"

const utils = {

    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`
        filters += g.filters.id_suppliers == '' ? '' : `&id_suppliers=${g.filters.id_suppliers}`
        filters += g.filters.po_string == '' ? '' : `&po_string=${g.filters.po_string}`
        filters += g.filters.item_string == '' ? '' : `&item_string=${g.filters.item_string}`
        filters += g.filters.import_status == '' ? '' : `&import_status=${g.filters.import_status}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`

        const fetchData = await (await fetch(`${domain}get/imports?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function() {
        
        // update scroll data
        g.filters.page = 1
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        // get and print data
        g.imports = await this.getData()
        printImports()

        // unscroll
        table.scrollTop = 0
    },

    updatePoSummary: async function() {
        
        // fob
        const poFob = g.details.reduce((acc, { totalFob }) => acc + Number(totalFob || 0), 0)
        ceippFob.innerText = gg.formatter2.format(poFob)

        // boxes
        const poBoxes = g.details.reduce((acc, { boxes }) => acc + Number(boxes || 0), 0)
        ceippBoxes.innerText = gg.formatter2.format(poBoxes)
        
        // volume
        const poVolume = g.details.reduce((acc, { totalVolume }) => acc + Number(totalVolume || 0), 0)
        ceippVolume.innerText = gg.formatter2.format(poVolume)

        // weight
        const poWeight = g.details.reduce((acc, { totalWeight }) => acc + Number(totalWeight || 0), 0)
        ceippWeight.innerText = gg.formatter2.format(poWeight)
    }
}

export { utils }