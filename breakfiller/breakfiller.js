$(document).ready(function() {

    var newsAPISrc = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=919866e8cdde468e954a8230d4c63ece",
        // newsTemplate = "news-template.html",
        newsTemplate = "https://binaryfunt.github.io/breakfiller/news-template.html"

        mainDiv = $("#main > .wrapper")[0];



    function handleNewsAPIReq(data) {
        articles =  data.articles;
        for (var i = 0; i < articles.length; i++) {
            createArticle(articles[i]);
            console.log(articles[i]);
        }
    }

    function populateArticleTemplate(template, article) {
        var content = {
            title: article.title,
            description: article.description
        };
        console.log(template);
        var html = Mustache.render(template, article);
        // $.template("template", template);
        // $.tmpl("template", article)
        //     .appendTo(mainDiv);
    }

    function createArticle(article) {
        // var content = {
        //     title: article.title,
        //     description: article.description
        // };
        $.get(newsTemplate, function(data) {
            populateArticleTemplate(data, article);
        });
        // $.template("template", MEOW);
        // $.tmpl("template", article)
        //     .appendTo(mainDiv);

        // $("<div/>", {
        //     text: article.title
        // }).appendTo(mainDiv);
    }

    function getNews() {
        $.get(newsAPISrc, handleNewsAPIReq, "json");
    }


    getNews();

});
