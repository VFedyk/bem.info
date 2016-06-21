'use strict';

var marked = require('marked'),
    hljs = require('highlight.js'),
    GithubSlugger = require('github-slugger');

// Возвращает фукцию, а не просто объект. Если этого не делать, получается общий
// для всех страниц slugger, что приводит к сквозной, а не постраничной нумерации
// дублирующихся якорей заголовков
module.exports = function() {
    var renderer = new marked.Renderer(),
        slugger = new GithubSlugger();

    renderer.heading = function(text, level) {
        var anchor = slugger.slug(text);

        var options = this.options,
            headingClass = options.headingClassName && ' class="' + options.headingClassName + level + '"',
            headingAnchorClass = options.headingAnchorClassName && ' class="' + options.headingAnchorClassName + '"';

        return '<h' + level + headingClass + ' id="' + anchor + '">' +
            '<a href="#' + anchor + '"' + headingAnchorClass + '></a>' + text + '</h' + level + '>';
    }

    return {
        renderer: renderer,

        headingClassName: 'article__heading article__heading_',
        headingAnchorClassName: 'article__heading-anchor',

        highlight: function (code, lang) {
            // TODO: implement true highligting for 'files' codeblock: different colors for directories, files, comments
            if (lang === 'files') {
                return code.replace(/\`/g, ''); // temporary implementation of 'files' highlighting
            } else if (lang === 'text') {
                return code;
            } else if (lang) {
                if (lang === 'bemjson') {
                    lang = 'js';
                }

                return hljs.highlight(lang, code).value;
            }
            return hljs.highlightAuto(code).value;
        }
    }
}

