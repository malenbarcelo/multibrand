import gg from "./globals.js"

const gu = {
    
    closePopups: function(popups) {
        popups.forEach(popup => {
            const closeIcon = document.getElementById(popup.id + 'Close')
            const cancelIcon = document.getElementById(popup.id + 'Cancel')
            if (closeIcon) {
                closeIcon.addEventListener("click", async() => {
                    popup.style.display = 'none'
                })
            }
            if (cancelIcon) {
                cancelIcon.addEventListener("click", async() => {
                    popup.style.display = 'none'
                })
            }
        })
    },

    closeWithEscape: function(popups) {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const displayedPopups = popups.filter(p => p.style.display == 'block' || p.classList.contains('slideIn'))
                if (displayedPopups.length > 0) {
                    if (displayedPopups[0].style.display == 'block') {
                        displayedPopups[0].style.display = 'none'
                    } else {
                        displayedPopups[0].classList.remove('slideIn')
                    }
                }
            }
        })
    },

    showResultPopup: function(popupToShow) {

        popupToShow.classList.add('okSlideIn')

        //hide okPopup after one second
        setTimeout(function() {
            popupToShow.classList.remove('okSlideIn')
        }, 4000)    
    },

    clearInputs: function(inputs) {
        inputs.forEach(input => {
            if (input) {
                input.value = ''
            }
        })
        this.isValid(inputs)
    },

    validations: function(input,validations) {

        let errors = 0

        // isEmpty
        const isEmpty = validations.filter( v => v.validation == 'isEmpty')

        if (isEmpty.length > 0 && input.value == '') {
            errors += 1
            this.isInvalid([input],isEmpty[0].text)
            return errors
        }

        // isEmail
        const isEmail = validations.filter( v => v.validation == 'isEmail')

        if (isEmail.length > 0) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const validateEmail = emailPattern.test(input.value)
            if (!validateEmail) {
                errors += 1
                this.isInvalid([input],isEmail[0].text)
                return errors
            }
        }

        // isPassword
        const isPassword = validations.filter( v => v.validation == 'isPassword')

        if (isPassword.length > 0 && input.value.length < 4) {
            errors += 1
            this.isInvalid([input],isPassword[0].text)
            return errors
        }

        // existingData
        const existingData = validations.filter( v => v.validation == 'existingData')

        if (existingData.length > 0 && existingData[0].result) {
            errors += 1
            this.isInvalid([input],existingData[0].text)
            return errors
        }

        // noFile
        const noFile = validations.filter( v => v.validation == 'noFile')

        if (noFile.length > 0 && input.files.length == 0) {
            errors += 1
            this.isInvalid([input],noFile[0].text)
            return errors
        }

        // allowed extensions
        const allowedExtensions = validations.filter( v => v.validation == 'allowedExtensions')


        if (allowedExtensions.length > 0 && input.files.length > 0) {
            const fileName = ulppFile.files[0].name
            const fileExtension = fileName.split('.').pop().toLowerCase()
            if (!allowedExtensions[0].allowedExtensions.includes(fileExtension)){
                errors += 1
                this.isInvalid([input],allowedExtensions[0].text)
                return errors
            }
        }

        // // noSelection
        // const noSelection = validations.filter( v => v.validation == 'noSelection')

        // if (noSelection.length > 0 && validations[0].selection.length == 0) {
        //     validations[0].error.innerText = validations[0].text
        //     return errors
        // }

        //validate input
        if (errors == 0) {
            this.isValid([input])
            
        }

        return errors
        
    },

    isValid: function(inputs) {
        inputs.forEach(input => {
            if (input) {
                const label = document.getElementById(input.id + 'Label')
                const error = document.getElementById(input.id + 'Error')
                input.classList.remove('invalid-input')
                if (label) {
                    label.classList.remove('invalid-label')
                }            
                if (error) {
                    error.style.display = 'none'
                }   
            }
        })    
    },

    isInvalid: function(inputs, errorText) {

        inputs.forEach(input => {
            const label = document.getElementById(input.id + 'Label')
            const error = document.getElementById(input.id + 'Error')
            input.classList.add('invalid-input')
            
            if (label) {
                label.classList.add('invalid-label')
            }
            if (error) {
                error.innerText = errorText
                error.style.display = 'block'
            }        
        })    
    },

    changePagesStyles: function(page,pages) {

        if (page == 0 && pages == 0) {
            nextPage.style.color = 'grey'
            nextPage.style.cursor = 'auto'
            previousPage.style.color = 'grey'
            previousPage.style.cursor = 'auto'
        }else{
            //next page
            if (page == pages) {
                nextPage.style.color = 'grey'
                nextPage.style.cursor = 'auto'
            } else {
                nextPage.style.color = 'black'
                nextPage.style.cursor = 'pointer'
            }

            //previous page
            if (page == 1) {
                previousPage.style.color = 'grey'
                previousPage.style.cursor = 'auto'
            } else {
                previousPage.style.color = 'black'
                previousPage.style.cursor = 'pointer'
            }
        }
    },

    showTooltips: function(tooltips,top,width) {

        tooltips.forEach(element => {
            const info = document.getElementById(element.icon.id.replace('Icon','Info'))
            element.icon.addEventListener("mouseover", async(e) => {
                info.style.top = top + 'px'
                info.style.right = element.right
                
                info.style.width = width + 'px'
                info.style.display = 'block'
            })
            element.icon.addEventListener("mouseout", async(e) => {
                info.style.display = 'none'
            })
        })
    },

    ignoreDoubleClick: function() {

        const now = new Date().getTime()

        if (now - gg.lastClickTime < 400) {
            return  true // Ignore double click
        }

        gg.lastClickTime = now

        return false
    },

    acceptWithEnterInput: function(input,button) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (button.classList.contains('flex-c') || button.classList.contains('flex-r') || button.style.display == 'flex' || button.style.display == 'block')) {
                button.click()
            }
        })
    },

    uncheckAll: function(checks) {        
        checks.forEach(check => {
            check.checked = false
            
        })
    },

    checkAll: function(checks) {        
        checks.forEach(check => {
            check.checked = true
            
        })
    },

    replaceDotWithComa: function(inputs, decimals) {
        
        inputs.forEach(input => {

            input.addEventListener('input', () => {
                
                // if '.' or ',' put ','
                let value = input.value
                    .replace(/[^0-9.,]/g, '')   // permite punto y coma
                    .replace(/\./g, ',')        // punto → coma
                    .replace(/(,.*),/g, '$1')   // una sola coma

                // decimals
                if (value.includes(',')) {
                    const [int, dec] = value.split(',')

                    if (dec.length > decimals) {
                        const num = Number((int + '.' + dec))
                        value = num.toFixed(decimals).replace('.', ',')
                    }
                }

                input.value = value

            })
        })
    },
}

export { gu }

