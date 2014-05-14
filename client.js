supervisor.server.call('user', 'add', 'user', 'toto', 'titi', function (err){
        console.log(arguments)
   })
supervisor.bridge('users', 'add');
