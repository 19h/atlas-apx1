var fs = require("fs"), http = require("http"), path = require("path");
var mime = require("mime");

var hero = fs.readFileSync("./hero.html");

var nop = new Function;

if (!(fs.existsSync("./atlas") && fs.statSync("./atlas").isDirectory()))
	return console.log("Atlas, where are you? :-(");

var host = process.env.dev ? "127.0.0.1" : "176.9.25.72",
    base = process.cwd() + "/atlas";

var _bail = function (res) {
	return function () {
		return res.writeHead(404), res.end("File not found.");
	}
}

http.createServer(function (req, res) {
	if (req.host === "r1.geoca.st")
		return res.writeHead(200, {
			"Content-type": "text/html"
		}), res.end(hero);

	if (req.url === "/") req.url += "index.html";

	var url = path.join(base, req.url);

	if (!url.indexOf(base)) {
		var _s = fs.createReadStream(url);
		
		_s.on("error", _bail(res));
		
		return _s.on("open", function () {
			return res.writeHead(200, {
				"Content-type": mime.lookup(url)
			}), _s.pipe(res);
		});
	}

	_bail(res)();
}).listen(80, host);