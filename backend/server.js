import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import https from 'https';
import fs from 'fs';
import http from 'http';
import fetch from 'node-fetch'; // ESM 스타일로 import

// self-signed certificate 오류 무시 설정
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 설정 강화
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
}));

app.get("/api/data", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({ message: "Hello from the backend!" });
});

// ✅ PHP 서버 실행
const phpServer = exec("php -S localhost:8000 -t ../frontend");

// ✅ PHP 서버 로그 처리
phpServer.stdout.on("data", (data) => {
    const message = data.trim();
    
    if (message.includes("Development Server")) {
        console.log(`✅ PHP Server Started: ${message}`);
    } else if (message.includes("[200]") || message.includes("Accepted") || message.includes("Closing")) {
        console.log(`📢 PHP Log: ${message}`);
    } else {
        console.error(`❌ PHP Error: ${message}`);
    }
});

// ✅ PHP 서버 오류 로그 처리
phpServer.stderr.on("data", (data) => {
    const message = data.trim();
    
    if (message.includes("[200]") || message.includes("Accepted") || message.includes("Closing") || message.includes("Development Server")) {
        console.log(`📢 PHP Log (stderr): ${message}`);
    } else {
        console.error(`❌ PHP Error: ${message}`);
    }
});

// ✅ 서버 종료 시 PHP 서버도 종료
const shutdownServers = () => {
    console.log("🛑 Shutting down servers...");
    phpServer.kill();
    process.exit();
};

process.on("SIGINT", shutdownServers); 
process.on("SIGTERM", shutdownServers); 

// 인증서 파일 경로 설정
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
    passphrase: '1820'
};

// HTTPS 서버 실행
https.createServer(options, app).listen(3000, () => {
    console.log('HTTPS Server running on https://localhost:3000');
});

// HTTP 서버로 리디렉션 처리
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://localhost:3000" });
    res.end();
}).listen(80, () => {
    console.log('Redirecting HTTP to HTTPS on port 80...');
});

// fetch로 API 호출
fetch('https://localhost:3000/api/data', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
