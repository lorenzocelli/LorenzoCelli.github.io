const codequote = function() {
    let ns = {};
    
    const SRC_ATT = "quote-src";
    const LINES_ATT = "quote-lines";

    function extractLines(code, fromLine, toLine, trim = true) {
        if (fromLine < 1) return code;
        var lines = code.split('\n').slice(fromLine - 1, toLine + 1);
        if (trim) {
            var pad = lines[0].length - lines[0].trimStart().length;
            lines = lines.map(line => line.slice(pad));
        }
        code = lines.join('\n');
        return code;
    };

    function request(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = () => reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
            xhr.send();
        });
    };

    function fetchCode(codeUrl, fromLine, toLine)
    {
        return new Promise(function(resolve, reject) {
            request(codeUrl)
                .then(function(response) {
                    const code = extractLines(response, fromLine, toLine);
                    resolve(code);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    };

    function quoteAll(callback) {
        let promises = [];
        const elements = document.querySelectorAll('code');

        elements.forEach(function(element) {
            if (!element.hasAttribute(SRC_ATT)) return;

            let from = -1;
            let to = -1;

            if (element.hasAttribute(LINES_ATT)) {
                const lines = element.getAttribute(LINES_ATT).split('-');
                if (lines.length === 2) {
                    from = parseInt(lines[0]);
                    to = parseInt(lines[1]);
                }
            }

            let p = fetchCode(element.getAttribute(SRC_ATT), from, to)
            p.then(function (code) {
                element.textContent = code;
            });
            promises.push(p);
        });

        Promise.all(promises).finally(callback);
    };

    function onReady(callback) {
        if(document.readyState === "complete" || document.readyState === "interactive") {
            callback();
            return;
        }
        
        window.addEventListener("DOMContentLoaded", callback);
    };

    ns.all = function(callback) {
        onReady(() => quoteAll(callback));
    };

    return ns;
}();
