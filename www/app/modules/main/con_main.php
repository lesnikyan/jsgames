<?php
namespace Controllers;

class MainController extends Controller{
    function index(){
        p('Main:index');
        $view = \Core::view('main');
        $view->welcomeMsg = 'to main page';
        $view->render(true);
    }
    
    function test($x, $y, $z){
        p("<span style='color:#e02200;'>Main:test -> $x -> $y -> $z</span>");
        
    }
}