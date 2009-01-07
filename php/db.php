<?php
define("CHAT_TABLE", "chat");

function db()
{
    static $db;

    if (!isset($db)) {
        if ($_SERVER["HTTP_HOST"] == "hackthebrowser.org") {
            $db = new PDO("mysql:host=mysql50.hub.org;dbname=720_hackthebrowser", "720_htb", "h4cky");
        } else {
            $db = new PDO("mysql:host=localhost;dbname=irc", "root", "");            
        }
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

function chat_last_n_rows($num_rows)
{
    $max_id = db_max(CHAT_TABLE, "id");

    $n = $max_id - $num_rows;
    $sql = "SELECT * FROM " . CHAT_TABLE . " WHERE id > $n ORDER BY chat.stamp";
    return db_fetch_all($sql);
}


?>