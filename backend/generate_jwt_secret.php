<?php


// 안전한 32바이트(256비트) 길이의 JWT 서명 키 생성
$secretKey = bin2hex(random_bytes(32));

// `.env` 파일이 존재하는지 확인 후 키 저장
$envFile = __DIR__ . '/.env';

// 기존 `.env` 파일이 있다면 내용을 유지하면서 JWT_SECRET 추가/갱신
if (file_exists($envFile)) {
    $envContent = file_get_contents($envFile);

    if (strpos($envContent, 'JWT_SECRET=') !== false) {
        // 기존 키를 업데이트
        $envContent = preg_replace('/JWT_SECRET=.*/', "JWT_SECRET=\"$secretKey\"", $envContent);
    } else {
        // 새로운 키 추가
        $envContent .= "\nJWT_SECRET=\"$secretKey\"";
    }
} else {
    // `.env` 파일이 없으면 새로 생성
    $envContent = "JWT_SECRET=\"$secretKey\"";
}

// `.env` 파일에 저장
file_put_contents($envFile, $envContent);

echo "✅ JWT Secret Key가 생성되었습니다!\n";
echo "🔑 생성된 키: $secretKey\n";
echo "📂 .env 파일에 저장되었습니다.\n";

