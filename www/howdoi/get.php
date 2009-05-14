<?php
require "../../php/site.php";
require "../../php/markdown/markdown.php";

if (isset($_GET['f']) && preg_match("/^[a-z0-9_]{2,60}$/i", $_GET['f'])) {
    $fn = "$HOWDOI_DIR/" . $_GET['f'] . ".txt";
    if (file_exists($fn)) {
        echo "<div id=\"b_" . $_GET['f'] . "\">" . Markdown(file_get_contents($fn)) . "</div>";
    }
}
?>