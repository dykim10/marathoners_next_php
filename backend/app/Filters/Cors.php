<?php
namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $allowedOrigins = [
            "http://localhost:3000", // ✅ Next.js 도메인 허용
        ];

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : "";

        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: " . $origin);
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, Cookie, X-Requested-With");
            header("Access-Control-Allow-Credentials: true"); // ✅ 쿠키 포함 허용
        }

        if ($request->getMethod() === 'options') {
            header("HTTP/1.1 204 No Content");
            exit(); // Preflight 요청에 대한 즉시 응답
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // After filter logic
    }
}

