<?php

namespace DB;

class MysqlDriver extends \PDO {
    
    private $lastQueryStatus = false;
    
    function __construct($connectionInfo){
        $info = (object)$connectionInfo;
        parent::__construct("mysql:dbname={$info->dbname};host={$info->host}", $info->user, $info->pass);
    }
    
    function query($sql, $params = array()){
        $stat = $this->prepare($sql); // get PdoStatement object
        $this->lastQueryStatus = $stat->execute($params);
        return $stat; // ->fetchAll(PDO::FETCH_CLASS);
        //return $stat->fetchAll(PDO::FETCH_ASSOC);
    }
    
    function select($sql, $params = array()){
        $res = $this->query($sql, $params);
        if($this->lastQueryStatus)
            return $res->fetchAll(PDO::FETCH_CLASS); // method from PdoStatement
        return [];
    }
    
    function update($sql, $params = array()){
        $res = $this->query($sql, $params);
        if($this->lastQueryStatus)
            return $res->rowCount(); // method from PdoStatement
        return 0;
    }
    
    function insert($sql, $params = array()){
        $res = $this->query($sql, $params);
        if($this->lastQueryStatus){
            return $this->lastInsertId(); // method from PDO
        }
        return null;
    }
    
    function doQuery($a, $b=null, $c=null){
        return parent::query($a, $b, $c);
    }
}