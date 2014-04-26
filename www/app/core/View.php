<?php
namespace Core;

class View {
    
    private $file;
    private $data = [];
    private $code = null;
    
    function __construct($name, $data=null){
        $file = APP_ROOT . "/modules/" . \Core::router()->module . "/views/$name.php" ;
        if(!file_exists($file))
            throw new Exception('No correct view file.');
        $this->file = $file;
        if($data != null)
            $this->data = $data;
    }
    
    function add($data){
        $this->data = array_merge($this->data, $data);
    }
    
    function reset($data){
        $this->data = $data;
    }
    
    function set($name, $value){
        $this->data[$name] = $value;
    }
    
    function __set($name, $value){
        $this->set($name, $value);
    }
    
    function render($output = false){
        // this->data to local vars
        extract($this->data, EXTR_OVERWRITE);
        
        // load view code for multi eval
        if($this->code === null){
            $this->code = file_get_contents($this->file);
        }
        // start output buffering
        ob_start();
        // eval code
        eval("?>{$this->code}<?");
        $content = ob_get_contents();
        ob_end_clean();
        // print content if passed true
        if($output)
            print $content;
        return $content;
    }
}