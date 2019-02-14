const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';

server.liste(port, ip, ()=> console.log(`Server is lsitening on port ${port}`))
