// ==========================================
// DADOS
// ==========================================

let pessoas = JSON.parse(localStorage.getItem("pessoas")) || [];
let livros = JSON.parse(localStorage.getItem("livros")) || [];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const formPessoa = document.getElementById("formPessoa");
const formLivro = document.getElementById("formLivro");

const listaPessoas = document.getElementById("listaPessoas");
const listaLivros = document.getElementById("listaLivros");

const pessoaLivro = document.getElementById("pessoaLivro");


// ==========================================
// SALVAR NO LOCALSTORAGE
// ==========================================

function salvarDados() {
    localStorage.setItem("pessoas", JSON.stringify(pessoas));
    localStorage.setItem("livros", JSON.stringify(livros));
}


// ==========================================
// GERAR ID
// ==========================================

function gerarId() {
    return Date.now();
}


// ==========================================
// CRUD DE PESSOAS
// ==========================================

// CREATE / UPDATE
formPessoa.addEventListener("submit", function (event) {

    event.preventDefault();

    const id = document.getElementById("pessoaId").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    if (id) {

        // UPDATE
        const pessoa = pessoas.find(p => p.id == id);

        pessoa.nome = nome;
        pessoa.email = email;
        pessoa.telefone = telefone;

    } else {

        // CREATE
        const novaPessoa = {
            id: gerarId(),
            nome: nome,
            email: email,
            telefone: telefone
        };

        pessoas.push(novaPessoa);
    }

    salvarDados();

    formPessoa.reset();
    document.getElementById("pessoaId").value = "";

    atualizarPessoas();
    atualizarSelectPessoas();
});


// READ
function atualizarPessoas() {

    listaPessoas.innerHTML = "";

    pessoas.forEach(pessoa => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${pessoa.nome}</td>
            <td>${pessoa.email}</td>
            <td>${pessoa.telefone}</td>
            <td>
                <button 
                    class="btn-editar"
                    onclick="editarPessoa(${pessoa.id})">
                    Editar
                </button>

                <button 
                    class="btn-excluir"
                    onclick="excluirPessoa(${pessoa.id})">
                    Excluir
                </button>
            </td>
        `;

        listaPessoas.appendChild(tr);
    });
}


// UPDATE - carregar pessoa no formulário
function editarPessoa(id) {

    const pessoa = pessoas.find(p => p.id === id);

    document.getElementById("pessoaId").value = pessoa.id;
    document.getElementById("nome").value = pessoa.nome;
    document.getElementById("email").value = pessoa.email;
    document.getElementById("telefone").value = pessoa.telefone;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// DELETE
function excluirPessoa(id) {

    const pessoaPossuiLivro = livros.some(
        livro => livro.pessoaId === id
    );

    if (pessoaPossuiLivro) {
        alert("Não é possível excluir essa pessoa porque ela possui um livro associado.");
        return;
    }

    const confirmar = confirm(
        "Deseja realmente excluir esta pessoa?"
    );

    if (!confirmar) {
        return;
    }

    pessoas = pessoas.filter(
        pessoa => pessoa.id !== id
    );

    salvarDados();

    atualizarPessoas();
    atualizarSelectPessoas();
}


// ==========================================
// CRUD DE LIVROS
// ==========================================

// CREATE / UPDATE
formLivro.addEventListener("submit", function (event) {

    event.preventDefault();

    const id = document.getElementById("livroId").value;
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const ano = document.getElementById("ano").value;
    const pessoaId = pessoaLivro.value;

    if (id) {

        // UPDATE
        const livro = livros.find(l => l.id == id);

        livro.titulo = titulo;
        livro.autor = autor;
        livro.ano = ano;
        livro.pessoaId = pessoaId
            ? Number(pessoaId)
            : null;

    } else {

        // CREATE
        const novoLivro = {
            id: gerarId(),
            titulo: titulo,
            autor: autor,
            ano: ano,
            pessoaId: pessoaId
                ? Number(pessoaId)
                : null
        };

        livros.push(novoLivro);
    }

    salvarDados();

    formLivro.reset();
    document.getElementById("livroId").value = "";

    atualizarLivros();
});


// READ
function atualizarLivros() {

    listaLivros.innerHTML = "";

    livros.forEach(livro => {

        const pessoa = pessoas.find(
            pessoa => pessoa.id === livro.pessoaId
        );

        const nomePessoa = pessoa
            ? pessoa.nome
            : "Nenhuma";

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.ano || "-"}</td>
            <td>${nomePessoa}</td>

            <td>
                <button 
                    class="btn-editar"
                    onclick="editarLivro(${livro.id})">
                    Editar
                </button>

                <button 
                    class="btn-excluir"
                    onclick="excluirLivro(${livro.id})">
                    Excluir
                </button>
            </td>
        `;

        listaLivros.appendChild(tr);
    });
}


// UPDATE - carregar livro no formulário
function editarLivro(id) {

    const livro = livros.find(l => l.id === id);

    document.getElementById("livroId").value = livro.id;
    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("ano").value = livro.ano;

    pessoaLivro.value = livro.pessoaId || "";

    window.scrollTo({
        top: document.getElementById("formLivro").offsetTop,
        behavior: "smooth"
    });
}


// DELETE
function excluirLivro(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este livro?"
    );

    if (!confirmar) {
        return;
    }

    livros = livros.filter(
        livro => livro.id !== id
    );

    salvarDados();

    atualizarLivros();
}


// ==========================================
// SELECT DE PESSOAS
// ==========================================

function atualizarSelectPessoas() {

    pessoaLivro.innerHTML = `
        <option value="">Nenhuma pessoa</option>
    `;

    pessoas.forEach(pessoa => {

        const option = document.createElement("option");

        option.value = pessoa.id;
        option.textContent = pessoa.nome;

        pessoaLivro.appendChild(option);
    });
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarPessoas();
atualizarLivros();
atualizarSelectPessoas();