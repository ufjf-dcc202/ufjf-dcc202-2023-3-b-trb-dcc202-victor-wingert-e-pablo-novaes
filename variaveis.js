export let gridJogador = [ // adiciona a tabela do jogador
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

export let gridNPC = [ // adiciona tabela do NPC
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

export let pontuacaoJogador = [0, 0, 0]; // pontuacao inicial do jogador 
export let pontuacaoNPC = [0, 0, 0]; // pontuacao inicial do NPC

export function randomNumber() {
    return Math.floor(Math.random() * 6) + 1;
}
