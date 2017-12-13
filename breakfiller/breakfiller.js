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
                "New Dehli": 1273840,
                "Singapore": 1880252,
                "Phoenix": 5308655,
                "Rio de Janeiro": 3451190,
                "Reykjavik": 3416900,
                "Beijing": 1816670,
                "Moscow": 524901,
                "Kolkata": 1275004,
                "Madrid": 3117735
            }
        },

        templates = {},
        templateURLs = {
            news: "https://binaryfunt.github.io/breakfiller/templates/news.html",
            // weather: "https://binaryfunt.github.io/breakfiller/templates/weather.html",
            title: "https://binaryfunt.github.io/breakfiller/templates/title.html"
        },


        mainDiv = $("#main > .wrapper")[0],

        fadeTime = 500,
        keystrokeDelay = 15,
        advanceDelay = (getParameterByName("dur") * 1000 || 10000),
        descriptionTruncLen = 300;



    getTemplates()
        .then(getNews);



    function randNewsAPIurl() {
        var sourceIDs = getObjKeys(news.sources),
            rand = randInt(sourceIDs);
        console.log(rand);
        return "https://newsapi.org/v1/articles?source="+sourceIDs[rand]+"&sortBy="+news.sort+"&apiKey="+news.APIKey;
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


    function createTitle(titleText) {
        var content = {
            title: titleText
        };
        var titleHtml = Mustache.render(templates.title, content);
        $(mainDiv).append(titleHtml);
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

    // function populateArticleTemplate(template, article) {
    //
    //
    //     runSlideshow();
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
        // if (!news.template) {
        //     $.get(news.templateURL)
        //         .done(function(response) {
        //             news.template = response;
        //         }).fail(function() {
        //             console.error("Failed to fetch template");
        //         });
        // }

        $.get(randNewsAPIurl())
            .done(function(response) {
                var articles =  response.articles,
                    source = response.source;
                    // articlePromises = [];
                // console.log(articles[0]);
                createTitle(news.sources[source]);

                for (var i = 0; i < articles.length; i++) {
                    // articlePromises.push(
                    createArticle(articles[i], source);
                    // );
                }
                // Promise.all(articlePromises).then(runSlideshow);
                runSlideshow();
            }).fail(function() {
                console.error("Failed to fetch news");
                // TODO: retry request with new URL
            });
    }


    function getWeather(APIurl) {
        $.get(APIurl, handleWeatherAPIReq, "json");
    }

    function runSlideshow() {
        var title = $(".title");
        title.on("animationend webkitAnimationEnd oAnimationEnd oanimationend MSAnimationEnd", function(event) {
            if (event.originalEvent.animationName == "wipe-text") {
                title.fadeOut(0)
                    .promise().done(function() {
                        var articles = $(".article");
                        articles.each(function() {
                            var textElements = $(this).find(".text");
                            // console.log(textElements[0].innerHTML);
                            $(this).slideshow(fadeTime, textElements);
                        });
                    });
            }
        });
        // console.log("running slide show");

    }

    function refresh() {
        console.log("Refreshing now");
        $(mainDiv).empty();
        getNews();
        // TODO preload images
    }

});
