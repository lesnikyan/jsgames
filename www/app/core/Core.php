<?php

class Core {
    
    private static $instance = null;
    
    private $config = null;
    private $router = null;
    
    function __construct(){
        
    }
    
    static function instance(){
        if(self::$instance === null){
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    function init(){
        $this->config = \Core\Config::instance();
        $this->config->load();
        //p($this->config);
        $this->router = new \Core\Router('auto');
    //    p($this->router);
    }
    
    function run(){
        try{
            //pre buffer
            
            // eval
            $class = $this->loadController($this->router->module);
            $method = $this->router->action;
            $params = $this->router->params;
            // if 404 (file, method): load service-page404
            $pageNotFound = false;
            if(!$class){
                $pageNotFound = true;
            } else {
                $obj = new $class();
                if (!method_exists($obj, $method)){
                    $pageNotFound = true;
                }
            }
            if($pageNotFound){
                $class = '\\Controllers\\ServiceController';
                $obj = new $class();
                $method = 'page404';
                $params = array("Page '{$this->router->url}' not found!");
            }
            //p($obj);
            call_user_func_array(array($obj, $method), $params);
        
            //post buffer
        }catch(Exception $e){
            p($e->getMessage());
        }
    }
    
    function loadClass(){}
    
    function loadController($name){
        $file = $this->modulePath($name) . '/con_' . $name . '.php';
        if(!file_exists($file))
            //throw new Exception('No target file of module logic.');
            return null;
        //$con = new \Controllers\Controller(); p($con); exit;
        require_once $file;
        p($file);
        $class = '\\Controllers\\' . ucfirst($name) .'Controller';
        p($class);
        return $class;
    }
    
    function modulePath($name){
        return APP_ROOT . '/modules/' . $name;
    }
    
    function loadModel(){}
    
    function loadView(){}
    
    function loadConf(){}
    
    static function controller(){}
    
    /**
     * $name = name/subname
     **/
    static function model($name=null, $subName=null){
        $core = self::instance();
        $modName = $name;
        if(strpos($name, '/') !== false){
            $parts = explode('/', $name);
            $modName = $parts[0];
            $subName = $parts[1];
        }
        if(! $modName){
            $modName = self::router()->module;
        }
        if(! $subName){
            $subName = $modName;
        }
        
        $class = '\\DB\\' . ucfirst($subName);
        $file = $core->modulePath($modName) . '/' . $subName . '_model.php';
        0 && p("[($name)<span style='color:red;'>($modName)</span>,
          <span style='color:green;'>$subName</span>],
          <span style='color:#0000aa;'>[$class]</span> <br /> [$file]");
        if(! file_exists($file))
            throw new Exception("File of module '$name' not found .");
        include_once $file;
        $obj = new $class();
        return $obj;
    }
    
    static function view($name,$data=null){
        return new \Core\View($name, $data);
    }
    
    static function conf($name){
        return self::$instance->config->get($name);
    }
    
    static function router(){
        return self::instance()->router;
    }
}