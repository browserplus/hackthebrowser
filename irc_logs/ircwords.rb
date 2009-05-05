#!/usr/bin/env ruby
# interact with mysql to determine the most interesting things we're 
# talking about today, this week, and this month

require "mysql"
require "json/json.rb"

connInfo = JSON.parse(File.read("/home/hackthebrowser/dbpasswd.json"))

my = Mysql::new(connInfo["server"], connInfo["user"],
                connInfo["pass"], connInfo["db"])

NUM_TOP_WORDS = 100
MIN_LETTERS = 4

# "uninteresting" words
IGNORE_LIST = [ 'that', 'with', 'have', 'what', 'this', 'just' , 'about',
                'there', 'should', 'will', 'like', 'want', 'need',
                'only', 'into', 'yeah', 'from', 'make' , 'know', 'back',
                'when', 'until', 'which', 'well', 'then', 'some',
                'they', 'does', 'right', 'more', 'sure', 'could',
                'each', 'would', 'http', 'also', 'where', 'here',
                'than', 'them', 'your', 'much', 'doesn', 'build', 'think',
		'good', 'bad', 'after', 'before', 'such', 'both', 'away',
		'knew', 'actually', 'between', 'made', 'down', 'where', 
		'first', 'very', 'know', 'these', 'people', 'over', 
		'other', 'only', 'into', 'could', 'said', 'been', 'which',
		'being', 'those', 'through', 'still' ]

# let the database decide what the boring words are
#IGNORE_LIST = Hash.new
#popwords = my.query("SELECT word FROM popularWords WHERE isInteresting = 0")
#popwords.each { |x| IGNORE_LIST.store(x[0],0); IGNORE_LIST.store(x[0]+'s',0); }

# add users names to that list
usernames = my.query("SELECT DISTINCT who FROM chat")
usernames.each { |x| IGNORE_LIST.push(x[0]) }

# given a mysql result set of strings, count the occurances of
# words present, and return an array of the top 'count' occuring words,
# ignoring words with fewer than MIN_LETTERS , or those in the IGNORE_LIST
def topwords (res, count)
  hsh = Hash.new
  res.each do |x|
    x[0].scan(/[a-zA-Z_]+/).each do |y|
      # now y is a word.  only care about words > 3 letters
      if y.length >= MIN_LETTERS && ! IGNORE_LIST.include?(y)
        hsh[y] = hsh.key?(y) ? hsh[y] + 1 : 1
      end
    end
  end
  hsh.sort { |l,r| r[1] <=> l[1] }.slice(0..count)
end

# dump a hash to a file as "word, occurances"
def dumpToFile (words, file)
  f = File.new(file, "w+")
  words.each do |word,count|
    f.puts word + "," + count.to_s
  end
end

# selecting utterances
basequery = "SELECT utterance FROM chat ";

query = basequery + " WHERE stamp > NOW() - INTERVAL 1 day"
dumpToFile(topwords(my.query(query), NUM_TOP_WORDS), "irc_day.csv")

query = basequery + " WHERE stamp > NOW() - INTERVAL 7 day"
dumpToFile(topwords(my.query(query), NUM_TOP_WORDS), "irc_week.csv")

query = basequery + " WHERE stamp > NOW() - INTERVAL 1 month"
dumpToFile(topwords(my.query(query), NUM_TOP_WORDS), "irc_month.csv")

query = basequery
dumpToFile(topwords(my.query(query), NUM_TOP_WORDS), "irc_forever.csv")
