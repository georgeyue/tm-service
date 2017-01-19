var restify = require('restify');
var _ = require('lodash');
var fs = require('fs');

/** data **/
var events = require('./events');
var orders = require('./orders');

function respond(req, res, next) {
  res.send({hello: req.params.name});
  next();
}

var server = restify.createServer();

server.get('/hi', function(req, res, next) {
  var file = fs.readFileSync('./index.html', 'utf-8');

  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(file),
    'Content-Type': 'text/html'
  });
  res.write(file);
  res.end();

});

server.get('/orders/:id', function(req, res, next) {
  res.send( _.find(orders, {id: parseInt(req.params.id)}) );
  next();
});

server.get('/event/:id', function(req, res, next) {
  res.send( _.find(events, {id: parseInt(req.params.id)}) );
  next();
});

server.get('/orders', function(req, res, next) {
  var data = orders.map(
    function(item) {
      return _.pick(item, [
        'id',
        'confirmation_number',
        'order_type',
        'delivery_id',
        'event_id'
      ]);
    }
  );

  res.send(data);
  next();
});

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(process.env.PORT || 8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
