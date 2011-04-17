// ==UserScript==
// @name           MetaFilter Scroll Tag
// @namespace      http://plutor.org/
// @description    Tracks your last-read comment in threads, and allows you to jump back to it easily.
// @include        http://metafilter.com/*
// @include        http://*.metafilter.com/*
// ==/UserScript==
//
// OPERA USERS:
// This script has been tested as working in Opera 9.26 for Windows.  You will need
// to also add the Greasemonkey builtin function emulator script available here:
//     <http://userjs.org/scripts/browser/enhancements/aa-gm-functions>
//
// DONE 2011-03-15
// * Use cookies that last 10 years instead of everything else
//
// TODO
// * Mark the last comment if scrolled to the bottom (Opera)
// * Indicate marked comment(s) for "recent activity" page
// * Allow mark moving on "recent activity" page

// ============================================================================
// Intrepid MeFites who are dissatisfied with the markers and jumpers I have
// provided can use these objects to change them.  Making either one wider than
// 75 pixels is not advised, as that is how wide the left border is on
// MetaFilter. You may use this website to create the base64-encoded URLs:
//   <http://www.sveinbjorn.org/dataurlmaker>s
//
var markerconf = {
    width: '35',     // pixels
    height: '15',
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAPCAYAAABut3YUAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gDBA4sJYLQS4YAAAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAQ5JREFUSMfN1TFqhEAUxvF%2FYCEICaSzMGAKU60oOUGqbezSWbjX2ENs6xHiAewEm5ArRCyFKJmQUpFJ6aYKOJJkt3An%2B2CKYRjej2H4HsBO43oFbH6pM2BXVRU6SghBFEV10zT3QP0npiiKoyAMw8BxnL0gBbNareogCF7mxmRZdp3n%2Bd2%2BF1qML5mm%2BR7H8dPcGN%2F3H8Z7y7JIksSOouh5DFIwUkoJCB3%2F5yeQgun7XgJvaKopSMF0XacV8w3abrd2GIaPCqZt28%2ByLD90YoQQbDabGlgrmGEYzl3XvZq7oed5B%2BXOYnJ%2BCdz8VwBOMbfAeu7GUsqLQ5JYwaRpugSWx0jgQ0bCSc0mTmlqfwF0xNik%2FyQ5bQAAAABJRU5ErkJggg%3D%3D'
};
var jumperconf = {
    width: '15',
    height: '35',
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAjCAYAAABLuFAHAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gDBA8IJuvzka0AAAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAYJJREFUSMel1LFugkAYwPE%2FaKpEu3UzOWOYTTp2c%2BniO%2FAGDr6Kmy%2Fg4GuUJ2jqTCMaxi4KKJhyXdBoyx1SSAgH3%2F2%2B7wMODEDyz60J4HleZWjbNiY1tuZ5sFqtmE6nn0KIL9Xk7Xb7NJvNBsPh8BYDjMfj9%2Fl8%2FqHCk8nkGRj8qQwgpZTAtwpnWZYVtg1wOp1SIFbhPF6M0zRNgUiFkyRJynCownm8GB%2BPx6SkshofDoczPq8643qcx5VY23Ycx6VY2XYeL8ZRFCUlldU4DENt5f1%2Bn9yD5dXDuhzzeDHe7XbaFZbHi3GWZaZhGE3NV2gqMdACuhrcKsOPGtzW4XYJrlW5Vaeytu0G8KDBDR3WLk%2Bg%2BD1bloVt26%2BdTudFJaMo6lqWdTk3AFnnp%2B8HQVAJ5vN9Exg5jnN3giAIcBzHB0ZGfq0vhHhbLBb9Xq9XCjebzQjwjauYNsFvWJS8L4RYu64rPc%2B77K7rSiHEGuiX3dZNgirwJsFyuawMLwkAVwd%2FAGRf4dA3CSb%2BAAAAAElFTkSuQmCC',
    maxopacity: 1.0,   // Out of 1.0
    fadeindur: 0.25    // Seconds
};
//
// ============================================================================

var thread_id;
var markedcomment;
var comments = new Array();
var lastscroll;
var nextshow;
var markerdat;

//
// mst_init
//
// Determines if this is a thread or not, and sets everything up
//
function mst_init() {
    thread_id = mst_threadUniqName(location.href);

    if (thread_id) {
        // This is a thread
        mst_initThread();
    } else if (mst_isRecentActivity(location.href)) {
        mst_initRecentActivity();
    } else {
        // This is not a thread
        mst_findThreads();
    }
}

