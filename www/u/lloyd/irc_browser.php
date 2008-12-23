<html><body>
<?php

# the number of days back to display by default
$DEFAULT_VIEW_NUM_DAYS = 1;

# the amount of context to display
$CONTEXT_AMOUNT = 14;

$MAX_RESPONSE_ROWS = 100;

?>

<center><h2>IRC Archive </h2>
<p>

<form method="get">
Search for <input name="search" /> <input type="submit" value="Go!"/>
</form>

<p>

<table width="80%" cellpadding=2 cellspacing=2>
<?php
include "db.inc";
$db = new db;

# now build up the query
$query = "SELECT id, DATE_FORMAT(stamp,'%c/%d/%y %r') as stamp, ";
$query .= "who, utterance FROM chat";
$query .= " WHERE ";

if (array_key_exists('search', $_GET) && $_GET['search'])
{
  $whatAmIDisplaying = "utterances containing &quot;"
    . $_GET['search'] . "&quot; (max $MAX_RESPONSE_ROWS, most recent first)";
  $query .= " utterance LIKE '%".$db->quote($_GET['search'])."%' ";
  $query .= " ORDER BY chat.stamp DESC LIMIT $MAX_RESPONSE_ROWS";
} else {
  if (array_key_exists('date', $_GET))
    {
      $whatAmIDisplaying = "All comments from " . $_GET['date'];  
    }
  else if (array_key_exists('context', $_GET))
    {
      $whatAmIDisplaying = "Some context around a specific utterance...";
      
      $query .= " id > " . $db->quote($_GET['context'] - $CONTEXT_AMOUNT);
      $query .= " AND id < " . $db->quote($_GET['context'] + $CONTEXT_AMOUNT);
    }
  else
    {
      $whatAmIDisplaying = "Last $MAX_RESPONSE_ROWS Comments";

      $maxID = $db->runQuery("SELECT MAX(id) FROM chat");
      $maxID = $maxID[0][0] - $MAX_RESPONSE_ROWS;
      $query .= " id > $maxID";
    }
  $query .= " ORDER BY chat.stamp";


}

$blahs = $db->runQuery($query);


echo "<tr bgcolor=\"#aaaaaa\"><th colspan=3>$whatAmIDisplaying</th></tr>";



foreach ($blahs as $blah) {
  # when providing context, we highlight the interesting element 
  if (array_key_exists('context', $_GET) && $_GET['context'] == $blah['id']) {
    echo "<tr bgcolor=\"#e79090\"";
  }
  else {
    echo "<tr>";
  }
    echo "<td class=\"date1\"><a href=\"?context=" . $blah['id'] . "\"><nobr>" . $blah['stamp'] . "</nobr></a></td>";
    echo "<td class=\"ircEntry\"><span class=\"userID\">" .  $blah['who'] . ":</span>";
    echo "    <span class=\"ircText\">";
    echo htmlentities($blah['utterance']);
    echo "</span</td></tr>\n";
}

?>
</table></center>
</body></html>

