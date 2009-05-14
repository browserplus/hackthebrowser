<?php
require "../../php/site.php";

site_header(NAV_HOWDOI, "Hack the Browser: How Do I", COLS_1, AJAX_JS);

function topics()
{
    global $HOWDOI_DIR;
    $str = "<div id=\"topics\" class=\"topics\">\n<ol>\n\n";
    $json = json_decode(file_get_contents($HOWDOI_DIR . "/topics.json"), true);
    foreach($json as $t) {
        $str .= "  <li><a class=\"atopic\" id=\"{$t['file']}\" href=\"#\">{$t['question']}</a></li>\n";
        $str .= "  <div id=\"a_{$t['file']}\" class=\"answer\"></div>\n\n";
    }

    $str .= "</ol>\n</div>\n";
    return $str;
}
		
echo "<h1>How Do I ...</h1>";
echo topics();

?>

<script>

(function() {
    var YE = YAHOO.util.Event,
        YD = YAHOO.util.Dom,
        BeenThere = {};
        
    function handleSuccess(o) {
        id = o.argument.id;
        BeenThere[id] = 1;
    	if(o.responseText !== undefined){
    	    YD.get("a_"+id).innerHTML = o.responseText;
    	}
    }

    function getContent(id) {
        if (!BeenThere[id]) {
    	    var request = YAHOO.util.Connect.asyncRequest('GET', "get.php?f="+id, {
                success:handleSuccess,
                cache:false,
                argument: { id: id}
    	    });
	    }
    }

    function init() {
        YE.addListener('topics', 'click', function(e) {
	        YE.preventDefault(e);
	        var target = YE.getTarget(e);
	        if (target.className === "atopic") {
	            getContent(target.id);
            }
        });
    }
    
    YE.onDOMReady(init);
})();
</script>
<?php

site_sidebar(); 
site_footer(); 

?>
