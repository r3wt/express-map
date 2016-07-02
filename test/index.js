
var app = require('express')();

app.set('controllers',__dirname +'/controllers/');

require('../index')(app);


app.map({
	'GET /':'test',
	'GET /foo':'middleware.foo,test',
	'GET /bar':'middleware.bar,test'
});

app.map('/books',{
    'GET /': 'books.list',
    'GET /:id': 'books.loadOne',
    'DELETE /:id': 'books.delete',
    'PUT /:id': 'books.update',
    'POST /': 'books.create'
});

app.listen(3000);