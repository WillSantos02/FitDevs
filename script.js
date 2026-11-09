/* =============================================================================
 * JuntaFit — Landing Page | script.js
 * -----------------------------------------------------------------------------
 * Este arquivo cuida de TODA a interatividade da página. O HTML define a
 * estrutura, o CSS (Tailwind + styles.css) define a aparência, e aqui ficam
 * os comportamentos:
 *
 *   1. Alternância de tema claro/escuro (com memória da escolha do usuário)
 *   2. Seguir o tema do sistema operacional enquanto o usuário não escolher
 *   3. Rolagem suave ao clicar nos links do menu
 *   4. Validação e "envio" do formulário da Lista VIP
 *   5. Esconder/mostrar a barra de navegação conforme a rolagem
 *
 * Não usamos nenhuma biblioteca (como jQuery): é JavaScript puro ("vanilla").
 * ========================================================================== */

// Todo o código fica dentro de uma IIFE (Immediately Invoked Function
// Expression): uma função que é criada e executada na hora. Assim as variáveis
// declaradas aqui não "vazam" para o escopo global (window) e não conflitam
// com outros scripts da página.
(function () {
  // Modo estrito: o navegador passa a acusar erros que normalmente seriam
  // ignorados silenciosamente (ex.: usar uma variável não declarada).
  "use strict";

  /* ---------------------------------------------------------------------------
   * 1. TEMA CLARO / ESCURO
   * -------------------------------------------------------------------------
   * Como funciona: o tema é controlado pelo atributo data-theme na tag <html>
   * (data-theme="dark" ou data-theme="light"). O styles.css tem regras para
   * cada valor, trocando as variáveis de cor. Então, para mudar o tema, basta
   * trocar esse atributo — o CSS faz o resto.
   *
   * Obs.: o tema inicial já é aplicado por um pequeno script no <head> do
   * index.html, antes da página aparecer, para evitar que ela "pisque" com o
   * tema errado. Aqui só cuidamos das mudanças depois disso.
   * ------------------------------------------------------------------------ */

  // Chave usada para salvar a escolha no localStorage (armazenamento do
  // navegador que persiste mesmo depois de fechar a aba).
  const THEME_KEY = "fitdevs-theme";
  const root = document.documentElement; // a tag <html>
  const themeToggle = document.getElementById("theme-toggle"); // botão sol/lua

  // Aplica um tema e atualiza o texto de acessibilidade do botão.
  // aria-label é lido por leitores de tela; title aparece ao passar o mouse.
  // O texto descreve a AÇÃO do botão (ir para o outro tema).
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const label =
        theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
  }

  // Reaplica o tema atual (definido pelo script do <head>) só para deixar o
  // rótulo do botão coerente. Se por algum motivo não houver tema, usa escuro.
  applyTheme(root.getAttribute("data-theme") || "dark");

  // Ao clicar no botão, inverte o tema e salva a escolha do usuário.
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      // try/catch: em modo anônimo ou com cookies bloqueados o localStorage
      // pode lançar erro. Nesse caso o tema troca, só não fica salvo.
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  /* ---------------------------------------------------------------------------
   * 2. SEGUIR O TEMA DO SISTEMA OPERACIONAL
   * -------------------------------------------------------------------------
   * matchMedia permite "ouvir" media queries do CSS pelo JavaScript. Se o
   * usuário trocar o tema do Windows/celular com a página aberta, a página
   * acompanha — MAS só se ele nunca clicou no botão (nada salvo). A escolha
   * manual sempre tem prioridade.
   * ------------------------------------------------------------------------ */
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", function (e) {
      let saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch (err) {}
      // e.matches é true quando o sistema passou para o modo claro.
      if (!saved) applyTheme(e.matches ? "light" : "dark");
    });

  /* ---------------------------------------------------------------------------
   * 3. ROLAGEM SUAVE NOS LINKS INTERNOS
   * -------------------------------------------------------------------------
   * Os links do menu apontam para âncoras (ex.: href="#funcionalidades", que é
   * o id de uma <section>). O CSS já tem scroll-behavior: smooth, mas este
   * código garante o efeito também em navegadores que não suportam isso.
   * ------------------------------------------------------------------------ */

  // Seleciona todos os <a> cujo href começa com "#" (links internos).
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      // href="#" sozinho (ex.: o logo) não aponta para nenhuma seção:
      // deixa o comportamento padrão (voltar ao topo).
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault(); // cancela o "pulo" seco padrão do navegador
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------------------------------------------------------------------------
   * 4. FORMULÁRIO DA LISTA VIP
   * -------------------------------------------------------------------------
   * O visitante digita o e-mail para entrar na lista de acesso antecipado.
   * IMPORTANTE: por enquanto não há back-end — o e-mail NÃO é enviado para
   * nenhum servidor. Validamos o formato, mostramos uma mensagem de sucesso
   * e registramos no console. Integrar com um banco de dados/serviço de
   * e-mail é um próximo passo do projeto.
   * ------------------------------------------------------------------------ */
  const form = document.getElementById("vip-form");
  const emailInput = document.getElementById("email");
  const message = document.getElementById("form-message"); // <p> de feedback

  if (form) {
    form.addEventListener("submit", function (e) {
      // Impede o comportamento padrão do formulário (recarregar a página).
      e.preventDefault();
      const email = emailInput.value.trim(); // remove espaços nas pontas

      // Expressão regular (regex) simples para validar e-mail:
      // "algo" + "@" + "algo" + "." + "algo", sem espaços.
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        // Erro: mostra a mensagem em vermelho.
        // As cores vêm de classes do Tailwind (text-red-400 / text-brand);
        // "hidden" é a classe que deixa o <p> invisível.
        message.textContent = "Por favor, insira um e-mail válido.";
        message.classList.remove("hidden", "text-brand");
        message.classList.add("text-red-400");
        return;
      }

      // Sucesso (simulado): mostra a mensagem em verde e limpa o campo.
      message.textContent =
        "🎉 Você entrou na Lista VIP! Em breve mandamos novidades.";
      message.classList.remove("hidden", "text-red-400");
      message.classList.add("text-brand");
      emailInput.value = "";

      // Apenas para depuração: dá para ver o e-mail no console do navegador
      // (F12 > Console). Seria aqui que faríamos o envio real (ex.: fetch()).
      console.log("Novo lead VIP:", email);
    });
  }

  /* ---------------------------------------------------------------------------
   * 5. NAVBAR QUE SOME AO ROLAR PARA BAIXO
   * -------------------------------------------------------------------------
   * A barra de navegação é fixa no topo. Para não ocupar espaço enquanto o
   * usuário lê, ela se esconde quando ele rola para BAIXO e reaparece quando
   * rola para CIMA (padrão comum em sites e apps).
   * ------------------------------------------------------------------------ */
  let lastScroll = 0; // posição da rolagem no evento anterior
  const nav = document.querySelector("nav");

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset; // quantos pixels já rolou

    // No topo da página a navbar fica sempre visível.
    if (currentScroll <= 0) {
      nav.style.transform = "translateY(0)";
      return;
    }

    // Rolando para baixo (e já passou 80px, a altura aproximada da navbar):
    // desloca a navbar 100% da própria altura para cima, escondendo-a.
    // Rolando para cima: traz de volta.
    if (currentScroll > lastScroll && currentScroll > 80) {
      nav.style.transform = "translateY(-100%)";
    } else {
      nav.style.transform = "translateY(0)";
    }
    lastScroll = currentScroll;
  });
})();
