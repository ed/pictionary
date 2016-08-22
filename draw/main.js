var app = angular.module('p1',[]);

app.factory('socket', function(){
  return io.connect('http://localhost:3000');
});


app.controller('AppCtrl', function($scope, socket){
  $scope.msgs = [];

  $scope.newUser = function() {
    socket.emit ('adduser', $scope.newName);
    $scope.name = $scope.newName;
    $scope.newName = '';
  }

  $scope.sendMsg = function() {
    socket.emit('send msg', $scope.chatMsg);
    $scope.chatMsg = '';
  }
  socket.on('get msg', function(msg) {
    $scope.msgs.push({
      user: $scope.name,
      text: msg
    });
    $scope.$digest();
  });
});