//
// mst_initThread
//
// Initializes everything if this is a thread view
//
function mst_initThread() {
    mst_initComments();
    mst_loadValue();
    mst_showJumper(0);
    document.addEventListener('scroll', function() { mst_hideJumper() }, false);
    document.addEventListener('scroll', function() { mst_findTopComment() }, false);
    mst_findTopComment(); // Just to get us started

    // Focusing the comment textarea should set the tag to the bottom
    var newcomment = document.getElementById('comment');
    if (newcomment) {
        var y = mst_documentHeight();
        newcomment.addEventListener('focus', function() { mst_findTopComment(y) }, false);
    }
}

//
// mst_documentHeight
//
// Returns the total height of the entire document, in pixels
//
function mst_documentHeight() {
    if (window.scrollMaxY != null) {
        // Firefox
        return window.scrollMaxY + window.innerHeight;
    } else if (document.documentElement.clientHeight) {
        // Opera
        return document.documentElement.clientHeight;
    }
}

//
// mst_scrollLocation
//
// Returns the scroll position of the top of the screen, in pixels
//
function mst_scrollLocation() {
    if (window.scrollY != null) {
        // Firefox
        return window.scrollY;
    } else if (document.body.scrollTop) {
        // Opera
        return document.body.scrollTop;
    }
}

//
// mst_scrollBottom
//
// Returns the scroll position of the bottom of the screen, in pixels
//
function mst_scrollBottom() {
    return mst_scrollLocation() + window.innerHeight;
}

