<?php
namespace Controllers;

class Hunter01Controller extends Controller{
    function index(){
        $view = \Core::view('vhunter');
        $view->welcomeMsg = '';
        $view->render(true);
    }
    
    function test($x, $y, $z){
        p("<span style='color:#e02200;'>Hunter 01:test -> $x -> $y -> $z</span>");
        
    }
}