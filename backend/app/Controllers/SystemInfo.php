<?php

namespace App\Controllers;

class SystemInfo extends BaseController
{
    public function phpInfo()
    {
        return view('system_info');
    }
}