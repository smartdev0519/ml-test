import http from 'http';
import express from 'express';
import routes from './routes'
import cors from 'cors';
import timeout from 'connect-timeout'; 
import { createSocketServer } from './socket';

// App
const app = express();
const port = process.env.SERVICE_PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(timeout(1200000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

app.use('/', routes);

const server = http.createServer(app);

createSocketServer(server);

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});





