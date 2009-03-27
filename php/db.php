<?php
define("CHAT_TABLE", "chat");
define("MAX_ROW_COUNT", 500);

function db()
{
    static $db;

    if (!isset($db)) {
         $dbson= json_decode(file_get_contents("/home/hackthebrowser/dbpasswd.json"), true);
         $db = new PDO("mysql:" .
             "host=" . $dbson["server"] . ";" .
             "dbname=" . $dbson["db"],
             $dbson["user"],
             $dbson["pass"]);
    }

    return $db;
}

function db_ensure_array($value)
{
    return (is_array($value) ? $value : array($value));
}

// returns max id from table
function db_max($table, $id)
{
    $sth = db()->prepare($sql="SELECT MAX($id) FROM $table");
    if ($sth == false) {
        die("db_max error: $sql");
    }

    $sth->execute();
    $val = $sth->fetch(PDO::FETCH_NUM);

    return $val[0];
}

function db_fetch_all($sql, $values = false)
{
    $sth = db()->prepare($sql);

    if ($sth == false) {
        die("db_fetch_all error: $sql");
    }

    if ($values) {
        $sth->execute(db_ensure_array($values));
    } else {
        $sth->execute();       
    }
    
    $rows = $sth->fetchAll(PDO::FETCH_ASSOC);

    return $rows;
}

function irc_max_id()
{
    return db_max(CHAT_TABLE, "id");    
}

function irc_last_n_rows($max_id, $num_rows=10)
{
    $starting_id = max(0, $max_id - $num_rows);
    $sql = "SELECT * FROM " . CHAT_TABLE . " WHERE id > ? ORDER BY chat.stamp LIMIT $num_rows";

    return db_fetch_all($sql, array($starting_id));
}

function irc_search($search, $num_rows)
{
    $sql = "SELECT * FROM " . CHAT_TABLE . " WHERE MATCH(utterance) AGAINST (?)  ORDER BY stamp DESC LIMIT $num_rows";
    return db_fetch_all($sql, array($search));
}


?>