import { domain } from "../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const utils = {

    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`
        filters += g.filters.id_suppliers == '' ? '' : `&id_suppliers=${g.filters.id_suppliers}`
        filters += g.filters.item_string == '' ? '' : `&item_string=${g.filters.item_string}`
        filters += g.filters.description == '' ? '' : `&description=${g.filters.description}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`

        const fetchData = await (await fetch(`${domain}get/master?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function() {
        
        // update scroll data
        g.filters.page = 1
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        // get and print data
        g.master = await this.getData()
        printTable()

        // unscroll
        table.scrollTop = 0
    }
}

export { utils }