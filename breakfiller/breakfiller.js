$(document).ready(function() {

    var news = {
            APIKey: "919866e8cdde468e954a8230d4c63ece",
            sources: {
                "bbc-news": "top stories",
                // "sky-news": "top stories",
                "associated-press": "top stories",
                "the-verge": "tech news",
                "reuters": "top stories",
                "national-geographic": "science news",
                "new-scientist": "science news",
                "bloomberg": "business news",
                "cnbc": "business news",
                "cnn": "top stories",
                "engadget": "tech news",
                // "financial-times": "finance news"
            },
            sort: "top",
            lastRandInts: []
            // templateURL: "news-template.html", cannot load (cross origin request)
        },

        weather = {
            APIKey: "30fe2db74a3ccfa7d32842547855dc2f",
            cities: {
                "London": 2643743,
                "Berlin": 2950159,
                "New York City": 5128581,
                "Los Angeles": 5368361,
                "Dubai": 292223,
                "New Delhi": 1261481,
                "Singapore": 1880252,
                "Phoenix": 5308655,
                "Rio de Janeiro": 3451190,
                "Reykjavik": 6692263,
                "Beijing": 1816670,
                "Moscow": 524901,
                "Kolkata": 1275004,
                "Madrid": 3117735,
                "Geneva": 2660646,
                "Rome": 3169070,
                "Seattle": 5809844,
                "Melbourne": 2158177,
                "Brisbane": 7839562,
                "Edinburgh": 2650225,
                "Cardiff": 2653822,
                "Paris": 2988507,
                "Mexico City": 3530597,
                "Cape Town": 3369157,
                "Kiev": 703448,
                "Athens": 264371,
                "Helsinki": 658226,
                "Oslo": 6453366,
                "Stockholm": 2673730,
                "Amsterdam": 2759794,
                "Taipei": 1668341,
                "Tokyo": 1850147,
                "Chelyabinsk": 1508291,
                "Toronto": 6167865,
                "Washington DC": 4138106,
                "Miami": 4164138,
                "Dallas": 4684888,
                "Salt Lake City": 5780993,
                "Denver": 5419384,
                "Chicago": 4887398,
                "Winnipeg": 6183235,
                "Fairbanks": 5861897,
                "Jakarta": 1642911,
                "Mumbai": 1275339,
                "Nairobi": 184745,
                "Pretoria": 964137,
                "Lagos": 2332459,
                "Cairo": 360630,
                "Islamabad": 1176615,
                "Hong Kong": 1819729,
                "Santiago": 3871336,
                "Buenos Aires": 3435910,
                "Lima": 3936456,
                "San José": 3621849,
                "Halifax": 5969423,
                "St Louis": 4407066,
                "Dublin": 2964574,
                "Warsaw": 756135,
                "Vienna": 2761369,
                "Lisbon": 6458923,
                "Ankara": 323786
            },
            icons: {
                // Thunderstorms
                200: [24, 25],
                201: 23,
                202: 230,
                210: [24, 25],
                211: 23,
                212: 230,
                221: [24, 25],
                230: [24, 25],
                231: 23,
                232: 230,
                // Drizzle
                300: 13,
                301: 6,
                302: 6,
                310: 6,
                311: 6,
                312: 16,
                313: [17, 18],
                314: 160,
                321: [7, 8],
                // Rain
                500: 6,
                501: 16,
                502: 160,
                503: 160,
                504: 160,
                511: 60,
                520: [7, 8],
                521: [17, 18],
                522: [17, 18],
                531: [17, 18],
                // Snow
                600: 35,
                601: 35,
                602: 350,
                611: 60,
                612: 60,
                615: 60,
                616: 60,
                620: [36, 37],
                621: [36, 37],
                622: [36, 37],
                // Atmosphere
                701: [49, 50],
                711: 30,
                721: [49, 50],
                731: [49, 50],
                741: 30,
                751: [49, 50],
                761: 30,
                762: 38,
                771: 9,
                781: 10,
                // Clouds
                800: [3, 4],
                801: [2, 5],
                802: [2, 5],
                803: 1,
                804: 100,
                // Extreme
                900: 10,
                901: 10,
                902: 10,
                905: 9,
                906: 60,
                957: 9,
                958: 9,
                959: 9,
                960: 10,
                961: 10,
                962: 10
            },
            lastRandInts: []
        },

        templates = {},
        templateURLs = {
            news: "https://binaryfunt.github.io/breakfiller/templates/news.html",
            weather: "https://binaryfunt.github.io/breakfiller/templates/weather.html",
            title: "https://binaryfunt.github.io/breakfiller/templates/title.html"
        },


        mainDiv = $("#main > .wrapper")[0],

        fadeTime = 500,
        keystrokeDelay = 15,
        advanceDelay = (getParameterByName("dur") * 1000 || 10000),
        descriptionTruncLen = 300,
        weatherFormat = {
            numRounds: 2,
            numInEach: 4
        };



    getTemplates()
        // .then(getNews);
        .then(getWeather);



    function randNewsAPIurl() {
        var sourceIDs = getObjKeys(news.sources),
            rand = randInt(sourceIDs, news);
        console.log(rand);
        return "https://newsapi.org/v1/articles?source="+sourceIDs[rand]+"&sortBy="+news.sort+"&apiKey="+news.APIKey;
    }
    function randWeatherAPIurl() {
        var cityIDs = getObjValues(weather.cities),
            idString = "";
        for (var i = 0; i < weatherFormat.numRounds * weatherFormat.numInEach; i++) {
            idString += cityIDs[randInt(cityIDs, weather)];
            idString += ",";
        }
        idString = idString.slice(0, -1);
        return "https://api.openweathermap.org/data/2.5/group?id="+idString+"&APPID="+weather.APIKey;
    }

    function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function randInt(array, category) {
        // Returns rand int less than size of array, and not the same as stored last ints for the category
        var rand = Math.floor(Math.random()*array.length);
        if (category.lastRandInts.includes(rand)) {
            return randInt(array, category);
        } else {
            category.lastRandInts.shift();
            category.lastRandInts.push(rand);
            return rand;
        }
    }
    function getObjKeys(obj) {
        return Object.keys(obj);
    }
    function getObjKeysAsInts(obj) {
        return Object.keys(obj).map(Number);
    }
    function getObjValues(obj) {
        return Object.keys(obj).map(function(key) {
            return obj[key];
        });
    }
    function erf(x){
        // erf(x) = 2/sqrt(pi) * integrate(from=0, to=x, e^-(t^2) ) dt
        // with using Taylor expansion,
        //        = 2/sqrt(pi) * sigma(n=0 to +inf, ((-1)^n * x^(2n+1))/(n! * (2n+1)))
        // calculationg n=0 to 50 below (note that inside sigma equals x when n = 0, and 50 may be enough)
        var m = 1.00;
        var s = 1.00;
        var sum = x * 1.0;
        for(var i = 1; i < 50; i++){
            m *= i;
            s *= -1;
            sum += (s * Math.pow(x, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
        }
        return 2 * sum / Math.sqrt(3.14159265358979);
    }
    function wait(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function mpsToMph(speed) {
        return Math.round(speed*3600 / 1609);
    }
    function kelToCel(kelvin) {
        return Math.round(kelvin - 273.15);
    }

    function tempToHsl(temperature) {
        var x = parseFloat(temperature) + 100,
    	   hue = 125 - 125*erf((x - 110) / 20);
    	return "hsl("+hue+", 100%, 60%)";
    }

    function truncate(text) {
        var truncRegex = new RegExp("^(.{" + descriptionTruncLen + "}[\\w']*).*");
        return text.replace(truncRegex, "$1").concat("\u2026");
    }

    function getWeatherIconURL(response) {
        var iconID = weather.icons[response.weather[0].id],
            fragURL = "img/if_weather_";
            function isDaytime() {
                return (response.dt > response.sys.sunrise && response.dt < response.sys.sunset) || (response.dt < response.sys.sunrise && response.dt < response.sys.sunset - 86400);
            }
        if (typeof iconID == 'number') {
            return fragURL+iconID+".svg";
        } else {
            if (isDaytime) {
                return fragURL+iconID[0]+".svg";
            } else {
                return fragURL+iconID[1]+".svg";
            }
        }
    }

    // function colorInTemperatures() {
    //     $(".weather .temp").each(function() {
    //         var temperature = this.dataset.temperature;
    //         $(this).find("div").css("background", tempToHsl(temperature));
    //     });
    // }
    // function rotateWeatherVanes() {
    //     $(".weather .wind").each(function() {
    //         var direction = this.dataset.direction;
    //         $(this).find("img").css("transform", "rotate("+direction+"deg)");
    //     });
    // }


    $.fn.slideshow = function(fadeTime, textElements) {
        var self = this;
            // deferred = new $.Deferred();

        // Make a shared variable between the elements that call this function:
        // This will call them in the order that were added
        $.fn.slideshow.queue = $.fn.slideshow.queue || [];

        $.fn.slideshow.queue.push(progress);

        // If it's the 1st element added or no elements are in the queue, call progress()
        if ($.fn.slideshow.queue.length == 1) {
            $.fn.slideshow.queue[0]();
        }

        function start() {

        }

        function progress() {
            // var textContainer = self.find(".text-container");
            var textContainer = self.find(".text");
            self.show();
            // textContainer.height(textChildren.getMaxHeight());
            textContainer.height(textContainer.height());
            // console.log(textContainer.height());
            // self.height(textChildren.getMaxHeight());
            self.fadeTo(fadeTime, 1)
                .promise().done(doTextType);
        }

        function doTextType() {
            // console.log(textChildren.getMaxHeight());
            textElements.each(function() {
                // console.log("doing text type", $(this).html());
                $(this).typeText()
                    .then(clearCurrent);
            });
        }

        function clearCurrent() {
            // console.log("clearing current", self);
            // console.log(self);
            $.fn.slideshow.queue.shift();

            self.fadeOut(fadeTime)
                .promise().done(function() {
                    if ($.fn.slideshow.queue.length > 0) {
                        $.fn.slideshow.queue[0]();
                    } else {
                        refresh();
                    }
                });
        }
    };

    $.fn.typeText = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
                // deferred = new $.Deferred(),
            var str = self.html(),
                i = 0,
                isTag,
                text;

            self.html("");
            self.addClass("visible");

            type();

            function type() {
                text = str.slice(0, ++i);

                function isDone() {
                    return text == str;
                }

                if (isDone()) {
                    setTimeout(resolve, advanceDelay);
                    return;
                }
                self.html(text);

                var char = text.slice(-1);
                if (char == "<") {
                    isTag = true;
                }
                if (char == ">") {
                    isTag = false;
                }

                if (isTag) {
                    return type();
                }
                setTimeout(type, keystrokeDelay);
            }


        });
    };

    $.fn.getMaxHeight = function() {
        return Math.max.apply(null, this.map(function() {
            return $(this).outerHeight(includeMargin = true);
        }).get());
    };


    function displayTitle(titleText) {
        return new Promise(function(resolve, reject) {
            var content = {
                title: titleText
            },
                titleHtml = Mustache.render(templates.title, content);
            $(mainDiv).append(titleHtml);

            var title = $(".title");
            title.on("animationend webkitAnimationEnd oAnimationEnd oanimationend MSAnimationEnd", function(event) {
                if (event.originalEvent.animationName == "wipe-text") {
                    title.fadeOut(0)
                        .promise().done(resolve);
                }
            });
        });
    }

    function createArticle(articleData, source) {
        var content = {
            category: news.sources[source],
            logoSrc: "img/"+source+".png",
            title: articleData.title,
            description: articleData.description,
            imgLink: articleData.urlToImage
        };
        if (content.description && content.description.length > descriptionTruncLen) {
            content.description = truncate(content.description);
        }
        var articleHtml = Mustache.render(templates.news, content);
        $(mainDiv).append(articleHtml);
    }

    function createWeatherView(weatherData, title) {
        var content = {
            category: title,
            logoSrc: "img/openweathermap.svg",
            windVaneSrc: "img/wind-vane.svg",
            slides: []
        },
            row = 0;
        for (var slide = 0; slide < weatherFormat.numRounds; slide++) {
            content.slides.push({
                rows: []
            });
            for (; row < weatherFormat.numInEach * (slide + 1); row++) {
                var rowData = weatherData[row];
                content.slides[slide].rows.push({
                    city: rowData.name,
                    iconSrc: getWeatherIconURL(rowData),
                    description: rowData.weather[0].description,
                    temp: kelToCel(rowData.main.temp),
                    tempColor: tempToHsl(kelToCel(rowData.main.temp)),
                    wind: {
                        direction: rowData.wind.deg,
                        speed: mpsToMph(rowData.wind.speed)
                    }
                });
            }
        }
        // weatherData.forEach(function(row) {
        //     content.rows.push({
        //         city: row.name,
        //         iconSrc: getWeatherIconURL(row),
        //         description: row.weather[0].description,
        //         temp: kelToCel(row.main.temp),
        //         tempColor: tempToHsl(kelToCel(row.main.temp)),
        //         wind: {
        //             direction: row.wind.deg,
        //             speed: mpsToMph(row.wind.speed)
        //         }
        //     });
        // });
        var weatherHtml = Mustache.render(templates.weather, content);
        $(mainDiv).append(weatherHtml);
    }
    // function populateArticleTemplate(template, article) {
    //
    //
    //     newsSlideshow();
    // }


    function getTemplates() {
        return new Promise(function(resolve, reject) {
        //     $.when.apply(
        //         $,
        //         getObjValues(templateURLs).map(url => $.get(url))
        //     ).then(resolve);
            var URLs = getObjValues(templateURLs),
                templateNames = getObjKeys(templateURLs);
            var promises = [];
            // for (var i = 0; i < URLsArray.length; i++) {
            //     promises.push($.get(URLsArray[i]));
            // }
            URLs.forEach(url => promises.push($.get(url)));
            Promise.all(promises).then(function(responses) {
                for (var i = 0; i < responses.length; i++) {
                    templates[templateNames[i]] = responses[i];
                }
                resolve();
            });
        });
    }


    function getNews() {
        $.get(randNewsAPIurl())
            .done(function(response) {
                var articles =  response.articles,
                    source = response.source;
                    // articlePromises = [];
                // console.log(articles[0]);
                for (var i = 0; i < articles.length; i++) {
                    // articlePromises.push(
                    createArticle(articles[i], source);
                    // );
                }
                displayTitle(news.sources[source])
                    .then(newsSlideshow);
                // Promise.all(articlePromises).then(newsSlideshow);
            }).fail(function() {
                console.error("Failed to fetch news");
                // TODO: retry request with new URL
            });
    }


    function getWeather() {
        var title = "World Weather";

        weather.lastRandInts = new Array(weatherFormat.numRounds * weatherFormat.numInEach);
        weather.lastRandInts.fill(-1);

        $.get(randWeatherAPIurl())
            .done(function(response) {
                console.log(response.list);
                createWeatherView(response.list, title);
                displayTitle(title)
                    .then(weatherSlideshow);

                // colorInTemperatures();
                // rotateWeatherVanes();
            }).fail(function() {
                console.error("Failed to fetch weather");
            });
    }

    function newsSlideshow() {
        var articles = $(".article");
        articles.each(function() {
            var textElements = $(this).find(".text");
            // console.log(textElements[0].innerHTML);
            $(this).slideshow(fadeTime, textElements);
        });
        // console.log("running slide show");
    }

    function weatherSlideshow() {
        $(".weather").fadeTo(fadeTime, 1)
            .promise().done(function() {
                run();
            });

        async function run() { // jshint ignore:line
            for (var round = 0; round < weatherFormat.numRounds; round++) {
                var thisSlide = $(".weather tbody")[round];
                for (var row = 0; row < weatherFormat.numInEach; row++) {
                    // TODO: fadeTo the table rows, then fadeout that tbody/slide, then fadeTo next tbody/slide etc
                    var thisRow = $(thisSlide).children("tr")[row];
                    $(thisRow).fadeTo(fadeTime, 1);
                    await wait(200); // jshint ignore:line
                }
            }
        }
    }

    function refresh() {
        console.log("Refreshing now");
        $(mainDiv).empty();
        getNews();
        // TODO preload images
    }

});
