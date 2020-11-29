'use strict';

const socket = require('../modules/socket');

((helper) => {
    let socketObj = {};
    let generateMessage = (from, text) => {
        return {
            from,
            text,
            createdAt: new Date()
        };
    };

    helper.init = async (server) => {
        try {
            const io = require('socket.io')(server);
            socketObj = io
            return socketObj
        } catch (error) {
            throw error
        }
    }

    helper.connect = async (server, users) => {
        try {
            await helper.init(server)
            socketObj.on('connection', (socket) => {
                console.log("A new user just connected");

                socket.on('join', (params, callback) => {
                    socket.join(params.room);
                    users.removeUser(socket.id);
                    users.addUser(socket.id, params.name, params.room);

                    socketObj.to(params.room).emit('updateUsersList', users.getUserList(params.room));
                    socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));
                    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New User Joined!"));

                    callback();
                })

                socket.on('createMessage', (message, callback) => {
                    let user = users.getUser(socket.id);
                    callback('This is the server:');
                })

                socket.on('createLocationMessage', (coords) => {
                    let user = users.getUser(socket.id);

                    if (user) {
                        socketObj.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng))
                    }
                })

                socket.on('disconnect', () => {
                    let user = users.removeUser(socket.id);

                    if (user) {
                        socketObj.to(user.room).emit('updateUsersList', users.getUserList(user.room));
                        socketObj.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
                    }
                });
            });
        } catch (error) {
            throw error
        }
    }

    helper.broadcast = (message) => {
        try {
            message = {
                from: "Broadcast Message",
                text: message.message,
                createdAt: new Date()
            };
            socketObj.emit('newMessage', message);
            return true
        } catch (error) {
            throw error
        }
    }

})(module.exports);