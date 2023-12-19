import { atualizaTela, colocarImagem, placar } from "./interface.js";
import { gridJogador, gridNPC, randomNumber } from "./variaveis.js";
import { verificaFimDoJogo, posicoesDisponiveisJogo, posicoesDisponiveisJogador, descartarDados, desativarBotoes } from "./logica.js";

export const dado = document.querySelector('#dado');
export let dadoAtual = randomNumber();

dado.textContent = dadoAtual;

atualizaTela(); // atualiza inicialmente o jogo

colocarImagem(); // muda o valor dos números da grid por imagem de dados (quando inicia o jogo)

adcDadoJogador(0); // adiciona dados dos jogadores nas colunas 
adcDadoJogador(1);
adcDadoJogador(2);

function adcDadoJogador(botao) {
    const botoes = document.querySelectorAll('.botao'); 
    let permitirClique = true; // permite o click ate a condicao se tornar false, quando nao tem mais posicoes disponiveis para jogo

    botoes[botao].addEventListener('click', () => { // adiciona um ouvinte para quando dispara o click no botao
        if (!permitirClique) {
            return;
        }
        permitirClique = false;
        desativarBotoes(permitirClique);
        atualizaTela();
        if (verificaFimDoJogo()) {// verifica o fim de jogo
            return;
        }
        
        const colunaAtual = botao;    // assume a coluna que está o botao que a player clicou e adc na variavel
        let valorAtual = dadoAtual;   // assume o valor aleatorio  do dado que foi gerado para a variavel

        const posicoesDisponiveis = posicoesDisponiveisJogador(colunaAtual); // verifica os espacos disponiveis para jogo na funcao posicoesDisponiveisJogador

        if(posicoesDisponiveis.length === 0){// verifica se tem posicoes disponiveis contidas na variavel posicoesDisponiveis, verificando pelo tamanho do vetor ser diferente de zero
            return;
        }

        const linha = posicoesDisponiveis[0]; // 0 porque é a primeira posição disponível
        gridJogador[linha][colunaAtual] = valorAtual;

        descartarDados(valorAtual, colunaAtual, gridNPC);// descarta os dados jogados
        atualizaTela();// recebe um novo valor de dado , e atualiaza todos os elementos na tela como : pontuacao , novo numero, preenche as celulas , entre outros definidos na funcao
        placar(); // atualiza o placar dos players
        
        if (verificaFimDoJogo()) {// verifica o fim de jogo 
            return;
        }

        dadoAtual = randomNumber();  // gera um novo valor de dado e adiciona na tela o valor a ser jogado em alguma coluna 
        dado.textContent = dadoAtual; 

        colocarImagem(); // coloca imagem nesse novo valor gerado

        setTimeout(() => {
            adcDadoNpc();
            atualizaTela();         // o bot espera em torno de 1 s para fazer a jogada 
            placar();
            permitirClique = true;
            desativarBotoes(permitirClique);
        }, 1000);
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
} // ADICIONA O DADO DO NPC DE FORMA ALEATÓRIA verificando as posicoes disponiveis para o jogo do bot, sendo que no valor(length) zero nao pode mais jogar
