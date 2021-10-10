const http = require('http')
const fs = require('fs')
const path = require('path');

let currentDir = ''

const isFile = (fileName) => fs.lstatSync(fileName).isFile();

const toHtml = (objects) => {
    let result = '<html><body><ul>'
    if (currentDir.slice(-1) === '/') {
        currentDir = currentDir.slice(0,-1) // Небольшой костыль, надо убрать последний символ "/" иначе навигация вверх папки плохо работает
    }

    for (let i=0; i < objects.length; i++) {
        result += `<li><a href="${currentDir}/${objects[i]}">${objects[i]}</a></li>`
    }

    result += '</ul></body></html>'
    return result
}

const fileRead = (fileName, response) => {
    const data = fs.readFileSync(fileName, 'utf8')
    response.write(data)
}

const dirRead = (dirPath, response) => {
    const objects = ['..', ...fs.readdirSync(dirPath)]
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.write(toHtml(objects))

}

const server = http.createServer((request, response) => {
    const fullObjectPath = path.join(process.cwd(), request.url)
    currentDir = request.url
    if (fs.existsSync(fullObjectPath)) {
        isFile(fullObjectPath) ? fileRead(fullObjectPath, response) : dirRead(fullObjectPath, response)
    } else {
        response.statusCode = 404
        response.write('File not found')
    }
    response.end()
})

server.listen(3000)
