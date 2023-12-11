let gridJogador = [    //adiciona a tabela do jogador 1, que é seu player        
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

let gridNPC = [           //adiciona tabela do NPC  que vai ser o bot
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

let pontuacaoJogador = [0, 0, 0]; // estado inicial do jogador 

let pontuacaoNPC = [0, 0, 0]; // estado inicial do bot

atualizaTela(); // atualiza inicialmete o jogo

const dado = document.querySelector('#dado');

let dadoAtual = randomNumber(); // gera o primeiro numero aleatorio

dado.textContent = dadoAtual;

colocarImagem(); 

adcDadoJogador(0);    //adiciona dados dos jogadores nas colunas 
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
} // PREENCHE A GRID COM OS VALORES relacionados aos valores dos dados na forma de Matriz com [i][j];

function preencherGridPontuacao(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celulaPontuacao`)
    for (let i = 0; i < vetor.length; i++) {
        celula[index].textContent = vetor[i];
        index++;
    }
} // PREENCHE A GRID DA PONTUAÇÃO baseado no gridPontuacao(vetor), os vetores sao preenchidos com valores gerados pelos dados

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
} //PREENCHE A GRID COM IMAGENS de 1 a 6, as 'peças' do tabuleiro ficam estilizadas

function atualizaTelaComImagens() {
    preencherGridComImagens(gridJogador, '#jogador');
    preencherGridComImagens(gridNPC, '#npc');
} // CHAMA AS FUNÇÕES DE PREENCHER GRID: estilizando o tabuleiro com dados  e colocando os elementos nas celulas, e atualiza tela para a proxima jogada.

function attPontuacao(tipoGrid, tipoIdGrid) {
    const celulas = document.querySelectorAll(`${tipoIdGrid} .celulaPontuacao`);

    for (let i = 0; i < 3; i++){
        let soma = 0;
        for (let j = 0; j < 3; j++){
            soma += tipoGrid[j][i] * contadorColuna(i, tipoGrid[j][i], tipoGrid);// atualiza o valor e multpilca pelo "contador coluna" que retorna 'vezes'.
        }
        celulas[i].textContent = soma;
    }
}; // ATUALIZA A PONTUACAO DE GRID PONTUACAO aparecendo acima da coluna, na celula 'pontuacao'

function contadorColuna(coluna, valor, qualGrid){
    let vezes = 0;
    for(let i = 0; i < 3; i++){
        if(qualGrid[i][coluna] == valor){
            vezes++;
        }
    }
    return vezes;
    // a contagem é feita individualmente para cada valor passado no argumento ,somando assim a pontuacao final na funcao  "att pontuacao"
} // CONTA OS DADOS REPETIDOS NA COLUNAA

function atualizaTela() {
    preencherGrid(gridJogador, '#jogador');
    preencherGrid(gridNPC, '#npc');
    preencherGridPontuacao(pontuacaoJogador, '#pontuacaoJogador');
    preencherGridPontuacao(pontuacaoNPC, '#pontuacaoNPC');
    atualizaTelaComImagens();
    attPontuacao(gridJogador, '#pontuacaoJogador');
    attPontuacao(gridNPC, '#pontuacaoNPC');
} // ATUALIZA A TELA DO JOGO chamando  algumas funcoes atualizando o estado do jogo apos as jogadas dos players

function adcDadoJogador(botao) {
    const botoes = document.querySelectorAll('.botao');
    let permitirClique = true;

    botoes[botao].addEventListener('click', () => {
        if (!permitirClique) {
            return;
        }
        permitirClique = false;
        atualizaTela();
        if (verificaFimDoJogo()) {
            return;
        }
        
        const colunaAtual = botao;
        let valorAtual = dadoAtual;

        const posicoesDisponiveis = posicoesDisponiveisJogador(colunaAtual);

        if(posicoesDisponiveis.length === 0){
            return;
        }

        const linha = posicoesDisponiveis[0]; // 0 porque é a primeira posição disponível
        gridJogador[linha][colunaAtual] = valorAtual;

        descartarDados(valorAtual, colunaAtual, gridNPC);
        atualizaTela();
        placar();
        
        if (verificaFimDoJogo()) {
            return;
        }

        dadoAtual = randomNumber();
        dado.textContent = dadoAtual;

        colocarImagem();

        setTimeout(() => {
            adcDadoNpc();
            atualizaTela();
            placar();
            permitirClique = true;
        }, 750);
    });
} // O JOGO VAI RODAR DENTRO DESSA FUNCAO, QUE PREENCHE A GRID COM O VALOR DO DADO GERADO

function adcDadoNpc() {
    const posicoesDisponiveis = posicoesDisponiveisJogo(gridNPC);

    if (posicoesDisponiveis.length === 0) {
        return;
    }

    const numPosicaoAleatoria = Math.floor(Math.random() * posicoesDisponiveis.length);
    const posicaoAleatoria = posicoesDisponiveis[numPosicaoAleatoria];
    const linha = posicaoAleatoria[0];
    const coluna = posicaoAleatoria[1];

    const novoNumero = randomNumber();

    gridNPC[linha][coluna] = novoNumero;

    descartarDados(novoNumero, coluna, gridJogador);
} // ADICIONA O DADO DO NPC DE FORMA ALEATÓRIA

function verificaFimDoJogo() {
    const posicoesDisponiveisJ = posicoesDisponiveisJogo(gridJogador);
    const posicoesDisponiveisNPC = posicoesDisponiveisJogo(gridNPC);
    if (posicoesDisponiveisJ.length === 0 || posicoesDisponiveisNPC. length === 0) {
        dado.textContent = '';
        defineGanhador();
        return true;
    }
    return false;
} // VAI VERIFICAR O FIM DO JOGO

function posicoesDisponiveisJogo(grid){
    let posicoesDisponiveis = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(grid[i][j].length === 0){
                posicoesDisponiveis.push([i, j]);
            }
        }
    }
    return posicoesDisponiveis;
} // VE AS POSICOES DISPONIVEIS PARA O NPC JOGAR


function posicoesDisponiveisJogador(coluna) {
    let posicoesDisponiveis = [];
    for(let i = 0; i < 3; i++){
        if(gridJogador[i][coluna].length === 0){
            posicoesDisponiveis.push(i);
        }
    }
    return posicoesDisponiveis;
} // VE AS POSICOES DISPONIVEIS NA COLUNA QUE O JOGADOR CLICAR O BOTAO

function defineGanhador(){
    const pontuacaoJogador = somaPontucao('#pontuacaoJogador');
    const pontuacaoNPC = somaPontucao('#pontuacaoNPC');
    const ganhador = document.querySelector('#ganhador');
    const placarJogador = document.querySelector('#placarJogador');
    const placarNPC = document.querySelector('#placarNPC');

    placarJogador.textContent = `JOGADOR: ${pontuacaoJogador}`;
    placarNPC.textContent = `NPC: ${pontuacaoNPC}`;
    
    if(pontuacaoJogador > pontuacaoNPC){
        ganhador.textContent = 'Ganhador: Jogador';
    } else {
        ganhador.textContent = 'Ganhador: NPC';
    }
} // DEFINE O GANHADOR DO JOGO

function placar() {
    const pontuacaoJogador = somaPontucao('#pontuacaoJogador');
    const pontuacaoNPC = somaPontucao('#pontuacaoNPC');
    const placarJogador = document.querySelector('#placarJogador');
    const placarNPC = document.querySelector('#placarNPC');
    placarJogador.textContent = `JOGADOR: ${pontuacaoJogador}`;
    placarNPC.textContent = `NPC: ${pontuacaoNPC}`;
} // ATUALIZA O PLACAR EM TEMPO REAL

function descartarDados(valor, coluna, tipoGrid) {
    for (let i = 0; i < 3; i++) {
        if (tipoGrid[i][coluna] === valor) {
            tipoGrid[i][coluna] = [];
        }
    }
} // SERVE PARA ELIMINAR O DADO JOGADO CASO ELE JA EXISTA NA MESMO COLUNA

function colocarImagem(){
    dado.innerHTML = '';
    const imgLocal = document.createElement('img');
    imgLocal.src = `./assets/dado${dadoAtual}.svg`;
    dado.appendChild(imgLocal);
} // COLOCA IMAGEM NO LUGAR DO NÚMERO DO DADO

function somaPontucao(tipo){
    const celula = document.querySelectorAll(`${tipo} .celulaPontuacao`);
    let soma = 0;
    for (let i = 0; i < 3; i++) {
        soma += parseInt(celula[i].textContent);
    }
    return soma;
} // SOMA A PONTUACAO DA GRID DE PONTUACAO

function randomNumber() {
    return Math.floor(Math.random() * 6) + 1;
} // GERA UM NÚMERO ALEATÓRIO