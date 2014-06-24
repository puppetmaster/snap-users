//
// UserManagement snap plugin
//
var crypto = require('crypto');
var algo = 'sha512';
var key = 'snap!|&;)45';
var encoding = 'hex';

function cryptPassword(password, cb) {
    var hmac = crypto.createHmac(algo, key);
    hmac.setEncoding(encoding);
    hmac.write(password);
    hmac.end();
    return hmac.read();
  }


function User(store){
    this._store = store;
  }

var pUser = User.prototype;

pUser.add = function (params, cb) {
    var name = params[0];
    var pass = params[1];

    this._store.get(name, function (err, fUser){
        if (err) {
          if (err.name === 'NotFoundError') {
            fUser = null;
          } else {
            return cb(err);
          }
        } 
        if (fUser) {
          console.log('User exists ' + fUser.name);
          return cb(null, fUser);
        } else {
           // handle a 'NotFoundError' here
          user = {};
          user.name = name;
          user.pass = cryptPassword(pass);
          console.log('Adding User ' + name);
          return this._store.put(name, user, cb);
        }
      });
    return cb();
  };

function Group(store){
    this._store = store;
  }

var pGroup = Group.prototype;

pGroup.add = function (params, cb) {
    var name = params[0];

    this._store.get(name, function (err, fGroup){
        if (err) {
          if (err.name === 'NotFoundError') {
            fGroup = null;
          } else {
            return cb(err);
          }
        } 
        if (fGroup) {
          console.log('Group exists ' + fUser.name);
          return cb(null, fGroup);
        } else {
           // handle a 'NotFoundError' here
          group = {};
          group.name = name;
          group.members = [];
          console.log('Adding Group ' + name);
          return this._store.put(name, group, cb);
        }
      });
    console.log("ICI")
    return cb();
  };

function usersLoad(opts, cb) {
    var usersStore = this.storage.getPluginStore('snap-users');
    var groupStore = this.storage.getPluginStore('snap-groups');
    console.log('Loading users module');

    var user = new User(usersStore);
    var group = new Group(groupStore)

    // Expose methods to Supervisor over RPC
    this.rpc.expose('user', 'add', user.add.bind(user));
    this.rpc.expose('group', 'add', group.add.bind(group));

    // Inject client.js to the client
    this.plugins.injectClientSide(__dirname + '/client.js' );
    return cb();
  }

module.exports = {
    load: usersLoad
  };
