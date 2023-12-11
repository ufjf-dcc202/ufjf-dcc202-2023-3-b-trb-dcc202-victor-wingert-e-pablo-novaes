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
} // PREENCHE A GRID COM OS VALORES relacionados aos valores dos dados na forma de Matriz com [i][j], ou seja as celulas do tabuleiro

function preencherGridPontuacao(vetor, gridSelector) {
    let index = 0;
    const celula = document.querySelectorAll(`${gridSelector} .celulaPontuacao`)
    for (let i = 0; i < vetor.length; i++) {
        celula[index].textContent = vetor[i];
        index++;
    }
} // PREENCHE A GRID DA PONTUAÇÃO baseado no gridPontuacao(vetor), o vetor é preenchido com valores gerados pelos soma dos dados em tempo real

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
} // CHAMA AS FUNÇÕES DE PREENCHER GRID  estilizando o tabuleiro com dados  e colocando os elementos com a imagem de dados nas celulas, e atualiza tela para a proxima jogada.

function attPontuacao(tipoGrid, tipoIdGrid) {
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

function atualizaTela() {
    preencherGrid(gridJogador, '#jogador');
    preencherGrid(gridNPC, '#npc');
    preencherGridPontuacao(pontuacaoJogador, '#pontuacaoJogador');
    preencherGridPontuacao(pontuacaoNPC, '#pontuacaoNPC');
    atualizaTelaComImagens();
    attPontuacao(gridJogador, '#pontuacaoJogador');
    attPontuacao(gridNPC, '#pontuacaoNPC');
} // ATUALIZA A TELA DO JOGO chamando  algumas funcoes atualizando o estado do jogo apos as jogadas dos player/bot

function adcDadoJogador(botao) {
    const botoes = document.querySelectorAll('.botao'); 
    let permitirClique = true; // permite o click ate a condicao se tornar false, quando nao tem mais posicoes disponiveis para jogo

    botoes[botao].addEventListener('click', () => { // adiciona um ouvinte para quando dispara o click no botao
        if (!permitirClique) {
            return;
        }
        permitirClique = false;
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

function verificaFimDoJogo() {
    const posicoesDisponiveisJ = posicoesDisponiveisJogo(gridJogador);
    const posicoesDisponiveisNPC = posicoesDisponiveisJogo(gridNPC);
    if (posicoesDisponiveisJ.length === 0 || posicoesDisponiveisNPC. length === 0) {
        dado.textContent = '';
        defineGanhador();
        return true;
    }
    return false;
} // VAI VERIFICAR O FIM DO JOGO , verificando se o vetor de posicoes disponiveis para jogar tanto para o jogador tanto para o bot nao tem mais espaço para jogar (length), ou seja tamanho zero

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
} // Mesma logica do 'posicoesDisponiveisJogador' so que para o bot.


function posicoesDisponiveisJogador(coluna) {
    let posicoesDisponiveis = [];
    for(let i = 0; i < 3; i++){
        if(gridJogador[i][coluna].length === 0){
            posicoesDisponiveis.push(i);
        }
    }
    return posicoesDisponiveis;
} /*VE AS POSICOES DISPONIVEIS NA COLUNA QUE O JOGADOR CLICAR O BOTAO seguinda:
 Se tiver uma posicao vazia ele  preenche o vetor 'posicoesDisponiveis' com o indice da linhae e coluna  disponivel para jogo, ou seja uma celula vazia.*/

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

function placar() {
    const pontuacaoJogador = somaPontucao('#pontuacaoJogador');
    const pontuacaoNPC = somaPontucao('#pontuacaoNPC');
    const placarJogador = document.querySelector('#placarJogador');
    const placarNPC = document.querySelector('#placarNPC');
    placarJogador.textContent = `JOGADOR: ${pontuacaoJogador}`;
    placarNPC.textContent = `NPC: ${pontuacaoNPC}`;
} // ATUALIZA O PLACAR EM TEMPO REAL do lado do tabuleiro, verificando a soma nas celulas de pontuacao a cada jogada

function descartarDados(valor, coluna, tipoGrid) {
    for (let i = 0; i < 3; i++) {
        if (tipoGrid[i][coluna] === valor) {
            tipoGrid[i][coluna] = [];
        }
    }
} // SERVE PARA ELIMINAR O DADO JOGADO CASO ELE JA EXISTA NA MESMO COLUNA, assim 'zerando' o valor desse elemento na coluna selecionada 

function colocarImagem(){
    dado.innerHTML = '';
    const imgLocal = document.createElement('img');
    imgLocal.src = `./assets/dado${dadoAtual}.svg`;
    dado.appendChild(imgLocal);
} // COLOCA IMAGEM NO LUGAR DO NÚMERO DO DADO , estilizando o tabuleiro 

function somaPontucao(tipo){
    const celula = document.querySelectorAll(`${tipo} .celulaPontuacao`);
    let soma = 0;
    for (let i = 0; i < 3; i++) {
        soma += parseInt(celula[i].textContent);
    }
    return soma;
} // SOMA A PONTUACAO DA GRID DE PONTUACAO, convertendo o texto para numero nas celulas de pontuacao do tabuleiro  para numeros inteiros 

function randomNumber() {
    return Math.floor(Math.random() * 6) + 1;
} // GERA UM NÚMERO ALEATÓRIO de um a 1 a  6