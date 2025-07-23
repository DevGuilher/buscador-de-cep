// Seleciona os elementos do DOM
const formBuscaCEP = document.getElementById('formBuscaCEP');
const resultadoCEP = document.getElementById('resultadoCEP');
const botaoMaps = document.getElementById('botaoMaps');
const campoCEP = document.getElementById('cep');

// Formata o CEP enquanto o usuário digita
campoCEP.addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');

    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '-' + valor.substring(5, 8);
    }

    e.target.value = valor;
});

// Busca o CEP quando o formulário é enviado
formBuscaCEP.addEventListener('submit', function (e) {
    e.preventDefault();

    const cep = campoCEP.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        alert('CEP inválido! Digite um CEP com 8 dígitos.');
        return;
    }

    buscarCEP(cep);
});

// Função para buscar o CEP na API ViaCEP
function buscarCEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('CEP não encontrado');
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }
            exibirResultado(data);
            botaoMaps.disabled = false;
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            alert('CEP não encontrado. Por favor, verifique o número digitado.');
            limparResultados();
        });
}

// Exibe os resultados na tela
function exibirResultado(data) {
    document.querySelector('.logradouro').textContent = data.logradouro || 'Não informado';
    document.querySelector('.bairro').textContent = data.bairro || 'Não informado';
    document.querySelector('.uf').textContent = data.uf;
    document.querySelector('.municipio').textContent = data.localidade;
    document.querySelector('.cep').textContent = data.cep;

    // O número não vem na API ViaCEP, então mantemos como não informado
    document.querySelector('.numero').textContent = 'Não informado';

    resultadoCEP.hidden = false;

    // Configura o botão do Maps
    botaoMaps.onclick = function () {
        const endereco = `${data.logradouro}, ${data.localidade}, ${data.uf}`;
        const urlMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
        window.open(urlMaps, '_blank');
    };
}

// Limpa os resultados
function limparResultados() {
    document.querySelectorAll('.lista-cep dd').forEach(dd => {
        dd.textContent = '-';
    });
    resultadoCEP.hidden = true;
    botaoMaps.disabled = true;
};