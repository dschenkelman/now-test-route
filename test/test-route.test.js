const testRoute = require('../lib/test-route');

const nowConfig =  {
    "version": 2,
    "name": "Test",
    "builds": [
        { "src": "./static/*/*", "use": "@now/static" },
        { "src": "./static/index.html", "use": "@now/static" },
        { "src": "./index.js", "use": "@now/node-server" }
    ],
    "routes": [
        { "src": "/", "dest": "/static/index.html" },
        { "src": "/(img|fonts|scripts|styles)/(.*)", "dest": "/static/$1/$2" },
        { "src": "/submit", "methods": ["POST"], "dest": "index.js" }
    ]
};

test('expect "POST /submit" to match "index.js" file and "@now/node-server" builder', () => {
    const result = testRoute('POST /submit', nowConfig, _ => true);
    expect(result).toEqual({
        fileFound: true,
        matchedBuilder: '@now/node-server',
        matchedFile: 'index.js'
    })
});

test('expect "/" to match "/static/index.html" file and "@now/static" builder', () => {
    const result = testRoute('/', nowConfig, _ => true);
    expect(result).toEqual({
        fileFound: true,
        matchedBuilder: '@now/static',
        matchedFile: '/static/index.html'
    })
});

test('expect "/img/couple.jpg" to match "/static/img/couple.jpg" file and "@now/static" builder', () => {
    const result = testRoute('/img/couple.jpg', nowConfig, _ => true);
    expect(result).toEqual({
        fileFound: true,
        matchedBuilder: '@now/static',
        matchedFile: '/static/img/couple.jpg'
    })
});

test('expect "img/couple.jpg" to NOT match because of missing trailing slash', () => {
    const result = testRoute('img/couple.jpg', nowConfig, _ => true);
    expect(result).toEqual({});
});

test('expect "/submit" to NOT match because of missing method', () => {
    const result = testRoute('/submit', nowConfig, _ => true);
    expect(result).toEqual({});
});

test('expect "/submit" to NOT match because of missing extension', () => {
    const result = testRoute('/index', nowConfig, _ => true);
    expect(result).toEqual({});
});

test('expect to call `matchedFileExists` function passing matched file', () => {
    const fileExists = jest.fn(path => false);
    const result = testRoute('/img/inexistent', nowConfig, fileExists);

    expect(result).toEqual({
        matchedFile: '/static/img/inexistent',
        matchedBuilder: "@now/static",
        fileFound: false
    });

    expect(fileExists.mock.calls.length).toBe(1);
    expect(fileExists.mock.calls[0][0]).toBe('/static/img/inexistent');
});