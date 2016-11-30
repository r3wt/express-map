# express-map2 ( not to be confused with Yahoo's `express-map` package which does a totally different thing )

adds map() function to express. 

# install
---

` npm install --save express-map2 `

# usage

```js

var app = require('express'); // 1. include express


app.set('controllers',__dirname+'/controllers/');// 2. set path to your controllers.

require('express-map')(app); // 3. patch map into express


// 4. go to town!

// no prefix. 
app.map({
	'GET /':'test',
	'GET /foo':'middleware.foo,test',
	'GET /bar':'middleware.bar,test'// seperate your handlers with a comma. 
});


// with prefix
app.map('/api/v1/books',{
    'GET /': 'books.list',
    'GET /:id': 'books.loadOne',
    'DELETE /:id': 'books.delete',
    'PUT /:id': 'books.update',
    'POST /': 'books.create'
});

app.listen(3000);

```

# testing
---

> testing is done with mocha. to run tests:

1. clone the repo `git clone https://github.com/r3wt/express-map.git`
2. change into project directory install dependencies `npm install`
3. make sure to have mocha installed globally `npm install --global mocha`.
4. run tests with `npm test`

