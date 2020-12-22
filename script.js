var pontuacao = ","; // pode utilizar , ou .

$("#indicators-section button[data-value=1]").click();

setTimeout(() => {
    document.querySelector("#indicators-section").querySelectorAll("a[role=button]")[1].click()

    setTimeout(() => {
        init();
    }, 1 * 2000);
}, 1 * 2000);

function formatText(text, spaceReplacement = "") {
    return text.toUpperCase().replaceAll(".", "").replaceAll("/", "_").replaceAll(" ", spaceReplacement)
        .replaceAll("Á", "A").replaceAll("Ã", "A").replaceAll("À", "A").replaceAll("Â", "A")
        .replaceAll("É", "E").replaceAll("È", "E").replaceAll("Ê", "E")
        .replaceAll("Í", "I").replaceAll("Ì", "I").replaceAll("Î", "I")
        .replaceAll("Ó", "O").replaceAll("Õ", "O").replaceAll("Ò", "O").replaceAll("Ô", "O")
        .replaceAll("Ú", "U").replaceAll("Ù", "U").replaceAll("Û", "U")
        .replaceAll("Ç", "C").replaceAll("º", "").replaceAll("ª", "");
}

function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}

function getIndicatorsData(div) {
    const rowContainerOutter = div.querySelectorAll(".tr.w-100.d-flex.justify-start");
    const indicadorContainerOutter = div.querySelectorAll(".indicador")

    const qtdLinhas = rowContainerOutter.length || indicadorContainerOutter.length;

    const response = [];
    let keyTitle;
    for (let linhaIndex = 0; linhaIndex < qtdLinhas; linhaIndex++) {
        const indicadorContainer = indicadorContainerOutter[linhaIndex] || null;
        const rowContainer = rowContainerOutter[linhaIndex] || null;

        if (linhaIndex == 0) {
            const title = indicadorContainer.querySelector(".indicador-name").innerText.trim();
            keyTitle = formatText(title, "_");
            const celulas = rowContainer.querySelectorAll(".th.w-100");

            response[keyTitle] = [];

            for (let i = 0; i < celulas.length; i++) {
                const element = celulas[i].innerText.trim();

                response[keyTitle].push({ ano: element, data: {} });
            }
        } else {
            const title = formatText(indicadorContainer.querySelector(".title").innerText.trim());

            const arr = rowContainer.querySelectorAll(".td.w-100");
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                let content = element.innerText.toUpperCase().trim().replace("%", "").replace(",", ".");
                content = content == "-" || !content ? "0" : content;

                response[keyTitle][index].data[title] = pontuacao == "," ? content.replace(".", ",") : parseFloat(content);
            }
        }
    }

    return { data: response, keyTitle };
}

function init() {
    const tab1 = getIndicatorsData(document.querySelectorAll(".indicator-historical-container div[data-group]")[0]);
    const tab2 = getIndicatorsData(document.querySelectorAll(".indicator-historical-container div[data-group]")[1]);
    const tab3 = getIndicatorsData(document.querySelectorAll(".indicator-historical-container div[data-group]")[2]);
    const tab4 = getIndicatorsData(document.querySelectorAll(".indicator-historical-container div[data-group]")[3]);
    const tab5 = getIndicatorsData(document.querySelectorAll(".indicator-historical-container div[data-group]")[4]);

    var json = {};
    json = Object.assign(json, tab1.data);
    json = Object.assign(json, tab2.data);
    json = Object.assign(json, tab3.data);
    json = Object.assign(json, tab4.data);
    json = Object.assign(json, tab5.data);

    console.log(json);

    convertToCsv(tab1, tab2, tab3, tab4, tab5);
}

function convertToCsv(tab1, tab2, tab3, tab4, tab5) {
    const anoLabel = "ANO";
    const SEPARATOR = ";";

    outputHeader = "";
    outputData = "";

    outputHeader += anoLabel + SEPARATOR + "  ";

    const arrModel = tab1.data[Object.keys(tab1.data)[0]];
    for (let index = 0; index < arrModel.length; index++) {
        const element = arrModel[index];
        const ano = element.ano;

        outputData += ano + SEPARATOR + " ";

        const keys = Object.keys(element.data);
        for (let i1 = 0; i1 < keys.length; i1++) {
            const key1 = keys[i1];
            if (index == 0) {
                outputHeader += key1 + SEPARATOR + " ";
            }

            outputData += element.data[key1];
            outputData += SEPARATOR + " ";
        }

        const t2 = mergeYear(SEPARATOR, tab2, index, outputHeader, outputData);
        outputHeader = t2.outputHeader;
        outputData = t2.outputData;

        const t3 = mergeYear(SEPARATOR, tab3, index, outputHeader, outputData);
        outputHeader = t3.outputHeader;
        outputData = t3.outputData;

        const t4 = mergeYear(SEPARATOR, tab4, index, outputHeader, outputData);
        outputHeader = t4.outputHeader;
        outputData = t4.outputData;

        const t5 = mergeYear(SEPARATOR, tab5, index, outputHeader, outputData);
        outputHeader = t5.outputHeader;
        outputData = t5.outputData;


        outputData += "\r\n";
    }

    console.log(outputHeader)
    console.log(outputData)

    const fileContent = outputHeader + "\r\n" + outputData;
    const ticker = window.location.pathname.split("/")[2];
    download("data_" + ticker + ".csv", fileContent)
}

function mergeYear(SEPARATOR, tab, index, outputHeader, outputData) {
    const tabData = tab.data[Object.keys(tab.data)[0]][index];
    const keys2 = Object.keys(tabData.data);
    for (let i2 = 0; i2 < keys2.length; i2++) {
        const key2 = keys2[i2];
        if (index == 0) {
            outputHeader += key2 + SEPARATOR + " ";
        }
        outputData += tabData.data[key2];
        outputData += SEPARATOR + " ";
    }

    return { outputHeader, outputData };
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}