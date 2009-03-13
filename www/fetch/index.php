<?php
require "/usr/local/www/hackthebrowser.org/php/site.php";

$project = null;
$json    = null;
$type    = null;

if (isset($_GET['__route__'])) {
    $arr = explode("/", $_GET['__route__']);
    if (count($arr) == 2) {
        $route = $arr[0]; // dir name of project
        $type = $arr[1];  // git data type (commit, commits)
        
        // remove ending PATH SEPARATOR "/" if it exists
        $len = strlen($route);
        if ($len > 0 && strpos($route, "/") == ($len-1)) {
            $route = substr($route, 0, $len-1);
        }

        // verify path only consists of "safe" chars
        if (preg_match("/^[-_a-z0-9]+$/i", $route)) {
            $path = $PROJECTS_DIR . "/" . $route . "/meta.json";
        
            // verify there's a config file
            if (is_file($path)) {
                $project = $route;
                $json = file_get_contents($path);
            }
        }
    }
}

// GIT API: http://github.com/guides/the-github-api
// url:     http://github.com/api/<version>/<format>/<username>/<repository>/<type>/<object>
//
// commits: http://github.com/api/v1/json/sspencer/bp-photos/commits/master
// commit:  http://github.com/api/v1/json/sspencer/bp-photos/commit/master
// user:    http://github.com/api/v1/json/lloyd

$json = json_decode($json, 1);
if (preg_match("/^commits?$/", $type) && $json["url"]) {
    // parse url
    if (preg_match("|^http://github.com/([^/]+)/([^/]+)|", $json["url"], $arr)) {
        if (count($arr) >= 3) {
            $user = $arr[1];
            $repository = $arr[2];
            $object = "master";
            
            $data = fetch("http://github.com/api/v1/json/$user/$repository/$type/$object");
            
            print "<pre>";
            print_r(json_decode($data, 1));
            print "</pre>";
        }
    }
}
?>