const app = require('./startup/app');
const { WS_PORT, PORT, SOCKET_PORT } = process.env;
const client = require('socket.io')(SOCKET_PORT, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

require('./startup/db')();
require('./routes')(app);
require('./sockets')(client);


app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));