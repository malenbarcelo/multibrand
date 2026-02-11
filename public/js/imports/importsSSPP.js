import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { printDetails } from "./printDetails.js"

// select supplier popup (sspp)
async function ssppEventListeners() {

    ssppSupplier.addEventListener('change',async()=>{
        ssppError.classList.add('not-visible')
    })

    // add item
    ssppAccept.addEventListener('click',async()=>{

        let errors = 0

        // find supplier items
        const supplierItems = await (await fetch(`${domain}get/master?id_suppliers=${ssppSupplier.value}&enabled=1`)).json()
        g.supplierItems = supplierItems.rows

        if (ssppSupplier.value == '') {
            errors += 1
            ssppError.innerText = 'Debe seleccionar una opción'
            ssppError.classList.remove('not-visible')            
        }else{
            
            if (g.supplierItems.length == 0) {
                errors += 1
                ssppError.innerText = 'El proveedor seleccionado no contiene lista de precios'
                ssppError.classList.remove('not-visible')
            }
        }

        if (errors == 0) {

            // hide error
            ssppError.classList.add('not-visible')

            // action and title
            g.action = 'create'
            g.supplierData = g.suppliers.find( s => s.id == ssppSupplier.value)

            ceippTitle.innerText = 'CREAR ORDEN DE COMPRA - ' + g.supplierData.supplier.toUpperCase()

            // complete poNumber
            const poNumber = await (await fetch(`${domain}composed/get-new-po-number`)).json()
            ceippPo.value = poNumber

            // hide errors and clear data
            ceippError.innerText = ''
            gu.clearInputs([ceippItem, ceippQty])
            g.details = []

            // print table
            printDetails()

            // hide popup
            sspp.style.display = 'none'
        
            // show popup
            ceipp.style.display = 'block'
        }
    })
}

export { ssppEventListeners }