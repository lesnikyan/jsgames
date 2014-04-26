<?php
namespace Core;

class Router{
    private $url;
    private $path;
    private $segments = array();
    private $module;
    private $action;
    private $params = array();
    private $allowedMembers = array('segments', 'module', 'action', 'params', 'url');
    private $basePath = '/index.php';
    
    function __construct($url=null){
        if($url){
            if($url == 'auto')
                $this->parseUrl();
            else
                $this->parseUrl($url);
        }
    }
    
    function parseUrl($url=null){
        if(! $url)
            $url = $_SERVER['REQUEST_URI'];
        $this->url = $url;
        $baseLength = strlen($this->basePath);
    //    $endPath = strpos($url, '?');
    //    $endPath = $endPath !== false ? ($endPath + $baseLength) :  ;
        $pathFrom = preg_match('|^'.$this->basePath.'|' , $this->url) ? $baseLength : 0;
        $appPath = substr($this->url, $pathFrom);
        $qpos = strpos($appPath, '?');
        if($qpos !== false){
            $appPath = substr($appPath, 0, $qpos);
        }
        $this->path = $appPath;
        $trimPath = trim($appPath, '/');
        if($trimPath !== '')
            $this->segments = explode('/', $trimPath);
        $segNum = count($this->segments);
        if($segNum > 0){
            $this->module = $this->segments[0];
        } else {
            $this->module = \Core::conf('route.default.module');
        }
        if($segNum > 1){
            $this->action = $this->segments[1];
        } else {
            $this->action = \Core::conf('route.default.action');
        }
        if($segNum > 2){
            $this->params = array_slice($this->segments, 2);
        }
        
    //    p($this);
    }
    
    function __get($name){
        if(in_array($name, $this->allowedMembers))
            return $this->{$name};
    }
}
