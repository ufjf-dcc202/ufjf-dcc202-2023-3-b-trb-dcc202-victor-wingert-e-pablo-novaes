let gridJogador = [
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

let gridNPC = [
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

let pontuacaoJogador = [0, 0, 0];

let pontuacaoNPC = [0, 0, 0];

atualizaTela();

const dado = document.querySelector('#dado');

let dadoAtual = randomNumber();

dado.textContent = dadoAtual;

colocarImagem();

adcDadoJogador(0);
adcDadoJogador(1);
adcDadoJogador(2);

//FUNCOES DAQUI PARA BAIXO

function preencherGrid(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celula`)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            celula[index].textContent = vetor[i][j];
            index++;
        }
    }
} // PREENCHE A GRID COM OS VALORES

function preencherGridPontuacao(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celulaPontuacao`)
    for (let i = 0; i < vetor.length; i++) {
        celula[index].textContent = vetor[i];
        index++;
    }
} // PREENCHE A GRID DA PONTUAÇÃO

function preencherGridComImagens(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celula`)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            celula[index].innerHTML = '';
            if (vetor[i][j] >= 1 && vetor[i][j] <= 6) {
                const imgLocal = document.createElement('img');
                imgLocal.src = `./assets/dado${vetor[i][j]}.svg`;
                celula[index].appendChild(imgLocal);
            } 
            index++;
        }
    }
} //PREENCHE A GRID COM IMAGENS

function atualizaTelaComImagens() {
    preencherGridComImagens(gridJogador, '#jogador');
    preencherGridComImagens(gridNPC, '#npc');
} // CHAMA AS FUNÇÇÕES DE PREENCHER GRID

function attPontuacao(tipoGrid, tipoIdGrid) {
    const celulas = document.querySelectorAll(`${tipoIdGrid} .celulaPontuacao`);

    for (let i = 0; i < 3; i++){
        let soma = 0;
        for (let j = 0; j < 3; j++){
            soma += tipoGrid[j][i] * contadorColuna(i, tipoGrid[j][i], tipoGrid);
        }
        celulas[i].textContent = soma;
    }
}; // ATUALIZA A PONTUACAO DE GRID PONTUACAO

function contadorColuna(coluna, valor, qualGrid){
    let vezes = 0;
    for(let i = 0; i < 3; i++){
        if(qualGrid[i][coluna] == valor){
            vezes++;
        }
    }
    return vezes;
    // a contagem é feita individualmente para cada valor passado no argumento
} // CONTA OS DADOS REPETIDOS NA COLUNAA

