<?php

namespace App\Controllers;

class SystemInfo extends BaseController
{
    public function phpInfo()
    {

        date_default_timezone_set('UTC');
        $utc_time = date('Y-m-d H:i:s');

        date_default_timezone_set('Asia/Seoul');
        $korea_time = date('Y-m-d H:i:s');

        echo "UTC Time: $utc_time\n";
        echo "Korea Time (UTC+9): $korea_time\n";

        echo " === > " . date("Y-m-d H:i:s", time());

        return view('system_info');
    }
}