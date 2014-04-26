<?php if(!defined('START_BY_INDEX')) die('Cant do this ');

$conf = array(
    'project_host' => 'jsgame.loc',
    'db' => array(
        'driver'    => 'mysql',
        'host'      => 'localhost',
        'user'      => 'root',
        'pass'      => '',
        'dbname'    => 'jsgames',
        'port'      => '3306',
        'charset'  => 'utf-8',
        'character_set' => false // for special cases
    ),
    'route' => array(
        'default' => array(
            'module' => 'main',
            'action' => 'index'
        )
    ),
    'pass_salt' => 'skc87fHVe4FDbN78'
  );