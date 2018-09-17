<?php

ini_set('display_errors', 1);



$load = require_once __DIR__ . '/../vendor/autoload.php';
$load->register();

require '../app/app.php';

$app->run();