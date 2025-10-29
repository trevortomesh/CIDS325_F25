const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url, true).query;

    res.writeHead(200, {'Content-Type' : 'text/html'});

    if(queryObject.name){
        res.end(`<h1>Hello, ${queryObject.name}!</h1>`);
    }else{
        res.end(`<h1>Welcome! Add ?name=YourName to the URL</h1>`);
    }
});

server.listen(3000, () =>{
    console.log('Interactive server running on http://localhost:3000');
});