// ==UserScript==
// @name        LearnedLeague Profile Watch
// @namespace   http://plutor.org/
// @description Allows you to see the current standings for a set of watched profiles all at once
// @include     http://learnedleague.com/*
// @include     http://www.learnedleague.com/*
// ==/UserScript==

var profiles_watched;
var WATCHLIST_URL = '/profiles/_watched.html';
var STORAGE_NAME = 'profiles_watched';
var STORAGE_SEP = '::';
var WATCH_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sDDxAuNep8QrUAAAJCSURBVDjLldJPSyphFMfx7zyjTRYRZlJIMC3sHdiidNOqVSG4DVoFvaJegIu2mY9EUIuCoEUUBhYFuc2iP46O2jzjOM%2FdXAKxC93f%2Fnz4ncMx%2BBvHceTh4SGu6zIxMYFSin6%2Fz%2FLyMisrKxv8IwbAw8ODLJVK5PN5ZmZm0FoTBAFKKarVKo1Gg93dXUzTHIEin5%2Bfcm9vj%2B3tbYIg4Pb2FqUUhmEQj8dJp9NYlsX%2B%2Fv6PDSIHBwdsbm7Sbrd5fHwkk8kQj8cJw5B6vc7LywuJRIL7%2B3s%2BPj5kIpEYahF5fX1ldnaW8%2FNz0uk0nU6HXq%2BH1ppoNMpgMMDzPJaWlri%2Bvh5tMDk5yfv7O0IIXNclCAKEEGit%2Bfr6%2Bl4nFovx9vY2ChiGQb%2FfJxqNEolEGB8fxzRNwjBECIHv%2Bwgh8Dzv5xt4nsfY2BimaX4DlmURhiHdbhfTNBFC0Gw2SaVSI4CYm5vDdV2mpqbwfR%2Bt9fdQEARorfF9n3q9zvz8%2FCiQz%2Bc5PT0lFothGAaO49BqtWg2myilABgMBqyvr1Mul6nVanIImJ6e3tja2uL4%2BBjHcVBK0Wq1aLfbPD8%2FU6vVsCwL27YpFApUKhWq1aoc%2BkSATqcjK5UKT09PQ4%2BUTCZpNBrkcjls28Z1XcrlMmtra2QymQ2DX%2BTo6Eje3d2RzWaxbZter4eUktXVVX4FAJycnMibmxtyuRyLi4t0u12KxeLvAYCzszN5eXlJNptFCMHV1dX%2FAQAXFxeyVCqxsLDAzs4OfwBQqBdST3U8eQAAAABJRU5ErkJggg%3D%3D';
var WATCHED_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMKSURBVHjaYmRAADEeHt4yByenADU1NYWPHz9%2BP3bs2InrV69MBcptYMABAAIIhiyc3b1eHT5x7v%2F9R8%2F%2B33345P%2B12%2Ff%2Fn754%2FX9rz6R%2F%2FAKCC4FqmLFpBAggkKCErZPb4clTpogyMTEzbDh1lWH%2FnWcMFx%2B%2FYmD%2B8Z1BVUmJUUvPSP%2Fg3p2sf%2F%2F82YtuAEAAMXNwcrVMmzXX6fuvPwwzz91n8HQwZ%2FA31WIw1lBkuPL1HwPQNQzyosIM33%2F%2BMrt57fJcoJ4vyAYABBCTgbFZgIKsNMOsk7cYVHQ1GW5%2F%2F8Ow9ekHhh3PPjL85eFhuMkhxPDx2w8GMys7dqB6T3QXAAQQi5qaquyDJy8Y3nLyM9z6%2FIvhNSMzAyszE8Pvf%2F8Z3n%2F7yfDkDyPDo9%2BMDKK8%2FAyMjExy%2F%2F%2F%2FQzEAIAAVc4wDMAgDMNARpATExv8%2F2QEiVRVkxaOHyyLCcsfKQ9fEMMUC%2BPemCnytkKeyXg8AYl8dAcRy7%2B7dB1ycnEqS%2Fz4zCDAxMEixszDwAw358%2B8fw%2FO%2FfxneMfxnEP7%2Fi%2BHu8%2BcM%2F%2F79u4%2FuBYAAYjp98tjad%2B%2FeMehz%2Fmdg%2FPSJgf3XLwYBoDN5gJqZvv9kkP76luHPly8Ml86eANl9D90AgABi%2FvPnz%2FnHjx%2FHOjk68vL8%2BMLw%2B%2Ft3BlagIV%2FfvWdg%2FviWgf3rB4YfP38xuNpbM3749DX43p2bR4H6HsEMAAggUDr49vTxwz13bt%2F2kVdS5eNmYWL48%2F0rw4%2FPnxge3H%2FIcO70aQY1VRUGc2N9BjMLS%2FYXr9%2BF3bl57SRQH9g7AAGEjARYWFjrlDV0zplYO73XNbF6KigivhYo3uQflfJv2YZd%2F6%2FfefD%2FyKmL%2F%2F1Co7%2FBohQggIhCTExMGUBD%2Fi5Zv%2FP%2FdWASP3bm0v%2FgqIQfQCl%2FgABiJsaA%2F%2F%2F%2Fn7l15cLjX%2F%2BYfARFJZiU5KQZDA2NWK5ev%2BELEEDMRDuD4f%2BF29cu3fn%2B%2B78%2Fv7A406ePHxiWLpizCSCAGMgAIdqG5l94%2BQWXA9l8AAEGAAqaMIzpoCLsAAAAAElFTkSuQmCC';
var THROBBER_URL = 'data:image/gif;base64,R0lGODlhEAAQAPYAAP39%2FfX19enp6f7%2B%2Ftvb2%2Fv7%2B%2FHx8fLy8uXl5d3d3ebm5vj4%2BNHR0aqqqtra2p%2Bfn6WlpePj46GhoampqZubm9%2Ff36CgoJ2dnefn55mZmevr6%2Fn5%2BeTk5Pz8%2FPf397q6urCwsPPz8%2Brq6rS0tOHh4be3t%2B7u7rKysq%2Bvr7u7u%2Bzs7OLi4rOzs62trfDw8O%2Fv7%2Fb29szMzMbGxsnJycTExMXFxcvLy8PDw8fHx8LCwtnZ2e3t7fT09NjY2Pr6%2BtfX19bW1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQFAAAaACwAAAAAEAAQAAAFOaAmjmRpnmiqBosqVlCWNUrqyHiGnIWVy5OT4oc7mCJEmcG0oBAlgxODmEgxLrIHwQXACFzgsLgUAgAh%2BQQFAAAAACwDAAMACgAKAAAGMUCAEODZDIeIUquV0gxJy2hLBOiwpMsPQIONBgTdZWiD6o6EhC5nSAAtT6ujUGU6BgEAIfkECQAAAQAsAwADAAoACgAABjHAgDCwKQyHmlkuF3MNBcto7hUAyKRLW8CFjXpe3SWscOvihJyuZsihLWuCo9BwOAYBACH5BAUAAAIALAAAAAAQABAAAAdEgAKCg4SFhoeIiYoFHYqCBwRAQAkBiS6SmECVhgA6mZIJhwGfmD6GPKSSG4YdP6Q6iDukBok7PZI6tIoDATCOv8DBhYEAIfkEBQAAAQAsAwADAAoACgAABjHAgDCwKQyHmlkuF3MNBcto7iWUSZe2gOsa9by4S1jhxsUNAhyuZsihLWuCYwBgOByDACH5BAUAAAAALAMAAwAKAAoAAAYxQIAQ4NkMh4hSq5XSDEnLaEsE6LCkyw9Ag40GBN1laIPqjoSELmdIAC1Pq6NQZToGAQA7';
var CACHE_VER = '2'; // increment this when new releases make old cache data obsolete

