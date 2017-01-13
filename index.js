var restify = require('restify');
var _ = require('lodash');

/** data **/
var events = require('./events');
var orders = require('./orders');

function respond(req, res, next) {
  res.send({hello: req.params.name});
  next();
}

var server = restify.createServer();
server.use(restify.CORS());

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
        'id', 'seller',
        'confirmation_number',
        'tickets',
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
