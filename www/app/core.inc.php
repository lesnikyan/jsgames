<?php

foreach(array(
    'core/functions',
    'core/Config',
    'core/Router',
    'core/Core',
    'core/View',
    'core/Controller',
    'core/ServiceController',
    'libs/MysqlDriver',
    'core/Model',
    'core/Module'
              ) as $file){
    $path = APP_ROOT . '/' . $file . '.php';
    if(file_exists($path)){
        include_once $path;
    } else {
        throw new Exception("Core loader: No core file '$file'");
    }
    
}

if (isset($path)) unset($path);