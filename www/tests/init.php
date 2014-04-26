<?php

define('TEST_DIR', __DIR__);
define('APP_DIR', TEST_DIR . '/../app');

include_once APP_DIR . '/core/functions.php';

class TestUnit {
    
    function prepare(){}
    
    function undo(){}
    
}

class TestSuite{
    
    function testList(){
        $files = scandir(TEST_DIR);
        //p($files);
        $testFiles = [];
        foreach($files as $file){
            if(preg_match('|^test_([\w-_.]+).php$|', $file, $match)){
                $testFiles[] = ['file' => $file, 'name' => $match[1]];
            }
        }
        return $testFiles;
    }
    
    function startPage(){
        $testFiles = $this->testList();
        //p($testFiles);
        $links = [];
        foreach($testFiles as $unit){
            $links[] = ['link' => "<a href='init.php?unit={$unit['name']}'>{$unit['name']}</a>"];
        }
        print html_table($links);
    }
    
    function test(){
        if(!isset($_GET['unit']))
            return p('No valid unit');
        $unit = (string)$_GET['unit'];
        $class = 'Test' . ucfirst($unit);
        $file =  'test_' . $unit . '.php';
        p("file = $file, class = $class");
        if(!file_exists($file)){
            return p('No current file');
        }
        include_once $file;
        $test = new $class();
        //p($test);
        $test->prepare();
        $methods = get_class_methods($class);
        foreach($methods as $method){
            if(! preg_match('|^test_|', $method))
                continue;
            call_user_func_array([$test, $method], []);
        }
        $test->undo();
    }
    
    function runAll(){
        $testFiles = $this->testList();
        p($testFiles);
        
    }
    
}

p('test page');

$suite = new TestSuite();

if(empty($_GET)){
    $suite->startPage();
} else {
    $suite->test();
}
