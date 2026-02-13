import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { printDetails } from "./printDetails.js"

// create edit item popup (ceipp)
async function eippEventListeners() {

    // accept
    eippAccept.addEventListener('click',async()=>{

        loader.style.display = 'block'

        if (eippFob.value == '' || eippQty.value == '') {
            eippError.classList.remove('not-visible')
            loader.style.display = 'none'
        }else{

            const item = g.details.find( d => d.item == g.itemToEdit.item)
            item.fob = Number(eippFob.value.replace(',','.'))
            item.mu_quantity = Number(eippQty.value.replace(',','.'))
            eipp.style.display = 'none'
            printDetails()
            loader.style.display = 'none'
            
        }
    })

    
}

export { eippEventListeners }