<?php

class TestConfig extends TestUnit {
    
    function prepare(){
        include_once APP_DIR . '/core/Config.php';
    }
    
    function test_names(){
        $confData = [
            'key_1' => 'qqqqqq',
            'key_2' => 'wwwwww',
            'key_3' => [
                'key_3_1' => 'eeeeeee',
                'key_3_2' => [
                    'key_3_2_1' => [
                        'key_3_2_1_1' => 'rrrrrr',
                        'key_3_2_1_2' => 'tttttt',
                        'key_3_2_1_3' => [12,13,14,15]
                    ],
                    'key_3_2_2' => [
                        'key_3_2_2_1' => [
                            'key_3_2_2_1_1' => [
                                'key_3_2_2_1_1_1' => [
                                    'key_3_2_2_1_1_1_1' => 'Hello, conf!'
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'key_4' => [
                'key_4_1' => 111,
                'key_4_2' => 222,
                'key_4_3' => 333
            ]
        ];
        //p($confData);
        $conf = new Config();
        $conf->setConfig($confData);
        $keys = [
            'key_1',
            'key_2',
            'key_3.key_3_1',
            'key_3.key_3_2.key_3_2_1.key_3_2_1_1',
            'key_3.key_3_2.key_3_2_1.key_3_2_1_3',
            'key_3.key_3_2.key_3_2_2.key_3_2_2_1.key_3_2_2_1_1.key_3_2_2_1_1_1.key_3_2_2_1_1_1_1',
            'key_4'
        ];
        foreach($keys as $key){
            $val = $conf->get($key);
            $strVal = $val;
            if(is_array($val) || is_object($val))
                $strVal = print_r($val, 1);
            p("[$key] = $strVal");
        }
    }
    
}