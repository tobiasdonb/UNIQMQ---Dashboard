const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const deviceManager = require('./src/services/DeviceManager');
const webRouter = require('./routes/web');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'unimq-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// Trace Middleware (Optional)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    res.locals.toast = req.session.toast || null;
    delete req.session.toast;
    res.locals.error = null;
    res.locals.page_title = 'Unimon Dashboard';
    res.locals.body_class = 'font-sans min-h-screen p-6';
    res.locals.base_url = '/';
    next();
});

// Routing
app.use('/', webRouter);
app.use('/api', apiRouter);

// Start MQTT Worker
(async () => {
    console.log('--- MQTT BACKGROUND WORKER STARTED ---');
    await deviceManager.syncDevices();
    setInterval(() => deviceManager.syncDevices(), 20000);
})();

app.listen(PORT, () => {
    console.log(`Express App listening on port ${PORT}`);
});
