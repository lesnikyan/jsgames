<?php
namespace Core;

class Config {
    private $confData = array();
    private static $instance = null;
    
    function __construct(){}
    
    static function instance(){
        if(self::$instance === null){
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    function load($path=null){
        $conf = array();
        if($path== null)
            $path = CONF_PATH;
        include $path;
        $this->confData = $conf;
    }
    
    function setConfig($data){
        $this->confData = $data;
        //p('setConf');
        //p($this->confData);
    }
    
    function get($name){
        $name = (string) $name;
        //if(isset($confData[$name])){
        //    return $confData[$name];
        //}
        return $this->getByChain(explode('.', $name));
        return null;
    }
    
    function getByChain($chain){
        if(empty($this->confData))
            return null;
        $node = $this->confData;
        $i = 0;
        $max = count($chain) - 1;
        p($max . ' ' . print_r($chain,1));
        while($i <= $max && isset($node[$chain[$i]])){
            $node = $node[$chain[$i]];
            //p($node);
            $i++;
        }
        if($i === $max + 1)
            return $node;
        return null;
    }
    
    
}