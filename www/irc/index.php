<?php
require "../../php/site.php";
require "../../php/db.php";
require "../../php/irc.php";

// Number of IRC Rows to show -- 500 is max, limited by chat_last_n_rows() in db.php
define("NUM_IRC_ROWS", 150);

site_header(NAV_IRC, "IRC - Hack the Browser", COLS_2);

function linkit($label, $link, $bool=true)
{
    if ($bool) {
        return "<a href=\"$link\">$label</a>";
    } else {
        return $label;
    }
}

function topic($period)
{
echo <<< EOS
    <div class="mod">
      <div class="hd"><h4>Hot Topics: $period</h4></div>
      <div class="bd tagCloud">
EOS;

    irc_render_hot_words($period, "?search=", 20, 10, 20);

echo <<< EOS
      </div>
    </div>
EOS;
}

function displayResultSet($results, $ircNav, $title)
{
    echo "<h3 class=\"ircTitle\">$title</h3>";
    $ircNav = "<div class=\"ircNav\">$ircNav</div>";
    
    echo "$ircNav\n<div class=\"ircEntries\">\n<table>\n";

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

    echo "</table>\n</div>\n$ircNav\n";
}

function displayEmptyResultSet()
{
    echo "<div class=\"ircEmpty\">No IRC results matched that query.</div>";
}

?>
<h1>IRC Log</h1>

<?php

$nr = NUM_IRC_ROWS;
$search_term = "";
$max_id = irc_max_id();
$title = false;
if (isset($_GET['search'])) {
    $id = $max_id;
    $search_term = h($_GET['search']);
    // don't need to escape search below since we're using PDO
    $results = irc_search($_GET['search'], $nr);
    $rcount = count($results);
    $ircNav = linkit("Current", "/irc/");
    $title = "Search IRC Logs for: $search_term";
} else {
    if (isset($_GET['context'])) {
        $id = (int)($_GET['context']);
        if (($max_id - $id) < 0) {
            $id = $max_id;
        }

        $results = irc_last_n_rows($id, $nr);
    } else {
        $id = $max_id;
        $results = irc_last_n_rows($max_id, $nr);
    }

    $rcount = count($results);
    $title = "Browse IRC Logs by time";

    if ($rcount > 0) {
        $first_id = $results[0]["id"];
        $last_id = $results[count($results)-1]["id"];
        $next_id = $last_id + $nr - 1;

        $ircNav = 
            linkit("&laquo; Older", "?context=$first_id", ($first_id > 0)) . " | " . 
            linkit("Current", "/irc/", ($id != $max_id)) . " | " .
            linkit("Newer &raquo;", "?context=$next_id",  ($last_id < $max_id));
    }
}


if ($rcount > 0) {
    displayResultSet($results, $ircNav, $title);
} else {
    displayEmptyResultSet();
}

site_sidebar();
?>

<div class="ircsearchbox">
    <form class="clearfix" action="/irc/" method="get">
        <label class="ircsearchlabel">IRC:</label>
        <input type="search" id="ircsearch" name="search" value="<?php echo $search_term ?>" size="16">
        <input type="button" name="some_name" value="Search" id="ircsearchbutton">
    </form>
</div>

     

<?php
topic("day");
topic("week");
topic("month");
?>



<?php
site_footer();
?>
