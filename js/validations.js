function validarFornecedor() {
    const camposObrigatorios = document.querySelectorAll('.inpFornecedor[required]');
    let todosPreenchidos = true;
    
    camposObrigatorios.forEach(campo => {
        if (campo.value.trim() === '') {
            todosPreenchidos = false;
            console.log(`Campo ${campo.id} não preenchido`);
        }
    });

    return todosPreenchidos;
}

function validarProdutos(produtos) {
    const isValid = produtos.length > 0;
    if (!isValid) {
        console.log('Nenhum produto foi adicionado.');
    }
    return isValid;
}

function validarAnexos(anexos) {
    const isValid = anexos.length > 0;
    if (!isValid) {
        console.log('Nenhum anexo foi adicionado.');
    }
    return isValid;
}
function isValidName(descricao) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(descricao);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}
