<?php
header("Content-Type: application/json");

// PHP에서 반환할 데이터
$response = ["message" => "Hello from PHP!"];

// JSON 출력
echo json_encode($response);
?>
