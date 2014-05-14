//
// UserManagement snap plugin
//
var crypto = require('crypto');
var algo = 'sha512';
var key = 'snap!|&;)45'
var encoding = 'hex';

function cryptPassword(password, cb) {
    var hmac = crypto.createHmac(algo, key);
    hmac.setEncoding(encoding);
    hmac.write(password);
    hmac.end();
    return hmac.read()
}


function User(store){
    this._store = store;
   }

var pUser = User.prototype;

pUser.add = function (params, cb) {
    var type = params[0];
    var name = params[1];
    var pass = params[2];

    if (type === 'user'){
      this._store.get(name, function (err, value){
          if (err) {
            if (err.notFound) {
                // handle a 'NotFoundError' here
                return
            }
            // I/O or other error, pass it up the callback chain
            return callback(err)
          }
        });
      user = {};
      user['name'] = name;
      user['password'] = cryptPassword(pass);
      user['type'] = 'user';
      console.log('Adding User');
      this._store.put(name, user, cb);
    else {
          return cb(new Error('User allready exists'))
      }
    }
    else if (type === 'group') {
      console.log('Adding Group');
      return cb()
    }
    else {
      return cb(new Error('Unknown type :' + type));
    }
  }

function usersLoad(opts, cb) {
    var usersStore = this.storage.getPluginStore('snap-users');
    console.log("Loading users module");

    var user = new User(usersStore)

    // Expose methods to Supervisor over RPC
    this.rpc.expose('user', 'add', user.add.bind(user));

    // Inject client.js to the client
    this.plugins.injectClientSide(__dirname + '/client.js' );
    return cb();
  }

module.exports = {
    load: usersLoad
  };
