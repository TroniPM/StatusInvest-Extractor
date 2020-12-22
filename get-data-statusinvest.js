const PONTUACAO = "."; // pode utilizar , ou .
const SEPARATOR = ","; //qualquer um desejado

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

                response[keyTitle][index].data[title] = typeof PONTUACAO !== 'undefined' && PONTUACAO == "," ? content.replace(".", "") : parseFloat(content);
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
    const tab6 = getDataDre();

    // var json = {};
    // json = Object.assign(json, tab1.data);
    // json = Object.assign(json, tab2.data);
    // json = Object.assign(json, tab3.data);
    // json = Object.assign(json, tab4.data);
    // json = Object.assign(json, tab5.data);
    // json = Object.assign(json, tab6.data);
    // console.log(json);

    convertToCsv(tab1, tab2, tab3, tab4, tab5, tab6);
}

function convertToCsv(tab1, tab2, tab3, tab4, tab5, tab6) {
    const anoLabel = "ANO";
    const tickerLabel = "TICKER";
    const ticker = window.location.pathname.split("/")[2].toUpperCase();

    outputHeader = "";
    outputData = "";

    outputHeader += tickerLabel + SEPARATOR /*+ "  "*/;
    outputHeader += anoLabel + SEPARATOR /*+ "  "*/;

    const arrModel = tab1.data[Object.keys(tab1.data)[0]];
    for (let index = 0; index < arrModel.length; index++) {
        const element = arrModel[index];
        const ano = element.ano;

        outputData += ticker + SEPARATOR /*+ " "*/;
        outputData += ano + SEPARATOR /*+ " "*/;

        const keys = Object.keys(element.data);
        for (let i1 = 0; i1 < keys.length; i1++) {
            const key1 = keys[i1];
            if (index == 0) {
                outputHeader += key1 + SEPARATOR /*+ " "*/;
            }

            outputData += element.data[key1];
            outputData += SEPARATOR /*+ " "*/;
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

        const t6 = mergeYear(SEPARATOR, tab6, index, outputHeader, outputData);
        outputHeader = t6.outputHeader;
        outputData = t6.outputData;


        outputData += "\r\n";
    }

    console.log(outputHeader)
    console.log(outputData)

    var fileContent = outputHeader + "\r\n" + outputData;
    fileContent = removeEndSeparator(fileContent);
    download("data_" + ticker + ".csv", fileContent)
}

function mergeYear(SEPARATOR, tab, index, outputHeader, outputData) {
    const tabData = tab.data[Object.keys(tab.data)[0]][index];
    const keys2 = Object.keys(tabData.data);
    for (let i2 = 0; i2 < keys2.length; i2++) {
        const key2 = keys2[i2];
        if (index == 0) {
            outputHeader += key2 + SEPARATOR /*+ " "*/;
        }
        outputData += tabData.data[key2];
        outputData += SEPARATOR /*+ " "*/;
    }

    return { outputHeader, outputData };
}

function removeEndSeparator(fileContent) {
    return fileContent.replaceAll(",\r\n", "\r\n");
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

function getDataDre() {
    const response = [];
    const dreDiv = $('.DRE:eq(0)');

    const anosContainer = dreDiv.find('table').find('th.DATA');
    for (let index = 0; index < anosContainer.length; index++) {
        let ano;
        if (index == 0) {
            ano = "ATUAL";
        } else {
            ano = anosContainer[index].innerText.trim();
        }

        response.push({ ano })
    }

    const rowContainer = dreDiv.find('table').find('tr');
    for (let index = 1; index < rowContainer.length; index++) {//linha
        const title = dreDiv.find('table').find('tr:eq(' + index + ')').find('td:eq(0)').find('span:eq(1)').text() ||
            dreDiv.find('table').find('tr:eq(' + index + ')').find('td:eq(0)').find('span:eq(0)').text();
        const key = formatText(title.replace("(R$)", "").replace("(%)", "").replace("-", "").trim());

        const celulaContainer = $(rowContainer[index]).find('td.DATA');
        for (let index2 = 0; index2 < celulaContainer.length; index2++) {//coluna
            if (!response[index2].data) {
                response[index2].data = {};
            }
            const element = celulaContainer[index2];
            var content = element.innerText.toUpperCase().trim();

            content = content.replace("%", "").replace(".", "").replace(",", ".").replace(" ", "");
            content = content == "-" || !content ? "0" : content;
            content = content == "0,00" || content == "0.00" || !content ? "0" : content;
            if (content.toString().includes('M')) {
                content = parseFloat(content.replace("M", "")) * 1000000;

            }

            response[index2].data[key] = typeof PONTUACAO !== 'undefined' && PONTUACAO == "," ? content.toString().replace(".", ",") : parseFloat(content);
        }

    }

    return { data: { DRE: response }, keyTitle: "DRE" };
}

function dreScheme() {
    setTimeout(() => {
        const menuInicial = $('.DRE:eq(0)').find('.si-dropdown:eq(2)').find('input:eq(0)')[0];
        const menuInicialId = menuInicial.getAttribute('data-target');
        menuInicial.click();

        setTimeout(() => {
            const menuInicialBtn = $("#" + menuInicialId + " li:last-child");
            menuInicialBtn.click();

            setTimeout(() => {
                const menuFinal = $('.DRE:eq(0)').find('.si-dropdown:eq(2)').find('input:eq(1)')[0];
                const menuFinalId = menuFinal.getAttribute('data-target');
                menuFinal.click();

                setTimeout(() => {
                    const menuFinalBtn = $("#" + menuFinalId + " li:first");
                    menuFinalBtn.click();

                    setTimeout(() => {
                        $("#indicators-section button[data-value=1]").click();

                        setTimeout(() => {
                            document.querySelector("#indicators-section").querySelectorAll("a[role=button]")[1].click()

                            setTimeout(() => {
                                init();
                            }, 1.5 * 1000);
                        }, 1.5 * 1000);
                    }, 1000);
                }, 150);
            }, 150);
        }, 150);
    }, 150);

}

dreScheme();