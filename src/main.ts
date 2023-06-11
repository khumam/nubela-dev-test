import * as net from 'net';
import lambdaCalculus from './lambdaCalculus';

const args: any = process.argv.slice(2);
const socketPath = args[0] || "/var/run/dev-test/sock";

interface Request {
  id: string | number
  method: string 
  params: any
}

interface Response {
  id: string | number
  result: any
}

const isValidJson = (request: string) => {
  try {
    JSON.parse(request);
    return true;
  } catch (err) {
    return false;
  }
}

const server: any = net.createServer((socket: any) => {
  let mergedRequest: string = "";

  socket.on('data', (req: any) => {
    if (typeof req === "object" && isValidJson(req)) {
      const request: Request = JSON.parse(req.toString());
      if (request.method === "echo") {
        const result: Response = {
          id: request.id,
          result: request.params
        }
        socket.write(JSON.stringify(result) + "\n");
      } else if (request.method === "evaluate") {
        const expression = lambdaCalculus(request);
        const result: Response = {
          id: request.id,
          result: {
            expression
          }
        }
        socket.write(JSON.stringify(result) + "\n");
      }
    } else {
      if (/\n/.exec(req.toString())) {
        const splitedReqWithLineBreak = req.toString().split(/\n/);
        mergedRequest = mergedRequest + splitedReqWithLineBreak[0];
        if (isValidJson(mergedRequest)) {
          const request: Request = JSON.parse(mergedRequest)
          const result: Response = {
            id: request.id,
            result: request.params
          }
          socket.write(JSON.stringify(result) + "\n");
        }
        mergedRequest = splitedReqWithLineBreak[1];
      } else {
        mergedRequest = (mergedRequest.includes(req.toString)) ? req.toString() : mergedRequest + req.toString();
      }
    }
  })

  socket.on('error', (err: any) => {
    console.log('Socker error:', err);
    process.exit(0);
  })
});

server.on('error', (err:any) => {
  console.error('Server error:', err);
  process.exit(0);
});

server.listen(socketPath);