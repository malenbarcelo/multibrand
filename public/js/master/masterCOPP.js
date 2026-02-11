import g from "./globals.js"
import { domain } from "../domain.js"
import { gu } from "../globalUtils.js"
import { utils } from "./utils.js"

// confirm popup (copp)
async function coppEventListeners() {

    coppAccept.addEventListener('click',async()=>{

        loader.style.display = 'block'
        ceipp.style.display = 'none'
        copp.style.display = 'none'

        if (g.confirmation == 'deleteItem') {

            const data = {
                condition: 'id',
                data:[{
                    id: g.elementToEdit.id,
                    dataToUpdate: { enabled: 0}
                }]
            }

            const response = await fetch(domain + 'update/master',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                
            const responseData = await response.json()

            // show result
            if (responseData.response == 'ok') {
                okText.innerText = 'Item eliminado con éxito'
                gu.showResultPopup(okPopup)                
            }else{
                errorText.innerText = 'Error al eliminar el item'
                gu.showResultPopup(errorPopup)
            }

            // reset data
            await utils.resetData()
            loader.style.display = 'none'

        }
    })
}

export { coppEventListeners }