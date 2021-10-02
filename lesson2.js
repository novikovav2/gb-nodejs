const prompt = require('prompt')
const moment = require("moment");
const EventEmitter = require('events');

const emitter = new EventEmitter();
let intervalId

const schema = {
    properties: {
        data: {
            description: 'Enter timestamp (format hh-mi-ss-dd-mm-yyyy)',
            required: true,
            pattern: /^\d\d-\d\d-\d\d-\d\d-\d\d-\d\d\d\d$/,
            message: 'format must be hh-mi-ss-dd-mm-yyyy'
        }
    }
}

const timeIsOver = (payload) => {
    console.log("Your time ", payload, "is now...")
    clearInterval(intervalId)
}

const timer = (str) => {
    console.clear()
    const currentTimestamp = moment()
    const endTimestamp = moment(str, "HH-mm-ss-DD-MM-YYYY")

    if (endTimestamp.isAfter(currentTimestamp)) {
        console.log(endTimestamp.fromNow())
    } else {
        emitter.emit('timeIsOver', endTimestamp)
    }


}


const run = () => {
    prompt.start()

     prompt.get(schema, (err, result) => {
        if (err) {
            console.error(err)
        } else {
            intervalId = setInterval(() => timer(result.data), 1000)
        }
    })
}

emitter.on('timeIsOver', timeIsOver)
run()
