# now-test-route
A CLI to test if a URL path will match a route, a builder and a file based on a **now.json** v2 file and a file system state.

## Install
```bash
npm i -g now-test-route
```

## Usage
```bash
now-test-route <route> [--config {nowJson}]
```

* `<route>` - The route you want to test. Examples `/img/logo.png` or `POST /submit`.
* `nowJson` - (**optional**) The path to the now.json file with your config. If no path is provided, the `now.json` file will be looked up in the current directory.

## Examples
Consider the following file system structure:
``` bash
➜  wedding git:(route-playground) ✗ tree -I node_modules
.
├── app.yaml
├── google.js
├── index.js
├── now.json
├── package-lock.json
├── package.json
├── static
│   ├── fonts
│   │   └── amarillo.otf
│   ├── img
│   │   ├── couple.jpg
│   ├── index.html
│   ├── scripts
│   │   ├── main.js
│   │   └── vendor.js
│   └── styles
│       ├── styles.css
```

And this `now.json` file:
```bash
➜  wedding git:(route-playground) ✗ cat now.json 
{
    "version": 2,
    "name": "Wedding",
    "builds": [
        { "src": "./static/*/*", "use": "@now/static" },
        { "src": "./static/index.html", "use": "@now/static" },
        { "src": "./index.js", "use": "@now/node-server" }
    ],
    "routes": [
        { "src": "/", "dest": "/static/index.html" },
        { "src": "/(img|fonts|scripts|styles)/(.*)", "dest": "/static/$1/$2" },
        { "src": "/submit", "methods": ["POST"], "dest": "index.js" }
    ],
    "regions": ["gru", "sfo1"]
}
```

### index.html
Test getting what `/` is routed to:
```bash
➜  wedding git:(route-playground) ✗ now-test-route /
SUCCESS: 
      matched input route / 
      to file /static/index.html 
      with builder @now/static
```

### /submit
Test what `POST /submit` is routed to:
```bash
➜  wedding git:(route-playground) ✗ now-test-route POST /submit
SUCCESS: 
      matched input route POST /submit 
      to file index.js 
      with builder @now/node-server
```

## License
MIT