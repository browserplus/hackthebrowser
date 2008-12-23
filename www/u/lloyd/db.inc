<?php

class db 
{
  var $link;

  function quote($string)
  {
    return mysql_escape_string($string);
  }

  function runQuery($sql)
  {
    $link = mysql_connect ("mysql50.hub.org", "720_htb", "h4cky");
    if (!$link) {
      die('Could not connect: ' . mysql_error());
    }

    if (!mysql_select_db("720_hackthebrowser")) {
      die("Could not connect to DB");
    }

    $result = mysql_query($sql, $link);

    // Check result
    // This shows the actual query sent to MySQL, and the error. Useful for debugging.
    if (!$result) {
      $message  = '<pre> Invalid query: ' . mysql_error() . "\n";
      $message .= 'Whole query: ' . $sql . "</pre>";
      die($message);
    }

    $return = array();
    while($row=mysql_fetch_array($result)) {
      $return[] = $row;
    }

    return $return;
  }
};

?>
