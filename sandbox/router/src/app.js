import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(morgan('combined'))

app.get('/api/status/healthz', (req, res) => {// server zinda hai ya nahi ye check karne ke liye healthz endpoint banaya hai
    res.status(200).json({ status: 'ok' });
});

app.get('/api/status/readyz', (req, res) => {// server ready hai ya nahi ye check karne ke liye readyz endpoint banaya hai
    res.status(200).json({ status: 'ready' });
});

const proxies = {};
const agentProxies = {};

function getProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}`// constructed target URL based on the sandbox ID

    if(!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,

})
    }
return proxies[sandboxId];
}

function getAgentProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}:3000`// constructed target URL based on the sandbox ID

    if(!agentProxies[sandboxId]) {
        agentProxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,

})
    }
return agentProxies[sandboxId];
}


app.use((req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split('.')[0];// extract the sandbox ID from the host header

    // pod1.preview.localhost
    //pod1.agent.localhost

    if(host.split('.')[1] === 'agent') {
        return getAgentProxy(sandboxId)(req, res, next);
    }  
    else if(host.split('.')[1] === 'preview') {
        return getProxy(sandboxId)(req, res, next);
    }

    return getProxy(sandboxId)(req, res, next);
 });


export default app;