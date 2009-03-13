<?php
require "/usr/local/www/hackthebrowser.org/php/site.php";
require "/usr/local/www/hackthebrowser.org/php/markdown/markdown.php";

function cf($title, $arr, $key, $abbrev) {

    $str = "";
    $url = str_replace("/commit/", "/blob/", $arr["url"]);
    $cnt = 0;
    foreach($arr[$key] as $f) {
        $cnt++;
        $fn = $f["filename"];
        $str .= "`" . $abbrev . "` [$fn]($url/$fn)  \n";
    }
        
    return $cnt ? $str : "";
}

site_header(NAV_PROJECT, "Hack the Browser: Projects", COLS_2);

$project = null;
$readme  = null;
$meta    = null;

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

        // verify there's a meta.json file
        $path = $PROJECTS_DIR . "/" . $route . "/meta.json";
        if (is_file($path)) {
            $meta = file_get_contents($path);
        }
    }
}

if ($project && $readme):


    if ($meta):

        $json = json_decode($meta, 1);
        $source = $json["url"];
        $readme .= "\n### Source Code\n[$source]($source)\n\n";

        $commit = apc_fetch($project . "/commit");

        if (strlen($commit) > 1) {
            $commit = json_decode($commit, 1);
            $commit = $commit["commit"];

            $readme .= "### Author\n" . $commit["author"]["name"] . "\n\n";

            $date = date("M d, Y", strtotime($commit["committed_date"]));
            
            $readme .= "### Last Commit - ";
            $readme .= $commit["committer"]["name"] . " on $date\n\n";

            $readme .= $commit["message"] . "\n\n";
            $readme .= "#### Changed Files\n\n";
            $readme .= cf("Added", $commit, "added", "a");
            $readme .= cf("Modified", $commit, "modified", "m");
            $readme .= cf("Removed", $commit, "removed", "r");

        }
    endif;

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

<?php 
site_sidebar(); 
site_projects($project);
site_footer(); 
?>
