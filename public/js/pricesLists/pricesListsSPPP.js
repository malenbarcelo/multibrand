// import g from "./globals.js"
import { domain } from "../domain.js"
// import { gu } from "../globalUtils.js"
// import { utils } from "./utils.js"
// import gg from "../globals.js"

// select period popup (sppp)
async function spppEventListeners() {

    spppAccept.addEventListener('click', async () => {

        if (spppMonth.value == '' || spppYear.value == ''){
            spppError.classList.remove('not-visible')
            return
        }

        // print prices for customers in pdf
        loader.style.display = 'block'

        // get lists to print
        let listsToPrint = await (await fetch(`${domain}composed/get-lists-to-print`)).json()

        const zip = new JSZip()

        for (let i = 0; i < listsToPrint.length; i++) {

            const data = {
                id_prices_lists_name: listsToPrint[i].id,
                month: spppMonth.value,
                year: spppYear.value
            }

            const response = await fetch(domain + 'composed/print-pdf',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const blob = await response.blob()
                const fileName = 'Lista de precios ' + listsToPrint[i].price_list_name + ' - ' + data.month + ' ' + data.year + '.pdf'
                zip.file(fileName, blob)
            } else {
                console.error('Error al descargar el archivo:', response.statusText)
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = window.URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Listas de precios en PDF.zip'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        loader.style.display = 'none'

    })

     
}

export { spppEventListeners }