import * as socket from 'socket.io';
import * as redis from 'redis';


const io = socket(3333);

//will store a map between unique key and socket id
const clients = {};

//Clean Clients
function removeSocketIDIDFromClients(socketID) {
    for (var f in clients)
        if (clients[f] == socketID)
            delete clients[f];

    console.log(`Closed socket for ${socketID} entry removed from map`);
}


//Starting websocket server side
io.on('connection', (socket) => {
    console.log(`new socket for ${socket.id}`);

    socket.on('onRelUniqueID', (mess) => {
        clients[mess.uniqueID] = socket.id;
    })

    socket.on('disconnect', () => {
        removeSocketIDIDFromClients(socket.id);
    })

    socket.on('onEnterUpload', (mess) => {
        if (clients[mess.uniqueID] !== undefined)
            io.to(clients[mess.uniqueID]).emit('onStatusChanged', {status: 'sync'})
        console.log(`User sync upload page for ${mess.uniqueID}`);
    })
});

//Handling posted action received through redis channel
const redisClient = redis.createClient();
redisClient.on('message', (channel, message) => {
    let mess = JSON.parse(message);
    if (clients[mess.uniqueID] !== undefined)
        io.to(clients[mess.uniqueID]).emit('onStatusChanged', {status: mess.status, image: mess.image})

    console.log(`Received the following message from ${channel}: ${mess.uniqueID}`);
});

redisClient.subscribe('pix2desktop');