<?php
require "/usr/local/www/hackthebrowser.org/php/site.php";
require "/usr/local/www/hackthebrowser.org/php/db.php";

// Number of IRC Rows to show -- 100 is max, limited by chat_last_n_rows() in db.php
define("NUM_IRC_ROWS", 100);

site_header(NAV_IRC, "IRC - Hack the Browser", COLS_2);

function linkit($label, $link, $bool=true)
{
    if ($bool) {
        return "<a href=\"$link\">$label</a>";
    } else {
        return $label;
    }
}

?>
<h1>IRC</h1>

<?php

$nr = NUM_IRC_ROWS;
$max_id = chat_max_id();

if (isset($_GET['id'])) {
    $id = (int)($_GET['id']);
    if (($max_id - $id) < 0) {
        $id = $max_id;
    }

    $results = chat_last_n_rows($id, $nr);
} else {
    $id = $max_id;
    $results = chat_last_n_rows($max_id, $nr);
}

$first_id = $results[0]["id"];
$last_id = $results[count($results)-1]["id"];
$next_id = $last_id + $nr - 1;


$ircNav = 
    "<div class=\"ircNav\">" .
    linkit("&laquo; Older", "?id=$first_id", ($first_id > 0)) . " | " . 
    linkit("Current", "/irc/", ($id != $max_id)) . " | " .
    linkit("Newer &raquo;", "?id=$next_id",  ($last_id < $max_id)) . 
    "</div>";

echo $ircNav;
?>

<div class="ircEntries">
<table>

<?php
$cnt = 0;
foreach($results as $row) {
    $clz = ($cnt++ % 2 == 0 ? "even" : "odd");

    echo "<tr>";
    echo "<td class=\"ircDate\"><nobr>" . $row["stamp"] . "</nobr></td>";
    echo "<td class=\"ircEntry $clz\">";
    echo "<span class=\"ircWho\">" . h($row["who"]) . ":</span> ";
    echo "<span class=\"ircWhat\">" . hyperlink_urls_in_text(emoticonize_text(h($row["utterance"]))) . "</span>";
    echo "</td></tr>\n";
}

?>
</table>
</div>
<?php
echo $ircNav;

site_sidebar();
?>

This goes in the sidebar.

<?php
site_footer();
?>
