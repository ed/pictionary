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

    rooms = ["room1", "room2", "room3", "room4", "room5", "room6", "room7", "room8"]

    document.getElementById('joinroom').addEventListener('click', function() {
        console.log('join room');
    });

    document.getElementById('createroom').addEventListener('click', function() {
        console.log('create room');
    });

    $(document).on('click', '.currooms li', function() {
        console.log(this.innerHTML.replace(/(?:<i.*\/i>)/g,""));
    });

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

    function currentRooms() {
        var n = $.map(rooms, function(value) {
            return('<li><i class="fa fa-coffee" aria-hidden="true"></i>'
                   + value + '</li>');
        });
        $(".currooms").html(n.join(""));
    }

    function setUser() {
        username = cleanInput($nameInput.val().trim());
        if (username) {
            $login.fadeOut();
            $rooms.show();
            $login.off('click');
            $current = $input.focus();
            socket.emit('add user', username);
            currentRooms();
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
