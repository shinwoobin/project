<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>광고 페이지</title>
    <link rel="stylesheet" href="css/style.css">
    
    <!-- ✅ 카카오 SDK 추가 -->
    <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>

    <script>
        // ✅ 카카오 SDK 초기화 (여기 YOUR_APP_KEY를 카카오 개발자 콘솔에서 가져와서 변경!)
        Kakao.init("4af9355845105042f98deb7292499b86");
        console.log("✅ Kakao SDK initialized:", Kakao.isInitialized());

        function shareKakao() {
            Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: "광고 페이지",
                    description: "이 광고 페이지를 친구들에게 공유해보세요!",
                    imageUrl: "https://your-image-url.com/example.jpg", // 공유할 이미지 URL 변경
                    link: {
                        mobileWebUrl: "http://localhost:8000/",
                        webUrl: "http://localhost:8000/"
                    }
                }
            });
        }

        async function fetchData() {
            try {
                // ✅ Node.js 서버에서 데이터를 가져오는 요청
                const response = await fetch("http://localhost:3000/api/data");
                const data = await response.json(); // JSON으로 응답받은 데이터 파싱
                document.getElementById("output").innerText = data.message; // 화면에 출력
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
            }
        }
    </script>
</head>
<body>
    <?php
        // 각 컴포넌트 파일을 포함시킴
        include('components/header.php');
    ?>

    <main>
        <section>
            <h1>광고 페이지</h1>
            <p>현재 날짜와 시간: <?php echo date("Y-m-d H:i:s"); ?></p>

            <!-- ✅ 카카오톡 공유 버튼 -->
            <button onclick="shareKakao()">카카오톡 공유하기</button>

            <!-- ✅ Node.js 데이터를 가져오는 버튼 -->
            <button onclick="fetchData()">Node.js 데이터 가져오기</button>
            <p id="output">Node.js에서 가져온 데이터가 여기에 표시됩니다.</p>
        </section>
    </main>

    <?php
        include('components/footer.php');
    ?>
</body>
</html>