//
// mst_threadUniqName
//
// Argument: url = the url of the thread
//
// Returns a uniq name of the thread: "$subdomain$threadid"
//
function mst_threadUniqName(url) {
    var urlm = url.match(/^http:\/\/([^\/]*\.)?metafilter.com\/(\d+)\//);
    if (urlm)
        return urlm[1] + urlm[2];
    return "";
}

//
// mst_initComments
//
// Finds all of the comment DOM objects and puts them into an array
// for easy future use
//
function mst_initComments() {
    var alldivs = document.getElementsByTagName('div');
    for (var i=0; i<alldivs.length; ++i) {
        if (alldivs[i].className.match(/comments/) &&
            alldivs[i].id != 'prevDiv' && alldivs[i].id != 'prevDiv2' &&
            alldivs[i].innerHTML.match(/posted by/)) {
            comments.push(alldivs[i]);
        } // is a comment
    } // loop divs
}

//
// mst_findThreads
//
// Finds all of the threads listed on the page, and replaces the '(mm new)'
// listings with ones that are more accurate.
//
function mst_findThreads() {
    var alldivs = document.getElementsByTagName('span');
    for (var i=0; i<alldivs.length; ++i) {
        if (alldivs[i].className == 'smallcopy' &&
            alldivs[i].innerHTML.match(/posted by/)) {
            var metabits = alldivs[i].childNodes;
            // First pass - delete 'mm new' links
            for (var j=0; j<metabits.length; ++j) {
                var bit = metabits[j];
                var m;
                if (bit.tagName && bit.tagName.toLowerCase() == 'b' &&
                    bit.innerHTML.match(/\d+ new/)) {
                    bit.parentNode.removeChild(bit);
                }
            } // loop bits of info

            // Second pass - add new 'mm new' links
            for (var j=0; j<metabits.length; ++j) {
                var bit = metabits[j];
                var m;
                if ( bit.tagName && bit.tagName.toLowerCase() == 'a' &&
                     (m = bit.innerHTML.match(/^(\d+) (comment|answer)s?$/)) ) {
                    var total = m[1];
                    var tid = mst_threadUniqName(bit.href);
                    if (tid) {
                        var markedid = mst_getValue(tid);
                        var markednum = mst_getValue(tid + "num");
                        var newc = total - markednum;
                        if (!markedid || !markednum) {
                            newc = total;
                            markedid = '';
                        }
                        if (newc > 0) {
                            // There are new comments
                            var newnew = document.createElement('b');
                            newnew.style.color = 'white';
                            newnew.style.marginLeft = '0.4em';
                            newnew.innerHTML = '(<a href="'
                                             + bit.href
                                             + '#'
                                             + markedid
                                             + '" target="_self" class="new">'
                                             + newc
                                             + ' new</a>)';
                            bit.parentNode.insertBefore( newnew,
                                                         bit.nextSibling );
                        }
                    }
                } // is a comments link
            } // loop bits of info
        } // is a thread
    } // loop divs

}

//
// mst_loadValue
//
// Argument: t = thread id (optional, defaults to global thread_id)
//
// Gets the comment id for the thread, finds the first comment after the
// anchor with that name, and marks it
//
function mst_loadValue(t) {
    if (!t) t = thread_id;
    var comment_id = mst_getValue(t);

    // Find the anchor
    var anchors = document.getElementsByTagName('a');
    for (var i=0; i<anchors.length; ++i) {
        if (anchors[i].name == comment_id) {
            // Find the comment div after the anchor
            var a = anchors[i];
            while (a && (!a.className || !a.className.match(/comments/) &&
                         a.id != 'prevDiv' && a.id != 'prevDiv2')) {
                a = a.nextSibling;
            }
            
            if (a) {
                markedcomment = a;
                mst_mark(a);
            }

            break;
        }
    }
}

//
// mst_findTopComment
//
// Argument: ysc = number of pixels from the top (optional, defaults to current position)
// Argument: dropped = is this is a search caused by a dropped marker?
//
// If dropped is false, finds the first comment below the scroll point. If it's
// below the currently marked comment, it marks it.
// If dropped is true, finds the last comment above the scroll point and marks it.
//
function mst_findTopComment(ysc, dropped) {
    if (ysc == null) ysc = mst_scrollLocation();
    var topc;

    if (!dropped) {
        // Scroll to the last comment if we're scrolled to the bottom of the document
        if (ysc >= window.scrollMaxY)
            ysc = mst_documentHeight();

        // Don't do anything if this is the same place we already were
        if (ysc == lastscroll) return;
    }

    lastscroll = ysc;

    // Assuming the comments array is in order
    for (var i=0; i<comments.length; ++i) {
        var c = comments[i];
        var cy = c.offsetTop;

        if (!topc)
            topc = c;

        if (dropped) {
            // Trying to find the last comment above ysc
            if ( cy <= ysc ) {
                topc = c;
            } else {
                break;
            }
        } else {
            // Trying to find the first comment below ysc
            topc = c;
            if ( cy >= ysc ) {
                break;
            }
        }
    }

    if (topc && (dropped || !markedcomment || markedcomment.offsetTop < topc.offsetTop)) {
        mst_mark(topc);
    }
}

//
// mst_mark
//
// Argument: c = DOM object of the comment to mark
//
// Moves the marker to the comment indicated, and saves the comment id
//
function mst_mark(c) {
    var marker = document.getElementById("mst_marker");
    if (!marker) {
        // Create it
        marker = document.createElement('div');
        marker.id = "mst_marker";
        marker.style.backgroundImage = 'url(' + markerconf.img + ')';
        marker.style.backgroundRepeat = 'no-repeat';
        marker.style.width = "" + markerconf.width + 'px';
        marker.style.height = "" + markerconf.height + 'px';
        marker.style.position = 'absolute';
        marker.style.cursor = 'move';

        document.body.appendChild(marker);
        marker.addEventListener('mousedown', mst_grabMarker, false);
    }

    // Mark - top aligned
    marker.style.top = "" + (c.offsetTop) + "px";
    marker.style.left = "" + (75/2 - markerconf.width/2) + "px";

    markedcomment = c;
    var comment_id = mst_commentIdOf(c);
    var comment_num = mst_commentNumOf(c);

    // Save
    if (thread_id && comment_id && comment_num) {
        mst_setValue(thread_id, comment_id);
        mst_setValue(thread_id + "num", comment_num);
    }
}

//
// mst_commentIdOf
//
// Argument: c = DOM object of the comment
//
// Returns the comment_id pulled from the name of the anchor immediately
// before the given comment
//
function mst_commentIdOf(c) {
    // Find the anchor right before the comment div
    while (c && (!c.tagName || c.tagName.toLowerCase() != 'a')) {
        c = c.previousSibling;
    }

    return (c) ? c.name : null;
}

//
// mst_commentIdOf
//
// Argument: c = DOM object of the comment
//
// Returns the index(+1) of the given comment in the comments array
//
function mst_commentNumOf(c) {
    for (var i=0; i<comments.length; ++i) {
        if (comments[i] == c) {
            return i+1;
        }
    }
    
    return 0;
}

//
// mst_showJumper
//
// Argument: fade = fraction from 0.0 to 1.0, defaults to 0
//
// Show the jumper with an opacity of $fade, calls itself with fade incremented
// by 0.1 until it's fully visible.
//
function mst_showJumper(fade) {
    if (!markedcomment) return;

    var winbottom = mst_scrollBottom();
    var commenty = markedcomment.offsetTop;

    if (commenty > winbottom) {
        // Show it
        var jumper = document.getElementById("mst_jumper");
        if (!jumper) {
            // Create it
            jumper = document.createElement('div');
            jumper.id = "mst_jumper";
            jumper.style.position = 'absolute';
            jumper.style.backgroundImage = 'url(' + jumperconf.img + ')';
            jumper.style.backgroundRepeat = 'no-repeat';
            jumper.style.height = "" + jumperconf.height + "px";
            jumper.style.width = "" + jumperconf.width + "px";
            jumper.style.cursor = 'pointer';

            var grabber = document.createElement('div');
            grabber.id = "mst_jumper_grabber";
            grabber.style.width = "" + jumperconf.width + "px";
            grabber.style.height = "" + (jumperconf.height / 3) + "px";
            grabber.style.position = 'relative';
            grabber.style.top = "0px";
            grabber.style.left = "0px";
            grabber.style.cursor = "move";

            jumper.appendChild(grabber);
            document.body.appendChild(jumper);

            jumper.addEventListener('mousedown', mst_grabMarker, false);
            jumper.addEventListener('click', mst_useJumper, false);
        }

        jumper.style.display = 'block';
        jumper.style.top = "" + (winbottom - jumperconf.height - 5) + "px";
        jumper.style.left = "" + (75/2 - jumperconf.width/2) + "px";

        if (!fade || fade < 0)
            fade = 0;

        // Amount to fade in by = 25msec / fadeindur;
        fade += (0.025 / jumperconf.fadeindur);

        if (fade < jumperconf.maxopacity) {
            jumper.style.MozOpacity = fade;
            jumper.style.opacity = fade;
            nextshow = setTimeout( mst_showJumper, 25, fade );
        } else {
            jumper.style.MozOpacity = jumperconf.maxopacity;
            jumper.style.opacity = jumperconf.maxopacity;
        }
    }
}

//
// mst_useJumper
//
// Jump to the marked comment. Called when the jumper is clicked.
//
function mst_useJumper() {
    // Go to the marked comment
    var id = mst_commentIdOf(markedcomment);
    if (id) location.href = "#" + id;
}

//
// mst_hideJumper
//
// Argument: keephidden = Don't schedule the showJumper call (defaults to 0)
//
// Hide the jumper immediately, and schedule a jumper re-show.  Keeps only a single
// re-show timer so it'll keep pushing it back until scrolling stops.
//
function mst_hideJumper(keephidden) {
    var jumper = document.getElementById("mst_jumper");

    if (jumper) {
        jumper.style.display = 'none';
    }

    if (nextshow) {
        clearTimeout(nextshow);
        nextshow = null;
    }

    if (!keephidden) nextshow = setTimeout( mst_showJumper, 350, 0 );
}

//
// mst_grabMarker
//
// Called when the marker or jumper are first grabbed for moving
//
function mst_grabMarker(e) {
    var grabber = document.getElementById('mst_marker');

    // Remove the mousedown event
    grabber.removeEventListener('mousedown', mst_grabMarker, false);

    // Add mousemove/mouseup events
    document.body.addEventListener('mousemove', mst_moveMarker, false);
    document.body.addEventListener('mouseup', mst_dropMarker, false);

    // Record where we started
    markerdat = {
                  x: e.pageX,
                  y: e.pageY,
                  g: grabber,
                  init: 0
                };

    e.preventDefault();
    return false;
}

//
// mst_moveMarker
//
// Called when a grabbed marker is moved. Moves the marker to where the mouse is,
// and tracks the location in the markerdat object.
//
function mst_moveMarker(e) {
    var x = e.pageX;
    var y = e.pageY;

    // Is this the initial movement
    if (!markerdat.init) {
        // Is initial movement sufficient?
        if ( Math.abs(markerdat.x-x) + Math.abs(markerdat.y-y) > 15 ) {
            // Hide the jumper, don't start redisplay timer
            markerdat.init = 1;
            mst_hideJumper(1);
        }
    }

    // Show the marker under the mouse
    if (markerdat.init) {
        var marker = document.getElementById('mst_marker');
        marker.style.MozOpacity = '0.7';
        marker.style.opacity = '0.7';
        marker.style.top = "" + (y - markerconf.height/2) + "px";
        marker.style.left = "" + (x - markerconf.width/2) + "px";
    }

    e.preventDefault();
    return false;
}

//
// mst_dropMarker
//
// Called when a grabbed marker is dropped. Finds the nearest comment, and marks it.
//
function mst_dropMarker(e) {
    // Did we ever have movement?
    if (markerdat.init) {
        var marker = document.getElementById('mst_marker');
        marker.style.MozOpacity = '1.0';
        marker.style.opacity = '1.0';

        // Record the new marked location
        mst_findTopComment(e.pageY, 1);
    }

    mst_showJumper(0);

    // Re-add the mousedown 
    markerdat.g.addEventListener('mousedown', mst_grabMarker, false);

    // Remove mousemove/mouseup events
    document.body.removeEventListener('mousemove', mst_moveMarker, false);
    document.body.removeEventListener('mouseup', mst_dropMarker, false);
}

//
// mst_isRecentActivity
//
function mst_isRecentActivity(url) {
    return (url.indexOf("http://www.metafilter.com/contribute/activity/") == 0);
}

function mst_initRecentActivity() {
    var alldivs = document.getElementsByTagName('div');
    for (var i=0; i<alldivs.length; ++i) {
        if (alldivs[i].style.fontWeight == 'bold' &&
            (m = alldivs[i].innerHTML.match(/(\d+) total comments.*most recent comment/))) {
            var total = m[1];
            var thisdiv = alldivs[i];
            var metabits = thisdiv.childNodes;

            for (var j=0; j<metabits.length; ++j) {
                var bit = metabits[j]

                if ( bit.tagName && bit.tagName.toLowerCase() == 'a' ) {
                    var tid = mst_threadUniqName(bit.href);
                    var url = bit.href.replace(/#\d+$/, '');
                    if (tid) {
                        var markedid = mst_getValue(tid);
                        var markednum = mst_getValue(tid + "num");
                        var newc = total - markednum;

                        if (!markedid || !markednum) {
                            newc = total;
                            markedid = '';
                        }
                        if (newc > 0) {
                            // There are new comments
                            var newdiv = document.createElement('div');
                            newdiv.style.fontWeight = 'bold';
                            newdiv.innerHTML = thisdiv.innerHTML.replace(/ total comments\..*/, "") +
                                " total comments.  " + newc + " since ";
                            
                            
                            var newcount = document.createElement('a');
                            newcount.target = bit.target;
                            newcount.href = url + '#' + markedid;
                            newcount.innerHTML = 'the last comment you read';
                            newdiv.appendChild( newcount );

                            newdiv.innerHTML += ".  " +
                                thisdiv.innerHTML.replace(/.* total comments\./, "")
                            
                            thisdiv.parentNode.replaceChild(newdiv, thisdiv);
                        }
                        break;
                    }
                } // is a comment link
            }
        } // is a thread header
    }
}

//
// get/set helper functions
//

function mst_getValue(key) {
    return Cookie.get("mst_" + key);
}
function mst_setValue(key, value) {
    Cookie.set("mst_" + key, value, 10*365*24, undefined, "metafilter.com");
}

/*****************************************************************************
 * Modified from cookie-js 0.4 by Maxime Haineault (max@centdessin.com)
 * <http://code.google.com/p/cookie-js/> 
 */
Cookie = {      
    /** Get a cookie's value */
    get: function(key) {
            // Still not sure that "[a-zA-Z0-9.()=|%/_]+($|;)" match *all* allowed characters in cookies
            tmp =  document.cookie.match((new RegExp(key +'=[a-zA-Z0-9.()=|%/_]+($|;)','g')));
            if(!tmp || !tmp[0]) return null;
            else return unescape(tmp[0].substring(key.length+1,tmp[0].length).replace(';','')) || null;
            
    },      
    
    /** Set a cookie */
    set: function(key, value, ttl, path, domain, secure) {
            cookie = [key+'='+    escape(value),
                              'path='+    ((!path   || path=='')  ? '/' : path),
                              'domain='+  ((!domain || domain=='')?  window.location.host : domain)];
            
            if (ttl)         cookie.push('Expires='+ Cookie.hoursToExpireDate(ttl));
            if (secure)      cookie.push('secure');
            return document.cookie = cookie.join('; ');
    },
    
    /** Unset a cookie */
    unset: function(key, path, domain) {
            path   = (!path   || typeof path   != 'string') ? '' : path;
    domain = (!domain || typeof domain != 'string') ? '' : domain;
            if (Cookie.get(key)) Cookie.set(key, '', 'Thu, 01-Jan-70 00:00:01 GMT', path, domain);
    },

    /** Return GTM date string of "now" + time to live */
    hoursToExpireDate: function(ttl) {
            if (parseInt(ttl) == 'NaN' ) return '';
            else {
                    now = new Date();
                    now.setTime(now.getTime() + (parseInt(ttl) * 60 * 60 * 1000));
                    return now.toGMTString();                       
            }
    }
}
/****************************************************************************/

//
// Start by initializing
//
mst_init();
