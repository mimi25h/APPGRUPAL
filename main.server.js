const http = require("http");

function mainServer() {
  const HTTP_PORT = process.env.HTTP_PORT || 3000;

  // Crear servidor web.
  http
    .createServer((req, res) => {
      console.log("Se recibió petición http");

      // Configurar status y cabeceras de la respuesta.
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("Hola mundo");
    })
    .listen(HTTP_PORT, () => {
      console.log("Server HTTP http://localhost:" + HTTP_PORT);
    });
}

module.exports = mainServer;
