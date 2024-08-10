document.addEventListener('DOMContentLoaded', function() {
    let fornecedores = [];
    let produtos = [];
    let anexos = [];

    document.getElementById('btnSalvarFornecedor').addEventListener('click', function(event){
        event.preventDefault();

        if (validarFornecedor() && validarProdutos(produtos) && validarAnexos(anexos)) {
            showLoading();
    
            setTimeout(function() {
                adicionarFornecedor();
                const fornecedorJSON = JSON.stringify(fornecedores[fornecedores.length - 1]);
                baixarJSON(fornecedorJSON);
                hideLoading(); 
                alert("Fornecedor salvo com sucesso!");

            }, 40);
        } else {
            alert("Preencha todos os campos do fornecedor e adicione pelo menos um produto e um anexo.");
        }
    });
    document.getElementById('cep').addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cep) {
            buscarEnderecoPorCEP(cep);
        }
    });

    function onlyNumbers(input) {
        input.value = input.value.replace(/\D/g, '');
    }

    document.getElementById('cep').addEventListener('input', function() {
        onlyNumbers(this);
    });

    document.getElementById('cnpj').addEventListener('input', function() {
        onlyNumbers(this);
    });

    document.getElementById('inscEstadual').addEventListener('input', function() {
        onlyNumbers(this);
    });
    function adicionarFornecedor(){
        const razaoSocial = form.razaoSocial().value;
        const cnpj = form.cnpj().value;
        const nomeFantasia = form.nomeFantasia().value;
        const inscEstadual = form.inscEstadual().value;
        const cep = form.cep().value;
        const endereco = form.endereco().value;
        const bairro = form.bairro().value;
        const uf = form.uf().value;
        const complemento = form.complemento().value;
        const email = form.email().value;
        const telefone = form.telefone().value;
        
        
        
        const fornecedor = { razaoSocial, cnpj, nomeFantasia, inscEstadual, endereco: {cep,endereco, 
            bairro,uf,complemento},email,telefone,
        produtos,anexos};
        fornecedores.push(fornecedor);
        document.getElementById('form-fornecedor').reset();
        produtos = [];
        anexos = [];
        carregarTabela();
        carregarTabelaAnexos(); 
    }

    function buscarEnderecoPorCEP(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('endereco').value = data.logradouro;
                    document.getElementById('complemento').value = data.complemento;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('uf').value = data.uf;
                    
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => {
                console.error("Erro ao buscar o CEP: ", error);
                alert("Erro ao buscar o CEP.");
            });
    }

    document.getElementById('btnProduto').addEventListener('click', function(event) {
        event.preventDefault();
        adicionarProduto();
    });

    function adicionarProduto() {
        const descricao = prod.descricao().value;
        const medida = prod.medida().value;
        const quantidadeEstoque = prod.quantidadeEstoque().value;
        const valorUni = prod.valorUni().value;
        const valorTotal = valorUni * quantidadeEstoque;

        if (!isValidName(descricao)) {
            alert("A descrição não pode conter números ou símbolos.");
            return;
        }
        if (!isFormValid()){
            alert("Preencha todos os campos")
            return;
        }

        const produto = { descricao, medida, quantidadeEstoque, valorUni, valorTotal };
        produtos.push(produto);
        document.getElementById('form-produto').reset();
        carregarTabela();
    }
    function isFormValid(){
        const descricao = prod.descricao().value;
        const quantidadeEstoque = prod.quantidadeEstoque().value;
        const valorUni = prod.valorUni().value;

        if (!descricao || !quantidadeEstoque || !valorUni){
            return false;
        }
        return true;

    }

    function carregarTabela() {
        const tableBody = document.querySelector('#tabelaProdutos tbody');
        tableBody.innerHTML = ''; 

        produtos.forEach((produto, index) => {
            const row = document.createElement('tr');
                
            row.innerHTML = `
                <td>${produto.descricao}</td>
                <td>${produto.medida}</td>
                <td>${produto.quantidadeEstoque}</td>
                <td>${formatCurrency(produto.valorUni)}</td>
                <td>${formatCurrency(produto.valorTotal)}</td>
                <td><i class="bi bi-trash delete-icon" data-id="${index}"></i></td>
            `;
            tableBody.appendChild(row);
        });
        
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const index = this.getAttribute('data-id');
                const confirmacao = confirm("Tem certeza que deseja excluir este produto?");
                if (confirmacao) {
                    produtos.splice(index, 1);
                    carregarTabela(); 
                }
            });
        });
    }
    document.getElementById('btnAnexo').addEventListener('click', function(event) {
        event.preventDefault();
        armazenarAnexo();
    });
    function armazenarAnexo() {
        const arquivoInput = document.getElementById('upload-documento');
        const arquivo = arquivoInput.files[0];

        if (arquivo) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const blob = new Blob([e.target.result], { type: arquivo.type });
                const anexo = {
                    nome: arquivo.name,
                    tipo: arquivo.type,
                    tamanho: arquivo.size,
                    url: URL.createObjectURL(blob)
                };

                const anexoKey = `anexo_${anexos.length}`;
                sessionStorage.setItem(anexoKey, e.target.result);

                anexos.push(anexo);
                arquivoInput.value = '';
                carregarTabelaAnexos();
            };
            reader.readAsArrayBuffer(arquivo);
        } else {
            alert("Selecione um arquivo para anexar.");
        }
    }
    
    function carregarTabelaAnexos() {
        const tableBody = document.querySelector('#tabelaAnexos tbody');
        tableBody.innerHTML = ''; 

        anexos.forEach((anexo, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${anexo.nome}</td>
                <td>
                <button class="btn btn-danger btn-remover-anexo" data-id="${index}">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-info btn-visualizar-anexo" data-id="${index}">
                    <i class="bi bi-download"></i>
                </button>
            </td>
            `;
            tableBody.appendChild(row);
        });
        
        document.querySelectorAll('.btn-remover-anexo').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-id');
                const confirmarExclusao = window.confirm('Tem certeza que deseja excluir este anexo?');
                if (confirmarExclusao) {
                    anexos.splice(index, 1);
                    carregarTabelaAnexos();     
                }
            });
        });
        document.querySelectorAll('.btn-visualizar-anexo').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-id');
                visualizarAnexo(index);
            });
        });
    }
    function visualizarAnexo(index) {
        const anexo = anexos[index];
        const fileURL = anexo.url;
    
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = anexo.nome;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function baixarJSON(conteudoJSON) {
        const blob = new Blob([conteudoJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fornecedor.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const form = {
        razaoSocial: () => document.getElementById('razaoSocial'),
        cnpj: () => document.getElementById('cnpj'),
        nomeFantasia: () => document.getElementById('nomeFantasia'),
        inscEstadual: () => document.getElementById('inscEstadual'),
        cep: () => document.getElementById('cep'),
        endereco: () => document.getElementById('endereco'),
        bairro: () => document.getElementById('bairro'),
        uf: () => document.getElementById('uf'),
        complemento: () => document.getElementById('complemento'),
        email: () =>document.getElementById('email'),
        telefone: () =>document.getElementById('telefone')
    }
    const prod = {
        descricao: () => document.getElementById('descricao'),
        medida: () => document.getElementById('medida'),
        quantidadeEstoque: () => document.getElementById('quantidadeEstoque'),
        valorUni: () => document.getElementById('valorUni')
    }
});
