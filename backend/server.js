const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 설정
app.use(cors());

// ✅ JSON 요청을 처리할 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API 라우트 (Node.js API)
app.get("/api/data", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

// ✅ 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 Node.js Server is running on http://localhost:${PORT}`);
});

// ✅ PHP 서버 실행
const phpServer = exec("php -S localhost:8000 -t ../frontend");

// ✅ PHP 서버 로그 처리
phpServer.stdout.on("data", (data) => {
    const message = data.trim();
    
    // ✅ PHP 서버 시작 메시지를 정상 출력으로 처리
    if (message.includes("Development Server")) {
        console.log(`✅ PHP Server Started: ${message}`);
    } 
    // ✅ 일반적인 요청 로그는 그냥 출력
    else if (message.includes("[200]") || message.includes("Accepted") || message.includes("Closing")) {
        console.log(`📢 PHP Log: ${message}`);
    } 
    // ❌ 진짜 오류만 출력
    else {
        console.error(`❌ PHP Error: ${message}`);
    }
});

// ✅ PHP 서버 오류 로그 처리
phpServer.stderr.on("data", (data) => {
    const message = data.trim();
    
    // ✅ 특정 문자열 포함 시 오류로 처리 안 함
    if (message.includes("[200]") || message.includes("Accepted") || message.includes("Closing") || message.includes("Development Server")) {
        console.log(`📢 PHP Log (stderr): ${message}`);
    } 
    // ❌ 진짜 오류만 표시
    else {
        console.error(`❌ PHP Error: ${message}`);
    }
});

// ✅ 서버 종료 시 PHP 서버도 종료
const shutdownServers = () => {
    console.log("🛑 Shutting down servers...");
    phpServer.kill(); // PHP 서버 종료
    process.exit();
};

process.on("SIGINT", shutdownServers); // Ctrl + C 처리
process.on("SIGTERM", shutdownServers); // 강제 종료 처리
