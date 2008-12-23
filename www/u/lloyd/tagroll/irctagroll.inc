<?php

define(IRCWORDS_LOCATION, '/usr/local/www/hackthebrowser.org/irc_logs/');

######## 
# Get all of the available word groups as an array
######## 
function getHotIRCWordGroups()
{
  #XXX
}

######## 
# Get an array of "hot" irc words.
# ARGUMENTS: 
#  $group:  The "timeframe" from which you wish to access words     
#           Because generation of word lists is an expensive operation
#           it is done periodically and there is a discrete set of
#           groups from which you can access hot words  
#     day - hot words from the last 24 hours or so
#     week - hot words from the last week
#     month - hot words from the last month 
#     forever - the hottest of the hot
#   NOTE: this list may grow.  getHotIRCWordGroups() will return an
#         array with all of the available groups.
#  $howmany - an upper limit on how many words to fetch 
# RETURN
#  An array of arrays.  Each sub array has two elements, the first is the
#  word, the second is the number of times it's occured in the given
#  period.
######## 
function getHotIRCWords($timeframe, $howmany) {
  $lines = file(IRCWORDS_LOCATION . "irc_${timeframe}.csv");

  $words = array();
  $cnt = 0;
  foreach ($lines as $line) {
    $terms = split(',', $line);
    $words[$terms[0]] = $terms[1];
    if (++$cnt > $howmany) {
      break;
    }
  }

  uksort($words, "strnatcasecmp");

  return $words;
}

####
# take a return array from "getHotIRCWords" and normalize the
# "frequency" element to a floating point number between $min and $max
###
function normalizeIRCWords($ircWordsArray, $desiredMin=0.0, $desiredMax=1.0)
{
  $min = -1;
  $max = -1;

  # determine min/max
  foreach ($ircWordsArray as $word => $freq) {
    $max = ($max == -1) ? $freq : max($max, 0 + $freq);
    $min = ($min == -1) ? $freq : min($min, 0 + $freq);
  }

  # normalize
  foreach ($ircWordsArray as $word => $freq) {  
	if ($max - $min != 0) {
        $ircWordsArray[$word] = ((($freq - $min) / (1.0 * $max - $min)) *
                             ($desiredMax - $desiredMin)) + $desiredMin;
	} else {
		// default font size
		$ircWordsArray[$word] = 9;
	}
  }

  return $ircWordsArray;
}

######## 
# A function that calls getHotIRCWords and "renders" the result.
######## 
function renderHotIRCWords($alias, $tagCount,
                           $minPixelSize=7, $maxPixelSize=35, 
                           $aClassName="tagCloudElement")
{
  $retArray = getHotIRCWords($alias, $tagCount);
  $retArray = normalizeIRCWords($retArray, $minPixelSize, $maxPixelSize);

  foreach ($retArray as $k => $v) {
    $sz = round($v);
    echo "<a style=\"font-size:{$sz}px\" class=\"$aClassName\" href=\"/irc/index.php?search=${k}\">$k</a> ";

  }
}
?>
