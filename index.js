//
// UserManagement snap plugin
//

function add(params, cb) {
    var type = params[0];
    var name = params[1];

    if (type === 'user'){
      console.log('Adding User');
    }
    else if (type === 'group') {
      console.log('Adding Group');
    }
    else {
      return cb(new Error('Unknown type :' + type));
    }
  }

function usersLoad(opts, cb) {
    // Expose methods to Supervisor over RPC
    this.rpc.expose('dir', 'add', add.bind(this));

    // Inject client.js to the client
    this.plugins.injectClientSide(__dirname + '/client.js' );
    return cb();
  }

module.exports = {
    load: usersLoad
  };
