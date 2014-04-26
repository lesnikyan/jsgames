<?php

function p($x='print empty...'){
	$type = gettype($x);
	$out = $x;
	if(in_array($type, array('object', 'array'))){
		$out = "<pre>\n". print_r($x, 1) . "\n</pre>";
	} elseif($type == 'boolean'){
		$out = $x ? 'TRUE' : 'FALSE';
	}
	print "<div>($type) $out</div>";
}

function html_table($data, $style=''){
	if(! is_array($style)){
		$style=array('table' => $style);
	}
	
	if(empty($data) || !isset($data[0])){
		return null;
	}
	
	$keys = array_keys($data[0]);
	
	$tbstyle = isset($style['table']) ? "style='{$style['table']}'" : '';
	$htrstyle = isset($style['htr']) ? "style='{$style['htr']}'" : '';
	$thstyle = isset($style['th']) ? "style='{$style['th']}'" : '';
	$trstyle = isset($style['tr']) ? "style='{$style['tr']}'" : '';
	$tdstyle = isset($style['td']) ? "style='{$style['td']}'" : '';
	
	$head = "\t<tr>\n";
	foreach($keys as $name){
		$ucname = ucfirst($name);
		$head .= "\t\t<th $thstyle>$ucname</th>\n";
	}
	$head .= "\t</tr>\n";
	
	$body = "";
	foreach($data as $row){
		$tr = "\t<tr $trstyle>\n";
		foreach($row as $key => $val){
			if(! $val)
				$val = '-- &nbsp;';
			$tr .= "\t\t<td $tdstyle>$val</td>\n";
		}
		$tr .= "\t</tr>\n";
		$body .= $tr;
	}
	$body .= "";
	return "\n<table $tbstyle>\n{$head}{$body}</table>\n";
}
