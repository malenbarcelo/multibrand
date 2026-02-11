const utils = {
    specialChars: (value) => {
        if (typeof value !== 'string') return value // Solo procesa si es string
        return value.replace(/[%_]/g, char => `\\${char}`)
    },
    round: (number, decimals) => {

        const rounded = Math.round((number + Number.EPSILON) * 10 ** decimals) / 10 ** decimals

        return rounded
    }
}

module.exports = utils

