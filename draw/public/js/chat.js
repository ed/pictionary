$(document).ready(function() {

    var $window = $(window);
    var $messages = $('.messages');
    var $nameInput = $('.username');
    var $input = $('.input');
    var $login = $('.login.page');
    var $chat = $('.chat');
    var $rooms = $('.room.page');
    var $current = $nameInput.focus();

    var username;
    var connected = false;
    var typing = false;

    var socket = io();

    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }

    $(document).keypress(function(e) {
        if (e.which == 13) {
            if (username) {
                sendMessage();
                typing = false;
            }
            else {
                setUser();
            }
        }
    });

    function sendMessage() {

    }

    function setUser() {
        username = cleanInput($nameInput.val().trim());
        if (username) {
            $login.fadeOut();
            $rooms.show();
            $login.off('click');
            $current = $input.focus();
            socket.emit('add user', username);
        }
    }

    $('#user').submit(function(){
        socket.emit('adduser', $('#n').val());
        return false;
    });
    $('#send').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

});
