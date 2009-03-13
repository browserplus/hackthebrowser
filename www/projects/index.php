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
    The big bucket of projects!  Click a link on the right to get started.
</p>

<?php
endif;
?>

<?php 
site_sidebar(); 
site_projects($project);
site_footer(); 
?>
