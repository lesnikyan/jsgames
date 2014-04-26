<?php
namespace Controllers;

class ServiceController extends Controller {
    function page404($msg){
        p("<h1>404. $msg</h1>");
    }
}