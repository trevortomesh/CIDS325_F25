var msg = "Hello World!";
console.log(msg);

let http = require('http');
http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('Hello World!');
}).listen(8080);