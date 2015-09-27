<?php
		function stringForJavascript($in_string) {
		   $str = ereg_replace("[\r\n]", " \\n\\\n", $in_string);
		   $str = ereg_replace('"', '\\"', $str);
		   return $str;
		}
		switch($_GET['id']) {
			case 'newsCat1':
				$content = 'This is content for page Politics.';
				break;
			case 'newsCat2':
				$content = 'This is content for page Sports.';
				break;
			case 'newsCat3':
				$content = 'This is content for page Lifestyle.';
				break;
			default:
				$content = 'There was an error.';
		
		} 
		print stringForJavascript($content);
		usleep(600000);
		?>