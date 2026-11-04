const nomePokemon = document.querySelector('.nome-pokemon');
const numeroPokemon = document.querySelector('.numero-pokemon');
const imagemPokemon = document.querySelector('.imagem-pokemon');

const card = document.querySelector('.card');
const tiposPokemon = document.querySelector('.tipos');
const infoPokemon = document.querySelector('.info');
const alturaPokemon = document.querySelector('.altura');
const pesoPokemon = document.querySelector('.peso');
const hpPokemon = document.querySelector('.hp');
const ataquePokemon = document.querySelector('.ataque');
const defesaPokemon = document.querySelector('.defesa');
const atqEspPokemon = document.querySelector('.atq-esp');
const defEspPokemon = document.querySelector('.def-esp');
const velocidadePokemon = document.querySelector('.velocidade');

const form = document.querySelector('.form');
const entradaBusca = document.querySelector('.pesquisa');
const botaoAnterior = document.querySelector('.botao-anterior');
const botaoProximo = document.querySelector('.botao-proximo');

const traducaoTipos = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  electric: 'Elétrico',
  grass: 'Planta',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Veneno',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
  fairy: 'Fada',
};

let pesquisarPokemon = 1;
let ultimaBusca = 0;

const buscarPokemon = async (pokemon) => {
  try {
    const respostaEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);

    if (respostaEspecie.status !== 200) {
      return;
    }

    const dadosEspecie = await respostaEspecie.json();

    const formaPadrao = dadosEspecie.varieties.find((forma) => forma.is_default);
    const respostaApi = await fetch(`https://pokeapi.co/api/v2/pokemon/${formaPadrao.pokemon.name}`);

    if (respostaApi.status === 200) {
      const dados = await respostaApi.json();

      const nomePtBr = dadosEspecie.names.find((nome) => nome.language.name === 'pt');

      dados.nomePt = nomePtBr ? nomePtBr.name : dadosEspecie.name;
      dados.especieId = dadosEspecie.id;

      return dados;
    }
  } catch (erro) {
    console.error('Erro ao buscar na API:', erro);
  }
};

const pegarEstatistica = (dados, nome) =>
  dados.stats.find((item) => item.stat.name === nome).base_stat;

const preencherBarras = (dados) => {
  document.querySelectorAll('.barra-cheia').forEach((barra) => {
    const valor = pegarEstatistica(dados, barra.dataset.barra);
    barra.style.width = `${Math.min((valor / 255) * 100, 100)}%`;
  });
};

const limparCard = () => {
  card.removeAttribute('data-tipo');
  tiposPokemon.innerHTML = '';
  infoPokemon.hidden = true;
};

const renderizarPokemon = async (pokemon) => {
  const minhaBusca = ++ultimaBusca;

  nomePokemon.innerHTML = 'Carregando...';
  numeroPokemon.innerHTML = '';

  const dados = await buscarPokemon(pokemon);

  if (minhaBusca !== ultimaBusca) return;

  if (dados) {
    imagemPokemon.style.display = 'block';
    nomePokemon.innerHTML = dados.nomePt;
    numeroPokemon.innerHTML = `#${dados.especieId}`;
    imagemPokemon.src =
      dados.sprites.versions['generation-v']['black-white'].animated.front_default ||
      dados.sprites.front_default ||
      dados.sprites.other['official-artwork'].front_default;

    card.dataset.tipo = dados.types[0].type.name;

    tiposPokemon.innerHTML = dados.types
      .map((item) => {
        const tipo = item.type.name;
        return `<span class="tipo" data-tipo="${tipo}">${traducaoTipos[tipo] || tipo}</span>`;
      })
      .join('');

    alturaPokemon.textContent = `${(dados.height / 10).toLocaleString('pt-BR')} m`;
    pesoPokemon.textContent = `${(dados.weight / 10).toLocaleString('pt-BR')} kg`;
    hpPokemon.textContent = pegarEstatistica(dados, 'hp');
    ataquePokemon.textContent = pegarEstatistica(dados, 'attack');
    defesaPokemon.textContent = pegarEstatistica(dados, 'defense');
    atqEspPokemon.textContent = pegarEstatistica(dados, 'special-attack');
    defEspPokemon.textContent = pegarEstatistica(dados, 'special-defense');
    velocidadePokemon.textContent = pegarEstatistica(dados, 'speed');
    preencherBarras(dados);
    infoPokemon.hidden = false;

    entradaBusca.value = '';
    pesquisarPokemon = dados.especieId;
  } else {
    imagemPokemon.style.display = 'none';
    nomePokemon.innerHTML = 'Não encontrado :c';
    numeroPokemon.innerHTML = '';
    limparCard();
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderizarPokemon(entradaBusca.value.trim().toLowerCase());
});

botaoAnterior.addEventListener('click', () => {
  if (pesquisarPokemon > 1) {
    renderizarPokemon(pesquisarPokemon - 1);
  }
});

botaoProximo.addEventListener('click', () => {
  renderizarPokemon(pesquisarPokemon + 1);
});

renderizarPokemon(pesquisarPokemon);