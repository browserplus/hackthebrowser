<?php
require "/usr/local/www/hackthebrowser.org/php/site.php";
site_header(NAV_HOME, "Hack the Browser", COLS_2);
?>

<h1>Welcome to Hack the Browser</h1>

<p>
    This is an unofficial and informal catalog of current open source
	services written for BrowserPlus from Yahoo!.  What you'll find here
    are brief descriptions of all known open source projects and hacks
	for the BrowserPlus platform.  These hacks will be either in ruby or
	native code and are built to put new functionality within the reach
	of browser based javascript.
</p>
<p>
    You can find a ton more information about BrowserPlus over at
	the <a href="http://browserplus.yahoo.com">Official Website</a>,
	but briefly, BrowserPlus is a "meta-plugin" that aims to make
	it easy to build robust scriptable web plugins that run in most
	popular environments.
</p>

<h2> Our Projects </h2>

<p>
    Most of the projects you'll find here are hosted on
	<a href="http://github.com">github</a>.  Developing your service
	on github certainly isn't a requirement, but if you haven't played
	with it, give it a look.  Simply because git and github were
	designed from the ground up with geographically distributed
	colloaboration in mind, it'll ultimately be less work to get services
    onto the official BrowserPlus distribution servers.
</p>

<h2>Contribute</h2>

<p>
    Want to hack on an existing project?  fork it!  Have a new idea or
	implementation that you want to get listed?  Just drop us an email
	&lt;browserplus-feedback 4t yahoo-inc d0t com&gt;, and we'll get you
	listed.
</p>

<h2>About HackTheBrowser.org</h2>

<p>
    HackTheBrowser.org is an unofficial catalog, not endorsed by Yahoo!.
	It's built and maintained today by a handful of the original authors
	of the BrowserPlus platform.  As time goes on we hope to incrementally
	improve it with tools to help you more efficiently share your work
	(with the goal of perhaps getting it published), and comment on
	others projects.
</p>

<?php site_sidebar(); ?>

<?php site_mod("Projects", "hello test"); ?>

<?php site_footer(); ?>
