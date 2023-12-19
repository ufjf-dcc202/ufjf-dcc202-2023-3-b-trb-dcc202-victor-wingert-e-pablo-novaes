import { gridJogador, gridNPC, pontuacaoJogador, pontuacaoNPC } from './variaveis.js';

export function preencherGrid(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celula`)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            celula[index].textContent = vetor[i][j];
            index++;
        }
    }
} // PREENCHE A GRID COM OS VALORES relacionados aos valores dos dados na forma de Matriz com [i][j], ou seja as celulas do tabuleiro

export function preencherGridPontuacao(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celulaPontuacao`)
    for (let i = 0; i < vetor.length; i++) {
        celula[index].textContent = vetor[i];
        index++;
    }
} // PREENCHE A GRID DA PONTUAÇÃO baseado no gridPontuacao(vetor), o vetor é preenchido com valores gerados pelos soma dos dados em tempo real 

export function atualizaTelaComImagens() {
    preencherGridComImagens(gridJogador, '#jogador');
    preencherGridComImagens(gridNPC, '#npc');
} // chama as funções de preencher grid  estilizando o tabuleiro com dados  e colocando os elementos com a imagem de dados nas celulas, e atualiza tela para a proxima jogada.

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

export function attPontuacao(tipoGrid, tipoIdGrid) {
    const celulas = document.querySelectorAll(`${tipoIdGrid} .celulaPontuacao`);

    for (let i = 0; i < 3; i++){
        let soma = 0;
        for (let j = 0; j < 3; j++){
            soma += tipoGrid[j][i] * contadorColuna(i, tipoGrid[j][i], tipoGrid);// atualiza o valor e multpilca pelo "contador coluna" que retorna contadorColuna.
        }
        celulas[i].textContent = soma;
    }
}; // ATUALIZA A PONTUACAO DE GRID PONTUACAO aparecendo acima da coluna, na 'celulaPontuacao'

function contadorColuna(coluna, valor, qualGrid){
    let vezes = 0;
    for(let i = 0; i < 3; i++){
        if(qualGrid[i][coluna] == valor){
            vezes++;
        }
    }
    return vezes;
    // a contagem é feita individualmente para cada valor passado no argumento,somando assim a pontuacao final na coluna na funcao "att pontuacao".CONTA OS DADOS REPETIDOS NA COLUNA
}

export function verificaFimDoJogo() {
    const posicoesDisponiveisJ = posicoesDisponiveisJogo(gridJogador);
    const posicoesDisponiveisNPC = posicoesDisponiveisJogo(gridNPC);
    if (posicoesDisponiveisJ.length === 0 || posicoesDisponiveisNPC. length === 0) {
        dado.textContent = '';
        defineGanhador();
        return true;
    }
    return false;
} // VAI VERIFICAR O FIM DO JOGO , verificando se o vetor de posicoes disponiveis para jogar tanto para o jogador tanto para o bot nao tem mais espaço para jogar (length), ou seja tamanho zero

export function posicoesDisponiveisJogo(grid){
    let posicoesDisponiveis = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(grid[i][j].length === 0){
                posicoesDisponiveis.push([i, j]);
            }
        }
    }
    return posicoesDisponiveis;
} // Mesma logica do 'posicoesDisponiveisJogador' so que para o bot.

export function somaPontucao(tipo){
    const celula = document.querySelectorAll(`${tipo} .celulaPontuacao`);
    let soma = 0;
    for (let i = 0; i < 3; i++) {
        soma += parseInt(celula[i].textContent);
    }
    return soma;
} // SOMA A PONTUACAO DA GRID DE PONTUACAO, convertendo o texto para numero nas celulas de pontuacao do tabuleiro  para numeros inteiros

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
} // DEFINE O GANHADOR DO JOGO verificando qual a maior soma das 3 celulas de pontucao

export function posicoesDisponiveisJogador(coluna) {
    let posicoesDisponiveis = [];
    for(let i = 0; i < 3; i++){
        if(gridJogador[i][coluna].length === 0){
            posicoesDisponiveis.push(i);
        }
    }
    return posicoesDisponiveis;
} /*VE AS POSICOES DISPONIVEIS NA COLUNA QUE O JOGADOR CLICAR O BOTAO seguinda:
 Se tiver uma posicao vazia ele  preenche o vetor 'posicoesDisponiveis' com o indice da linhae e coluna  disponivel para jogo, ou seja uma celula vazia.*/

export function descartarDados(valor, coluna, tipoGrid) {
    for (let i = 0; i < 3; i++) {
        if (tipoGrid[i][coluna] === valor) {
            tipoGrid[i][coluna] = [];
        }
    }
} // SERVE PARA ELIMINAR O DADO JOGADO CASO ELE JA EXISTA NA MESMO COLUNA, assim 'zerando' o valor desse elemento na coluna selecionada 

export function desativarBotoes(status) {
    const botoes = document.querySelectorAll('.botao');
    botoes.forEach(botao => {
        botao.disabled = !status;
    });
} // desativa os botoes até que o npc jogue
