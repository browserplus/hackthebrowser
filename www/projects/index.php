<?php
require "/usr/local/www/hackthebrowser.org/php/site.php";
require "/usr/local/www/hackthebrowser.org/php/markdown/markdown.php";

site_header(NAV_PROJECT, "Hack the Browser: Projects", COLS_2);

$project = null;
$readme  = null;

if (isset($_GET['__route__'])) {
    $route = $_GET['__route__'];

    // remove ending PATH SEPARATOR "/" if it exists
    $len = strlen($route);
    if ($len > 0 && strpos($route, "/") == ($len-1)) {
        $route = substr($route, 0, $len-1);
    }

    // verify path only consists of "safe" chars
    if (preg_match("/^[-_a-z0-9]+$/i", $route)) {
        $path = $PROJECTS_DIR . "/" . $route . "/README";
        
        // verify there's a README file
        if (is_file($path)) {
            $project = $route;
            $readme = file_get_contents($path);
        }
    }
}

if ($project && $readme):
    echo Markdown($readme);
else:
?>

<h1>Projects</h1>

<p>
    HackTheBrowser develops on <a href="http://www.github.com">GitHub</a>.
</p>

<?php
endif;
?>

<?php site_sidebar(); ?>

<?php 

$str = "<ul>";
foreach(rglob("README", $PROJECTS_DIR) as $f) {
    $dir = basename(dirname(realpath($f)));
    $clz = ($project == $dir) ? "class=\"active\"" : "";
    $str .= "<li $clz><a href=\"/projects/$dir/\">$dir</a></li>";
}
$str .= "</ol>";

site_mod("Projects", $str);
?>

<?php site_footer(); ?>
