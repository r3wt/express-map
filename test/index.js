
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


// should throw exception
//app.map('','');

// should throw exception.. for now
// app.map(['GET /error-1 = books.list']);

// should throw exception - missing path
// app.map({
	// 'GET':'test'
// });

// should throw exception - missing verb
// app.map({
	// 'GET':'test'
// });


app.listen(3000);