function init() {
    init_header_link();
    init_watchlinks();

    var path = location.pathname;
    if (get_profilename()) {
        init_profile();
    } else if (path == WATCHLIST_URL) {
        init_watchers();
    }
}

/**
 * Add a watch button to any link on a page that goes to a profile
 */
function init_watchlinks() {
    var links = document.getElementsByTagName("A");
    var thisuser = get_profilename();

    for (var i=0; i<links.length; ++i) {
        var link = links[i];

        // Skip if the link's parent already contains a watch button
        if (link.parentNode.getElementsByClassName('watchbutton').length > 0)
            continue;

        var username = user_from_href(link.href);

        // Skip if the link matches the current URL
        if (username && username != thisuser) {
            var watchbutton = create_watchbutton(username, 0);

            if (link.nextSibling == undefined)
                link.parentNode.appendChild(watchbutton);
            else
                link.parentNode.insertBefore(watchbutton, link.nextSibling);
        }
    }

    update_watchbuttons();
}

function user_from_href(href) {
    var re = href.match(/\/(profiles\/|profiles\.php\?)([^\.\/#]*)(\.shtml)?$/);
    if (re) {
        return re[2];
    } else {
        return null;
    }
}

function get_profilename() {
    return user_from_href(location.href);
}

function init_profile() {
    // Add the watch/watched button
    var header = document.getElementsByTagName("H1");
    if (header.length < 1) return;
    header = header[0];

    var watchbutton = create_watchbutton(get_profilename(), 1);

    header.appendChild(watchbutton);
    update_watchbuttons();
}

function create_watchbutton(username, hastext) {
    var watchbutton = document.createElement("span");
    watchbutton.className = 'watchbutton';
    watchbutton.setAttribute('username', username);
    watchbutton.style.cursor = 'pointer';

    if (hastext) {
        watchbutton.innerHTML = "loading";
        watchbutton.style.border = 'solid 1px #999';
        watchbutton.style.fontSize = '50%';
        watchbutton.style.marginLeft = '1em';
        watchbutton.style.padding = '0.5em 8px 0.5em 26px';
        watchbutton.style.background = '#dde url(' + WATCH_IMG + ') no-repeat 4px';
    } else {
        watchbutton.innerHTML = "&nbsp;";
        watchbutton.style.background = 'transparent url(' + WATCH_IMG + ') no-repeat center';
        watchbutton.style.padding = '8px';
        watchbutton.style.marginLeft = '0.5em';
    }

    // When it's clicked, toggle
    watchbutton.addEventListener('click', function(e) {
        // Change value
        var username = e.target.getAttribute('username');
        var watched = isWatching(username);
        setWatching(username, !watched);

        // Update button
        update_watchbuttons();
    }, false);

    return watchbutton;
}

function update_watchbuttons() {
    // Change button
    var watchbuttons = document.getElementsByClassName('watchbutton');
    for (var i=0; i<watchbuttons.length; ++i) {
        var username = watchbuttons[i].getAttribute('username');
        var watched = isWatching(username);
        if (watchbuttons[i].innerHTML != "&nbsp;")
            watchbuttons[i].innerHTML = watched ? "watched" : "watch";
        watchbuttons[i].style.backgroundImage = 'url(' +
                    (watched ? WATCHED_IMG : WATCH_IMG) + ')';

        if (watched) {
            watchbuttons[i].alt = username + ' is watched';
            watchbuttons[i].title = username + ' is watched';
        } else {
            watchbuttons[i].alt = 'Watch ' + username;
            watchbuttons[i].title = 'Watch ' + username;
        }
    }
}

var current_season;
function get_current_season() {
    if (current_season == undefined) {
        var tabs_menu = document.getElementById('tabs-menu');
        if (tabs_menu == undefined) return;

        var menu_links = tabs_menu.getElementsByTagName('A');
        if (menu_links == undefined || menu_links.length < 1) return;
        if (menu_links[0] == undefined) return;
        
        var sm = menu_links[0].innerHTML.match(/^(LL\d+) Standings$/);

        if (sm) current_season = sm[1];
    }

    return current_season;
}

/**
 * Show all the watchers
 */
function init_watchers() {
    // Remove the content
    // Find the tabs, go up a level, then siblings until you find a table
    var tabs = document.getElementById("tabs");
    if (tabs == undefined) return;

    var table = tabs.parentNode;
    do {
        table = table.nextSibling;
    } while (table != undefined &&
                (table.tagName == undefined || table.tagName.toUpperCase() != 'TABLE'));
    if (table == undefined) return;

    // and then clean out the first cell
    var tablecells = table.getElementsByTagName("TD");
    if (tablecells == undefined || tablecells.length < 1) return;
    var firstcell = tablecells[0];
    while (firstcell.childNodes.length > 0) {
        firstcell.removeChild(firstcell.childNodes[0]);
    }

    // H1 title
    var h1 = document.createElement("H1");
    h1.innerHTML = "Watched Profiles";
    firstcell.appendChild(h1);

    // Construct the table
    table = document.createElement("TABLE");
    table.className = "sortable";
    var thead = document.createElement("THEAD");
    var thead_row = document.createElement("TR");
    var cell = document.createElement("td");
    thead_row.appendChild(cell);
    table.hasHeaders = 0; // No headers for now -- we'll get them with the first profile
    thead.appendChild(thead_row);
    table.appendChild(thead);

    var tbody = document.createElement("TBODY");
    table.appendChild(tbody);

    // Add the watched profiles
    var watched = getAllWatched().sort();
    for (var i=0; i<watched.length; ++i) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var profilelink = document.createElement("a");
        profilelink.innerHTML = watched[i];
        profilelink.href = '/profiles.php?' + watched[i];
        cell.appendChild(profilelink);
        row.appendChild(cell);

        // Second cell for the throbber
        cell = document.createElement("td");
        cell.style.textAlign = 'center';
        row.appendChild(cell);

        tbody.appendChild(row);
    }

    firstcell.appendChild(table);

    // Get the profiles
    var rows = table.rows;
    for (var i=1; i<rows.length; ++i) { // Skip the header obviously
        var row = rows[i];
        var throbbercell = row.childNodes[1];

        var img = document.createElement("img");
        img.src = THROBBER_URL;
        throbbercell.appendChild(img);

        request_profile(watched[i-1], row);
    }

    // Add links to the list
    init_watchlinks();

    // Add the sortable javascript
    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = '/scripts/prototype-1.5.0.js';
    document.body.appendChild(script);

    script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = '/scripts/tablekit.js';
    document.body.appendChild(script);
}

function request_profile(username, row) {
    // Check the cache first
    var content = getCache(username);
    var headercontent = getCache('__HEADER__');
    
    // Get the content of the table if it wasn't in cache
    if (content == undefined) {
        // XHR non-asynchronous
        var req = new XMLHttpRequest();
        req.open('GET', '/profiles/stats.php?' + username, false);
        req.send(null);

        if (req.status == 200) {
            // OK - parse it
            var parser = document.createElement('div');
            parser.innerHTML = req.responseText;

            var trs = parser.getElementsByTagName('TR');
            if (trs == undefined || trs.length <= 0) return;

            // The first row is a header
            if (headercontent == undefined) {
                headercontent = trs[0].innerHTML;
                setCache('__HEADER__', headercontent);
            }

            // Get the first non-header row that doesn't have a className that includes 'total'
            for (var i=1; i<trs.length; ++i) {
                if (trs[i].className.indexOf('total') < 0) {
                    var seasonrow = trs[i];
                    content = seasonrow.innerHTML;
                    setCache(username, content);

                    parser.innerHTML = "";
                    break;
                }
            }
        }
    }

    // Now parse the content of the row
    if (content != undefined) {
        var seasonrow = document.createElement('tr');
        seasonrow.innerHTML = content;

        // Make sure the player is playing this season
        var currseason = get_current_season();
        if (seasonrow.cells[0].innerHTML != currseason) {
            var throbbercell = row.childNodes[1];
            throbbercell.innerHTML = "<small>Inactive</small>";
            return;
        }

        update_profile(row, seasonrow);

        // Also update the header if we haven't yet
        if (!row.parentNode.hasHeaders && headercontent) {
            seasonrow.innerHTML = headercontent;
            update_profile(row.parentNode.parentNode.rows[0], seasonrow);
            row.parentNode.hasHeaders = 1;
        }
    } else {
        // ERROR
        // Remove the throbber and replace with error
        var throbbercell = row.childNodes[1];
        throbbercell.innerHTML = "<small>ERROR</small>";
    }
}

function update_profile(row, seasonrow) {
    // Remove every cell in row other than the first
    while (row.childNodes.length > 1) {
        row.removeChild(row.childNodes[1]);
    }

    // Move the last cell over first
    var c = seasonrow.cells[seasonrow.cells.length - 1];
    c.parentNode.removeChild(c);
    row.appendChild(c);

    // Then move all of the rest of the cells over (starting with the second one)
    while (seasonrow.cells.length > 1) {
        var c = seasonrow.cells[1];
        c.parentNode.removeChild(c);
        row.appendChild(c);
    }
}

/**
 * Add the "show watched profiles" link to the header, just after "LLnn Standings"
 */
function init_header_link() {
    // TODO - Update this number real-time when someone is watched/unwatched
    var watched = getAllWatched();

    var tabs_menu = document.getElementById('tabs-menu');
    if (tabs_menu == undefined) return;

    var menu_links = tabs_menu.getElementsByTagName('A');
    if (menu_links == undefined || menu_links.length < 1) return;
    if (menu_links[0] == undefined || !menu_links[0].innerHTML.match(/Standings$/)) return;
    var standings_link = menu_links[0];

    var newlink = document.createElement('A');
    newlink.href = WATCHLIST_URL;
    newlink.innerHTML = 'Watched Profiles (' + (watched.length) + ')';

    var newsep = document.createTextNode(" | ");

    standings_link.parentNode.insertBefore(newlink, standings_link.nextSibling);
    standings_link.parentNode.insertBefore(newsep, newlink);
}

/**
 * Return true or false depending on if the profile is currently watched
 */
function isWatching(name) {
    if (profiles_watched == undefined) {
        var list = localStorage.getItem(STORAGE_NAME);
        if (list != undefined)
            profiles_watched = list.split(STORAGE_SEP);
        else
            profiles_watched = new Array();
    }

    for (var i=0; i<profiles_watched.length; ++i) {
        if (profiles_watched[i] == name)
            return 1
    }

    return 0;
}

/**
 * Add as watcher if value is true. Otherwise, remove as watcher
 */
function setWatching(name, value) {
    var watching = isWatching(name);
    if (!value == !watching) return;

    if (value)
        profiles_watched.push(name);
    else
        for (var i=0; i<profiles_watched.length; ++i) {
            if (profiles_watched[i] == name)
                profiles_watched.splice(i, 1)
        }

    localStorage.setItem(STORAGE_NAME, profiles_watched.join(STORAGE_SEP));
}

function getAllWatched() {
    isWatching('foo'); // Just to make sure the value is loaded
    return profiles_watched;
}

function getCache(username) {
    var expires = localStorage.getItem("pw_cache_expires_" + CACHE_VER + "_" + username);
    now = new Date();
    if (now.getTime() < expires)
        return localStorage.getItem("pw_cache_" + CACHE_VER + "_" + username);
    else
        return undefined
}

function setCache(username, value) {
    // Cache for six hours
    expires = new Date();
    expires.setTime(expires.getTime() + (6 * 60 * 60 * 1000));
    localStorage.setItem("pw_cache_expires_" + CACHE_VER + "_" + username, expires.getTime());
    localStorage.setItem("pw_cache_" + CACHE_VER + "_" + username, value);
}

init();

