const Browser = require("zombie");
const browser = new Browser();

const getIndicadoresValuation = () => {
    console.log('getIndicadoresValuation');
    const divIndicadoresValuation = browser.querySelectorAll(".indicator-historical-container div[data-group]")[0];
    console.log(divIndicadoresValuation);
};

const getIndicadoresEndividamento = () => {
    console.log('getIndicadoresEndividamento');
    const divIndicadoresEndividamento = browser.querySelectorAll(".indicator-historical-container div[data-group]")[1];
};

const getIndicadoresEficiencia = () => {
    console.log('getIndicadoresEficiencia');
    const divIndicadoresEficiencia = browser.querySelectorAll(".indicator-historical-container div[data-group]")[2];
};

const getIndicadoresRentabilidade = () => {
    console.log('getIndicadoresRentabilidade');
    const divIndicadoresRentabilidade = browser.querySelectorAll(".indicator-historical-container div[data-group]")[3];
};

const getIndicadoresCrescimento = () => {
    console.log('getIndicadoresCrescimento');
    const divIndicadoresCrescimento = browser.querySelectorAll(".indicator-historical-container div[data-group]")[4];
};

const clickBotaoHistoricoMaximoPeriodo = () => {
    console.log('clickBotaoHistoricoMaximoPeriodo');
    const delay = "2s";
    const historicoMaxBtn = browser.querySelectorAll(".indicator-historical-container a[role=button]")[1];
    if (historicoMaxBtn) {
        historicoMaxBtn.click() && browser.wait(delay).then(() => {
            getIndicadoresValuation(browser);
            getIndicadoresEndividamento(browser);
            getIndicadoresEficiencia(browser);
            getIndicadoresRentabilidade(browser);
            getIndicadoresCrescimento(browser);
        });
    }
};

const clickBotaoHistorico = () => {
    console.log('clickBotaoHistorico');
    const delay = "2s";
    const historicoBtn = browser.button("#indicators-section [data-value=1]");
    if (historicoBtn) {
        historicoBtn.click() && browser.wait(delay).then(() => {
            clickBotaoHistoricoMaximoPeriodo(browser);
        });
    } else {
        console.error('Botao clickBotaoHistorico não encontrado');
    }
};

const openStatusInvest = ticker => {
    console.log('openStatusInvest');
    if (!ticker) {
        return Promise.reject({ msg: "ticker inválido" });
    }

    const url = "https://statusinvest.com.br/acoes/" + ticker.toLocaleLowerCase();
    // const url = "http://jpcontabil.com/";

    return browser.visit(url)
        .then(() => {
            console.log("SUCCESS OPEN STOCK DATA", browser.location.href);
            clickBotaoHistorico(browser);
        })
        .catch(err => {
            console.log("ERROR WHILE OPEN STOCK DATA", err);
        });

};

const acao = "cogn3";
openStatusInvest(acao).catch(() => {
    browser.window.addEventListener('load', function () {
        (adsbygoogle = window.adsbygoogle || []).push({});
    });
    openStatusInvest(acao).finally(() => {
        console.log("ACABOU!");
        process.exit(1);
    });
});