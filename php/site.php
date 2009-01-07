<?php
define("NAV_HOME", "home");
define("NAV_IRC", "irc");
define("NAV_SERVICE", "service");
define("NAV_BLOG", "blog");
define("NAV_ABOUT", "about");
define("COLS_1", "col_1");
define("COLS_2", "col_2");

$SITE_MENU = array(
    NAV_HOME    => array("/", "Home"),
    NAV_IRC     => array("/irc/", "IRC"),
    NAV_SERVICE => array("/services/", "Services"),
    NAV_BLOG    => array("/blog/", "Blog"),
    NAV_ABOUT   => array("/about/", "About")
);

// escape html text
function h($text)
{
    return htmlspecialchars($text,ENT_QUOTES);//,'UTF-8');
}

function hyperlink_urls_in_text($string){
    $host = "([a-z\d][-a-z\d]*[a-z\d]\.)+[a-z][-a-z\d]*[a-z]";
    $port = "(:\d{1,})?";
    $path = "(\/[^?<>\#\"\s]+)?";
    $query = "(\?[^<>\#\"\s]+)?";
    return preg_replace("#((ht|f)tps?:\/\/{$host}{$port}{$path}{$query})#i", "<a target='_blank' href='$1'>$1</a>", $string);
}

function emoticonize_text($string)
{
    $search = array(
    ":)",
    ":-)",
    ":(",
    ":-(",
    ";)",
    ";-)",
    ":D",
    ":-D",
    ":|",
    ":-|",
    "8)",
    "8-)",
    ":P",
    ":-P",
    ":O",
    "9.9",
    ":\\",
    ":-\\",
    ":x",
    ":-x",
    "d:)",
    "[:)"
    );

    $replace = array(
        '<img alt="smile" src="/img/emote/smile.png">', 
        '<img alt="smile" src="/img/emote/smile.png">', 
        '<img alt="frown" src="/img/emote/frown.png">',
        '<img alt="frown" src="/img/emote/frown.png">',
        '<img alt="wink" src="/img/emote/wink.png">',
        '<img alt="wink" src="/img/emote/wink.png">',
        '<img alt="happy" src="/img/emote/happy.png">',
        '<img alt="happy" src="/img/emote/happy.png">',
        '<img alt="stoic" src="/img/emote/stoic.png">',
        '<img alt="stoic" src="/img/emote/stoic.png">',
        '<img alt="cool" src="/img/emote/cool.png">',
        '<img alt="cool" src="/img/emote/cool.png">',
        '<img alt="razz" src="/img/emote/razz.png">',
        '<img alt="razz" src="/img/emote/razz.png">',
        '<img alt="surprised" src="/img/emote/surprised.png">',
        '<img alt="sarcastic" src="/img/emote/sarcastic.png">',
        '<img alt="annoyed" src="/img/emote/annoyed.png">',
        '<img alt="annoyed" src="/img/emote/annoyed.png">',
        '<img alt="angry" src="/img/emote/angry.png">',
        '<img alt="angry" src="/img/emote/angry.png">',
        '<img alt="relaxed" src="/img/emote/relaxed.png">',
        '<img alt="jamming" src="/img/emote/jamming.png">'
    );

    return str_replace($search, $replace, $string);
}

function site_header($selected_tab, $page_title, $cols)
{
    global $SITE_MENU, $__NumCols__;

    $__NumCols__ = $cols;
    $cols_clz = ($cols == COLS_2 ? "class=\"yui-t4\"" : "");
    $form = ""; // or the below if we want search
    /* 
        <form class="clearfix" action="http://search.yahoo.com/search" method="get">
            <input name="vs" type="hidden" value="developer.yahoo.com">
            <input name="vs" type="hidden" value="yuiblog.com">
            <input name="vs" type="hidden" value="yuilibrary.com">
            <input type="search" id="sitesearchbox" name="p">
            <input type="button" name="some_name" value="Search" id="sitesearchbutton">
        </form>
    */
    
    $nav_menu = "";
    foreach($SITE_MENU as $tab => $arr) {
        $url = $arr[0];
        $label = $arr[1];
        $clz = ($tab == $selected_tab ? "class=\"on\"" : "");
        $nav_menu .= "<li $clz><a href=\"$url\">$label</a></li>";
    }
    

echo <<< EOS
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>$page_title</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css">
    <link rel="stylesheet" type="text/css" href="/css/site.css">
</head>
<body>
    <div id="doc3" $cols_clz>
        <a name="top"></a>
        <div id="hd" class="clearfix">
            $form
            <div class="logos">
                <img id="logo" src="/img/logo.png" width="291" height="23" alt="Hack the Browser">
                <img id="tagline" src="/img/tagline.png" width="416" height="13" alt="Playground for the development of open-source, scriptable browser plugins"> 
            </div>
        </div>

        <div id="nav" class="navtabs clearfix">
            <ul>
                $nav_menu
            </ul>
       </div>

        <div id="bd">
            <div id="yui-main">
                <div class="yui-b">
EOS;
}

function site_sidebar()
{
    echo "</div></div>";
    echo "<div class=\"yui-b secondary\">";
}

function site_footer()
{
    global $__NumCols__;

    $ending_divs = ($__NumCols__ == COLS_2) ? "</div>" : "</div></div>";

    echo <<< EOS
            $ending_divs
        </div>
        <div id="ft">FOOTER IS HERE</div>
    </div>
</body>
</html>
EOS;
}
?>