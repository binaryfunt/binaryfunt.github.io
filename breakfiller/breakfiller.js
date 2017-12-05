$(document).ready(function() {

    var newsAPIKey = "919866e8cdde468e954a8230d4c63ece",
        sources = {
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
        sort = "top",
        weatherAPIKey = "30fe2db74a3ccfa7d32842547855dc2f",
        weatherCities = [
            2643743, //London
            2950159, //Berlin
            5128581, //NY
            5368361, //LA
            292223, //Dubai
            1273840, //New Delhi
            1880252, //Signapore
            5308655, //Pheonix
            3451190, //Rio
            3416900, //Reykjavic
            1816670, //Beijing
            524901, //Moscow
            1275004, //Kolkata
            3117735 //Madrid
        ],

        // newsTemplate = "news-template.html", cannot load (cross origin request)
        newsTemplate = "https://binaryfunt.github.io/breakfiller/news-template.html",

        mainDiv = $("#main > .wrapper")[0],

        fadeTime = 500,
        keystrokeDelay = 15,
        advanceDelay = (getParameterByName("dur") * 1000 || 10000),
        descriptionTruncLen = 300;


    function randNewsAPIurl() {
        var sourceIDs = getObjKeys(sources),
            rand = randInt(sourceIDs);
        console.log(rand);
        return "https://newsapi.org/v1/articles?source="+sourceIDs[rand]+"&sortBy="+sort+"&apiKey="+newsAPIKey;
    }
    function randWeatherAPIurl() {
        var rand = randInt(weatherCities);
        return "http://api.openweathermap.org/data/2.5/forecast?id="+weatherCities[rand]+"&APPID="+weatherAPIKey;
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

    function randInt(array) {
        return Math.floor(Math.random()*array.length);
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

    function truncate(text) {
        var truncRegex = new RegExp("^(.{" + descriptionTruncLen + "}[\\w']*).*");
        return text.replace(truncRegex, "$1").concat("\u2026");
    }


    $.fn.slideshow = function(fadeTime, textElements) {
        var self = this;
            deferred = new $.Deferred();

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
                // console.log("doing text type", self[0].innerHTML);
                $(this).typeText()
                    .then(clearCurrent);
            });
        }

        function clearCurrent() {
            if ($.fn.typeText.queue.length == 0) {
                // console.log("clearing current", self);
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
        }

        // Make a shared variable between the elements that call this function:
        // This will call them in the order that were added
        $.fn.slideshow.queue = $.fn.slideshow.queue || [];

        $.fn.slideshow.queue.push(progress);

        // If it's the 1st element added or no elements are in the queue, call progress()
        if ($.fn.slideshow.queue.length == 1) {
            $.fn.slideshow.queue[0]();
        }
    };

    $.fn.typeText = function() {
        var self = this,
            deferred = new $.Deferred(),
            str = self.html(),
            i = 0,
            isTag,
            text;

        function clearCurrent() {
            // Remove element that just ended from queue:
            $.fn.typeText.queue.shift();
            // Remove element from DOM:
            self.fadeOut(fadeTime);

            if ($.fn.typeText.queue.length > 0) {
                // Call type() for next element in queue:
                $.fn.typeText.queue[0]();
                // console.log(queue[0], "called");
            }
            deferred.resolve();
        }

        function type() {
            var text = str.slice(0, ++i);

            function isDone() {
                return text == str;
            }

            if (isDone()) {
                // Wait before moving on to next element:
                setTimeout(clearCurrent, advanceDelay);
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

        self.html("");
        self.addClass("visible");

        // Make a shared variable between the elements that call this function:
        // This will call them in the order that were added
        $.fn.typeText.queue = $.fn.typeText.queue || [];

        $.fn.typeText.queue.push(type);
        // If it's the 1st element added or no elements are in the queue, call type()
        if ($.fn.typeText.queue.length == 1) {
            $.fn.typeText.queue[0]();
            // console.log(queue[0], "called");
        }
        return deferred.promise();
    };

    $.fn.getMaxHeight = function() {
        return Math.max.apply(null, this.map(function() {
            return $(this).outerHeight(includeMargin = true);
        }).get());
    };


    function handleNewsAPIReq(data, deferred) {
        // console.log(data);
        var articles =  data.articles,
            source = data.source,
            promises = [];
        // console.log(articles[0]);
        for (var i = 0; i < articles.length; i++) {
            articles[i].source = source;
            createArticle(articles[i], i == articles.length - 1);
        }
    }

    function createArticle(article, isLast) {
        var content = {
            category: sources[article.source],
            logoSrc: "img/"+article.source+".png",
            title: article.title,
            description: article.description,
            imgLink: article.urlToImage
        };
        if (content.description.length > descriptionTruncLen) {
            content.description = truncate(content.description);
        }
        $.get(newsTemplate, function(data) {
            articleHtml = Mustache.render(data, content);
            $(mainDiv).append(articleHtml);
            // return deferred.promise();
            // console.log("Added article", isLast);
            if (isLast) {
                runSlideshow();
            }
        });
    }

    // function populateArticleTemplate(template, article) {
    //
    //
    //     runSlideshow();
    // }


    function getNews(APIurl) {
        $.get(APIurl, handleNewsAPIReq, "json");
    }


    function getWeather(APIurl) {
        $.get(APIurl, handleWeatherAPIReq, "json");
    }

    function runSlideshow() {
        // console.log("running slide show");
        var articles = $(".article");
        articles.each(function() {
            var textElements = $(this).find(".text");
            // console.log(textElements[0].innerHTML);
            $(this).slideshow(fadeTime, textElements);
        });
    }

    function refresh() {
        $(mainDiv).empty();
        getNews(randNewsAPIurl());
        // TODO catch failure to load
        // TODO preload images
    }


    getNews(randNewsAPIurl());


});
