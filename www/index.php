<?php

define('START_BY_INDEX', TRUE);
define('DOC_ROOT', __DIR__);
define('APP_ROOT', DOC_ROOT. '/app');
define('CONF_PATH', APP_ROOT . '/conf.php');

header('Content-Type: text/html; charset=utf-8');
mb_language('uni');
mb_internal_encoding('utf-8');

include 'app/core.inc.php';

// *** test development part:

p('Loaded core');

foreach([
    '',
    '/index.php',
    '/index.php/main/test/qqqq/wwww/eeee',
    '/index.php/dbtest',
    '/index.php/user',
    '/index.php/user/edit',
    '/index.php/user/view/1',
    '/index.php/user/edit/action_param_1/action_param_2/action_param_3'
         ] as $path){
    $prefix = $_SERVER['HTTP_HOST'];
    $url = $prefix.$path;
    p("<a href='http://$url' >$url</a>");
}
// ***

Core::instance();
Core::instance()->init();
Core::instance()->run();
