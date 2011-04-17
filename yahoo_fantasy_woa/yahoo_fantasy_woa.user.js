// ==UserScript==
// @name        Yahoo Fantasy WOA
// @namespace   http://plutor.org/
// @description Shows Plutor's predicted 2011 WOA for players on the Yahoo Fantasy site
// @include     http://baseball.fantasysports.yahoo.com/*
// ==/UserScript==

var woadata = {
    'albert pujols': 21.25, 'roy halladay': 21.03, 'felix hernandez': 20.46,
    'hanley ramirez': 18.69, 'ryan braun': 16.32, 'tim lincecum': 15.26,
    'carl crawford': 15.01, 'joe mauer': 14.69, 'carlos gonzalez': 14.58,
    'matt holliday': 14.51, 'miguel cabrera': 14.34, 'evan longoria': 14.07,
    'c.c. sabathia': 13.81, 'david wright': 13.26, 'joey votto': 13.25,
    'robinson cano': 12.51, 'chris carpenter': 11.96, 'josh johnson': 11.95,
    'troy tulowitzki': 11.80, 'matt kemp': 11.78, 'jon lester': 11.34,
    'alex rodriguez': 11.22, 'ubaldo jimenez': 11.06, 'jayson werth': 11.03,
    'cliff lee': 10.97, 'josh hamilton': 10.86, 'clayton kershaw': 10.48,
    'shin-soo choo': 10.44, 'matt cain': 9.95, 'mark teixeira': 9.59,
    'justin verlander': 9.57, 'ryan zimmerman': 9.30, 'dan uggla': 9.23,
    'brian mccann': 9.23, 'prince fielder': 9.22, 'jered weaver': 9.09,
    'ryan howard': 8.89, 'derek jeter': 8.74, 'zack greinke': 8.66,
    'mat latos': 8.60, 'andrew mccutchen': 8.57, 'brandon phillips': 8.39,
    'adrian gonzalez': 7.92, 'david price': 7.88, 'tommy hanson': 7.69,
    'chase utley': 7.66, 'roy oswalt': 7.66, 'nelson cruz': 7.38,
    'johan santana': 7.37, 'bobby abreu': 7.14, 'ichiro suzuki': 7.08,
    'hunter pence': 7.04, 'jose bautista': 7.00, 'rickie weeks': 6.91,
    'vladimir guerrero': 6.91, 'joakim soria': 6.81, 'ian kinsler': 6.69,
    'justin upton': 6.60, 'torii hunter': 6.55, 'ted lilly': 6.39,
    'cole hamels': 6.37, 'alexis rios': 6.33, 'shane victorino': 6.27,
    'jose reyes': 6.19, 'mariano rivera': 6.18, 'martin prado': 6.12,
    'brian wilson': 6.10, 'mark reynolds': 6.02, 'alexei ramirez': 6.00,
    'casey mcgehee': 5.88, 'andre ethier': 5.70, 'nick markakis': 5.61,
    'adrian beltre': 5.48, 'drew stubbs': 5.46, 'rafael soriano': 5.41,
    'rajai davis': 5.26, 'delmon young': 5.24, 'neftali feliz': 5.22,
    'denard span': 5.21, 'billy wagner': 5.09, 'corey hart': 5.09,
    'heath bell': 5.06, 'victor martinez': 5.02, 'angel pagan': 4.89,
    'juan pierre': 4.87, 'kelly johnson': 4.57, 'brett gardner': 4.36,
    'ben zobrist': 4.36, 'john danks': 4.33, 'b.j. upton': 4.27,
    'tim hudson': 4.17, 'trevor cahill': 4.12, 'elvis andrus': 4.03,
    'david ortiz': 3.97, 'paul konerko': 3.67, 'vernon wells': 3.59,
    'adam jones': 3.59, 'pablo sandoval': 3.47, 'adam dunn': 3.31,
    'jonathan papelbon': 3.25, 'andrew bailey': 3.19, 'kevin youkilis': 3.18,
    'chone figgins': 3.17, 'mike napoli': 3.05, 'dustin pedroia': 3.00,
    'billy butler': 2.83, 'nick swisher': 2.81, 'jay bruce': 2.79,
    'jason kubel': 2.75, 'aubrey huff': 2.73, 'jason heyward': 2.71,
    'stephen drew': 2.65, 'johnny damon': 2.54, 'raul ibanez': 2.43,
    'aaron hill': 2.38, 'carlos lee': 2.37, 'miguel olivo': 2.34,
    'austin jackson': 2.34, 'howie kendrick': 2.33, 'marlon byrd': 2.32,
    'michael cuddyer': 2.31, 'carlos marmol': 2.30, 'wandy rodriguez': 2.27,
    'colby rasmus': 2.12, 'aramis ramirez': 2.03, 'carlos quentin': 1.96,
    'buster posey': 1.94, 'andres torres': 1.89, 'yovani gallardo': 1.80,
    'francisco rodriguez': 1.77, 'michael bourn': 1.72, 'scott podsednik': 1.69,
    'derrek lee': 1.63, 'jason bartlett': 1.63, 'shaun marcum': 1.61,
    'chad billingsley': 1.60, 'kurt suzuki': 1.49, 'curtis granderson': 1.48,
    'jonathan broxton': 1.37, 'clay buchholz': 1.31, 'jorge posada': 1.27,
    'miguel tejada': 1.25, 'ryan ludwick': 1.22, 'adam lind': 1.20,
    'marco scutaro': 1.05, 'hiroki kuroda': 1.00, 'daniel hudson': 0.97,
    'c.j. wilson': 0.81, 'huston street': 0.79, 'jonny gomes': 0.73,
    'philip hughes': 0.71, 'jason bay': 0.68, 'ryan dempster': 0.59,
    'matt garza': 0.53, 'rafael furcal': 0.51, 'jaime garcia': 0.50,
    'alfonso soriano': 0.48, 'j.d. drew': 0.45, 'erick aybar': 0.42,
    'franklin gutierrez': 0.37, 'jose valverde': 0.36, 'max scherzer': 0.33,
    'scott rolen': 0.14, 'ryan franklin': 0.14, 'francisco cordero': 0.11,
    'cody ross': 0.08, 'brian fuentes': 0.06, 'tyler clippard': -0.06,
    'ian desmond': -0.07, 'placido polanco': -0.09, 'matt capps': -0.10,
    'adam laroche': -0.14, 'jonathan sanchez': -0.20, 'john buck': -0.21,
    'hong-chih kuo': -0.28, 'a.j. pierzynski': -0.28, 'geovany soto': -0.29,
    'brett anderson': -0.31, 'chase headley': -0.41, 'juan uribe': -0.43,
    'yadier molina': -0.45, 'garrett jones': -0.58, 'david murphy': -0.63,
    'ryan theriot': -0.71, 'miguel montero': -0.80, 'james loney': -0.84,
    'john axford': -0.85, 'gordon beckham': -0.89, 'julio borbon': -0.98,
    'neil walker': -0.99, 'alberto callaspo': -1.02, 'hideki matsui': -1.02,
    'colby lewis': -1.06, 'jimmy rollins': -1.09, 'ian stewart': -1.1,
    'leo nunez': -1.15, 'matt wieters': -1.18, 'brian duensing': -1.21,
    'jhonny peralta': -1.44, 'chris perez': -1.47, 'dallas braden': -1.48,
    'ryan raburn': -1.57, 'justin morneau': -1.58, 'david aardsma': -1.59,
    'jose lopez': -1.66, 'nyjer morgan': -1.67, 'mike aviles': -1.68,
    'matt thornton': -1.71, 'brett myers': -1.77, 'starlin castro': -1.77,
    'sergio romo': -1.78, 'yunel escobar': -1.8, 'brandon lyon': -1.81,
    'jair jurrjens': -1.82, 'luke gregerson': -1.86, 'omar infante': -1.87,
    'mike adams': -1.88, 'carlos pena': -1.92, 'ricky nolasco': -1.93,
    'ryan doumit': -1.94, 'luke scott': -1.95, 'orlando hudson': -2,
    'bronson arroyo': -2, 'cliff pennington': -2.09, 'bobby jenks': -2.16,
    'ervin santana': -2.19, 'john jaso': -2.2, "darren o'day": -2.27,
    'casey blake': -2.3, 'kevin gregg': -2.31, 'johnny cueto': -2.43,
    'tim stauffer': -2.45, 'alex gonzalez': -2.49, 'jonny venters': -2.5,
    'daniel bard': -2.54, 'russell martin': -2.69, 'lance berkman': -2.72,
    'jhoulys chacin': -2.75, 'jose tabata': -2.8, 'gaby sanchez': -2.81,
    'mike stanton': -2.81, 'chris coghlan': -2.83, 'travis wood': -2.85,
    'evan meek': -2.87, 'jake peavy': -2.88, 'madison bumgarner': -2.89,
    'asdrubal cabrera': -2.93, 'ricky romero': -2.99
};

