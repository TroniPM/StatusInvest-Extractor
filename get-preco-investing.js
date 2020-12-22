
var ticker = "";
var url = "";
var smlID = "";
var commentContentId = "";
function geet(date, smlID, commentContentId) {
    if (!date) {
        const d = new Date();
        const dia = d.getDate();
        const mes = d.getMonth() + 1;
        const ano = d.getFullYear()
        date = dia + "/" + mes + "/" + ano;
    }
    const param = date.replaceAll("/", "%2F");
    fetch("https://br.investing.com/instruments/HistoricalDataAjax", {
        "headers": {
            "accept": "text/plain, */*; q=0.01",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://br.investing.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "curr_id=" + commentContentId + "&smlID=" + smlID + "&st_date=" + param + "&end_date=" + param + "&interval_sec=Daily&sort_col=date&sort_ord=DESC&action=historical_data",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => response.text())
        .then(response => {
            // var doc = new DOMParser().parseFromString(response, "text/xml");
            var doc = document.createElement('div');
            doc.innerHTML = response;
            var value = doc.querySelector("#curr_table").querySelectorAll("td")[1].innerText.trim();
            // console.log(doc);
            console.log(value);
        });
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function getInvestingValue(tickerAux = "petr4", date = "31/12/2019", force = false) {
    if (force) {
        url = "";
        ticker = "";
        smlID = "";
        commentContentId = "";
    }

    if (ticker == tickerAux && url && smlID && commentContentId) {
        geet(date, smlID, commentContentId)
    } else {
        ticker = tickerAux;
        const request = createCORSRequest("get", "https://br.investing.com/search/?q=" + tickerAux);
        if (request) {
            request.onload = function () {
                const response = request.responseText;
                var el = document.createElement('html');
                el.innerHTML = response;
                url = el.querySelector(".searchSectionMain a").href;
                // console.log(url)
                // console.log(el)

                pegarIDs(tickerAux, url, date);
            };
            request.send();
        }
    }
}

function pegarIDs(ticker, url, date) {
    const request = createCORSRequest("get", url);
    if (request) {
        request.onload = function () {
            const response = request.responseText;

            smlID = response.split("window.siteData.smlID = ")[1].split("window.siteData.mmID")[0].replaceAll("'", "").replaceAll(";", "").replaceAll(" ", "");
            commentContentId = response.split("var commentContentId = '")[1].split('var commentImagesPath')[0].replaceAll(";", "").replaceAll("'", "").replaceAll(" ", "");
            // console.log('smlID', smlID);
            // console.log('commentContentId', commentContentId);

            geet(date, smlID, commentContentId)

        };
        request.send();
    }
}

//next calls will be faster. every first call to TICKER is slower.
getInvestingValue("IGTA3", "21/12/2020");