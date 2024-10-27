const http = require('http');
const fs = require('fs');
const _lo = require('lodash');
const dotenv = require('dotenv');
dotenv.config();

const server = http.createServer((req, res) => {
  console.log('request made');

  //set header content type
  res.setHeader('content-Type', 'text/html');

  //simple routing system
  let path = './views/'; //files to be read are in views folder

  switch (req.url) {
    case '/':
      path += 'index.html';
      res.statusCode = 200;
      break;

    case '/about':
      path += 'about.html';
      res.statusCode = 200;
      break;

    case '/about-us':
      path += 'about.html';
      res.statusCode = 301;
      res.setHeader('Location', '/about'); //redirect
      res.end();
      break;

    default:
      path += '404.html';
      res.statusCode = 404;
      break;
  }

  //send an html file
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      //res.write(data);
      res.end(data);
    }
  });
});

server.listen(3001, 'localhost', () => {
  console.log('listening for request');
});
