supervisor.server.call('user', 'add', 'toto', 'titi', function (err){
        console.log(arguments);
   })
supervisor.server.call('group', 'add', 'tata', function (err){
        console.log(arguments);
   })
supervisor.bridge('users', 'add');
supervisor.bridge('groups', 'add');
