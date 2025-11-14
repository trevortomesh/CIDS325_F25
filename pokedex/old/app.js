const http = require('http');

const server = http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});

    if(req.url === '/'){
        res.end('<h1>Welcome to my rad Homepage!!!</h1>');
    } else if(req.url === '/about'){
        res.end('<h1>About My Rad Page!</h1>');
    } else{
        res.end('<h1>404 Page not found!</h1>');
    }
});

server.listen(3000, () =>{
    console.log("Routing server running on http://localhost:3000");
});

// var msg = "Hello World!";
// console.log(msg);

// const http = require('http');

// const server = http.createServer((req,res) => {
//     res.writeHead(200, {'Content-Type':'text/plain'});
//     res.end('Hello from the server!');
// });

// server.listen(3000, () =>{
//     console.log('Server running on http://localhost:3000');
// });
