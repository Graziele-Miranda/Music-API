// Função para enviar o formulário de login
function submitLoginForm(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario: username, senha: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        // Login bem-sucedido, ir para página de albuns
        localStorage.setItem("token", data.token);
        window.location.href = "/albums";
      } else {
        alert("Usuário ou senha inválidos");
      }
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login.");
    });
}

// Adicionar o evento de submit ao formulário
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", submitLoginForm);
