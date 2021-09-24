const prompt = require('prompt')
const colors = require('colors')

const schema = {
    properties: {
        numStart: {
            description: 'Enter first number (numStart)',
            required: true,
            pattern: /^[0-9]*$/,
            message: 'numStart must be only positive number'
        },
        numEnd: {
            description: 'Enter second number (numEnd)',
            required: true,
            pattern: /^[0-9]*$/,
            message: 'numEnd must be only positive number',
        }
    }
}

const simpleNums = (numStart, numEnd) => {
    let result = []
    for (let i = numStart; i <= numEnd; i++) {
        let flag = true
        for (let k = 2; k < i; k++) {
            if (i % k === 0) {
                flag = false
            }
        }
        if (flag) {
            result.push(i)
        }
    }
    return result
}

const colorizeOutput = (numbers) => {
    for (let i=0; i< numbers.length; i++) {
        switch ( (i + 1) % 3 ) {
            case 0:
                console.log(colors.red(numbers[i]));
                break
            case 1:
                console.log(colors.green(numbers[i]));
                break
            case 2:
                console.log(colors.yellow(numbers[i]))
        }
    }
}

prompt.start()

prompt.get(schema, (err, result) => {
    if (err) {
        console.error(err)
    } else {
        const numStart = +result.numStart
        const numEnd = +result.numEnd

        if (numEnd <= numStart ) {
            console.log("Wrong! numEnd is lower than numStart.")
        } else {
            const numbers = simpleNums(numStart, numEnd)
            if (numbers.length === 0) {
                console.log(colors.red("There are not simple numbers in the range"))
            } else {
                colorizeOutput(numbers)
            }
        }
    }
})
