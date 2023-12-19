import { gridJogador, gridNPC, pontuacaoJogador, pontuacaoNPC } from './variaveis.js';
import { preencherGrid, preencherGridPontuacao, atualizaTelaComImagens, attPontuacao, somaPontucao} from './logica.js';
import { dado, dadoAtual } from "./scripts.js";

export function atualizaTela() {
    preencherGrid(gridJogador, '#jogador');
    preencherGrid(gridNPC, '#npc');
    preencherGridPontuacao(pontuacaoJogador, '#pontuacaoJogador');
    preencherGridPontuacao(pontuacaoNPC, '#pontuacaoNPC');
    atualizaTelaComImagens();
    attPontuacao(gridJogador, '#pontuacaoJogador');
    attPontuacao(gridNPC, '#pontuacaoNPC');
} // atualiza a tela do jogo, chamando  algumas funcoes, apos as jogadas do jogador/npc

export function colocarImagem(){
    dado.innerHTML = '';
    const imgLocal = document.createElement('img');
    imgLocal.src = `./assets/dado${dadoAtual}.svg`;
    dado.appendChild(imgLocal);
} // COLOCA IMAGEM NO LUGAR DO NÚMERO DO DADO , estilizando o tabuleiro 

export function placar() {
    const pontuacaoJogador = somaPontucao('#pontuacaoJogador');
    const pontuacaoNPC = somaPontucao('#pontuacaoNPC');
    const placarJogador = document.querySelector('#placarJogador');
    const placarNPC = document.querySelector('#placarNPC');
    placarJogador.textContent = `JOGADOR: ${pontuacaoJogador}`;
    placarNPC.textContent = `NPC: ${pontuacaoNPC}`;
} // ATUALIZA O PLACAR EM TEMPO REAL do lado do tabuleiro, verificando a soma nas celulas de pontuacao a cada jogada
