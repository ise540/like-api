const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const server = http.createServer();
const PORT = process.env.PORT || 8080;

const jsonPath = path.resolve(__dirname, 'likes.json');


server.listen(PORT);

const emit = server.emit;
server.emit = function(event){
    console.log(event);
    emit.apply(server, arguments);
}

server.on('request', function (req, res) {
    fs.readFile(jsonPath, (err, data)=>{
        if(err) {
            throw new Error(err);
        }

        const jsonObj = JSON.parse(data);
        const urlParsed = url.parse(req.url).pathname;

        switch (urlParsed) {
            case '/like':
                jsonObj.likes++;
                fs.writeFile(jsonPath, JSON.stringify(jsonObj), (err) => {
                    if(err) throw new Error(err);
                })
                res.end(JSON.stringify(jsonObj));
                break;
            case '/dislike':
                jsonObj.likes--;
                fs.writeFile(jsonPath, JSON.stringify(jsonObj), (err) => {
                    if(err) throw new Error(err);
                })
                res.end(JSON.stringify(jsonObj));
                break;
            case '/stats':
                res.end(JSON.stringify(jsonObj));
                break;
            default:
                res.statusCode = 404;
                res.end('Not Found');
        }
    })
})