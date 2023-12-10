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

function atualizaTela() {
    preencherGrid(gridJogador, '#jogador');
    preencherGrid(gridNPC, '#npc');
    preencherGridPontuacao(pontuacaoJogador, '#pontuacaoJogador');
    preencherGridPontuacao(pontuacaoNPC, '#pontuacaoNPC');
    atualizaTelaComImagens();
    attPontuacao(gridJogador, '#pontuacaoJogador');
    attPontuacao(gridNPC, '#pontuacaoNPC');
} // ATUALIZA A TELA DO JOGO

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