function show_woa() {
	var players = document.evaluate(
		'//a[starts-with(@href, \'http://sports.yahoo.com/mlb/players/\')][not(img)] ',
        document, null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
	);

	for (var i = 0; i < players.snapshotLength; i++) {
		var player = players.snapshotItem(i);

        var name = new String(player.innerHTML).toLowerCase();
        name = name.replace(new RegExp("[àáâãäå]", 'g'),"a");
        name = name.replace(new RegExp("æ", 'g'),"ae");
        name = name.replace(new RegExp("ç", 'g'),"c");
        name = name.replace(new RegExp("[èéêë]", 'g'),"e");
        name = name.replace(new RegExp("[ìíîï]", 'g'),"i");
        name = name.replace(new RegExp("ñ", 'g'),"n");                            
        name = name.replace(new RegExp("[òóôõö]", 'g'),"o");
        name = name.replace(new RegExp("œ", 'g'),"oe");
        name = name.replace(new RegExp("[ùúûü]", 'g'),"u");
        name = name.replace(new RegExp("[ýÿ]", 'g'),"y");
        name = name.replace(new RegExp("[^\\s\\w]", 'g'),"");

        var val = woadata[name];

        if (val != undefined) {
            // Make the color between #090 and #900 based on WOA
            var red = Math.floor(10-val);
            if (red > 9) red = 9;
            if (red < 0) red = 0;
            var green = Math.floor(val);
            if (green > 9) green = 9;
            if (green < 0) green = 0;
            var color = "#" + red + green + "0";

            var woaspan = document.createElement('span');
            woaspan.innerHTML = val;
            woaspan.style.background = color;
            woaspan.style.color = 'white';
            woaspan.style.paddingLeft = '0.2em';
            woaspan.style.paddingRight = '0.2em';
            woaspan.style.marginLeft = '0.5em';
            woaspan.style.fontFamily = 'sans-serif';
            woaspan.style.fontWeight = 'bold';
            woaspan.style.borderRadius = '0.3em';
            player.appendChild(woaspan);
        }
	}
};

show_woa();

