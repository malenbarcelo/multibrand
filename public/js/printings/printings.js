import { domain } from "../domain.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // print prices for customers in excel
    printExcel.addEventListener('click',async()=>{
        
        loader.style.display = 'block'

        let listsToPrint = await (await fetch(`${domain}get/prices-lists-to-print`)).json()
        listsToPrint = listsToPrint.rows

        const zip = new JSZip()

        for (let i = 0; i < listsToPrint.length; i++) {

            const data = listsToPrint[i]
            const response = await fetch(domain + 'composed/print-excel',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const blob = await response.blob()
                const fileName = 'Lista de precios ' + listsToPrint[i].price_list_name + ' - Febrero 2026.xlsx'
                zip.file(fileName, blob)
            } else {
                console.error('Error al descargar el archivo:', response.statusText)
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = window.URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Listas de precios.zip'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        loader.style.display = 'none'
    })

    loader.style.display = 'none'
    
})





