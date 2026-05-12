import { domain } from "../domain.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

const utils = {

    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.order == '' ? '' : `&order=${encodeURIComponent(g.filters.order)}`
        filters += g.filters.list_name == '' ? '' : `&list_name=${encodeURIComponent(g.filters.list_name)}`
        filters += g.filters.category_name == '' ? '' : `&category_name=${encodeURIComponent(g.filters.category_name)}`
        filters += g.filters.item_string == '' ? '' : `&item_string=${encodeURIComponent(g.filters.item_string)}`
        filters += g.filters.description == '' ? '' : `&description=${encodeURIComponent(g.filters.description)}`
        filters += g.filters.id_suppliers == '' ? '' : `&id_suppliers=${encodeURIComponent(g.filters.id_suppliers)}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`

        const fetchData = await (await fetch(`${domain}get/prices-lists?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    resetData: async function() {
        
        // update scroll data
        g.filters.page = 1
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        // get and print data
        g.data = await this.getData()
        printTable()

        // unscroll
        table.scrollTop = 0
    }
}

export { utils }