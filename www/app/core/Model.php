<?php

namespace DB;

class Model {
    private $db;
    private $table;
    private $allowedFields = ['table', 'db'];
    
    function __construct($table){
        $this->table = $table;
        $dbInfo = \Core::conf('db');
        $this->db = new MysqlDriver($dbInfo);
        if($dbInfo['charset']) // $dbInfo['character_set']
            $this->db->query("SET NAMES {$dbInfo['charset']};");
        if(isset($dbInfo['character_set']) && $dbInfo['character_set'])
            $this->db->query("SET CHARACTER SET {$dbInfo['charset']};"); // for special cases
    }
    
    function __get($name){
        if(in_array($name,$this->allowedFields)){
            return $this->{$name};
        }
        return null;
    }
    
    function create($data){
        $keys = array_keys($data);
        $fields = "`".implode("`,`", $keys)."`" ; // `name`,`age`
        $values = substr(str_repeat('?,', count($keys)), 0, -1) ; // ?, ?
        $sql = "INSERT INTO `{$this->table}` ({$fields}) VALUES ({$values}); ";
        $sqlData = array_values($data);
        return $this->driver->insert($sql, $sqlData);
    }
    
    // 1
    function read($id){
        $sql = "SELECT * FROM `{$this->table}` WHERE `id` = ?; ";
        return $this->driver->select($sql, array($id));
    }
    
    function update($id, $data){
        // UPDATE {table} SET field1 = ?, field2 = ?
        $fields = '';
        $sqlData = [];
        foreach($data as $key => $val){
            $fields = "`{$key}` = ?,";
            $sqlData[] = $val;
        }
        $fields = substr($fields, 0 , -1);
        
        $sql = "UPDATE `{$this->table}` SET $fields WHERE `id` = ?";
        $sqlData[] = $id;
        return $this->driver->update($sql, $sqlData);
    }
    
    function delete($id){
        $sql = "DELETE FROM `{$this->table}` WHERE `id` = ? ";
        return $this->driver->delete($sql, [$id]);
    }
    
    function query($sql, $data){
        return $this->db->query($sql, $data);
    }
    
}