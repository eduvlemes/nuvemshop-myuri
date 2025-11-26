# Sistema de Proteção por Senha

Um sistema completo de proteção de páginas web com JavaScript puro que bloqueia o acesso ao conteúdo até que o usuário insira a senha correta.

## 🚀 Características

- **100% JavaScript** - Não requer bibliotecas externas
- **Fácil integração** - Basta incluir um arquivo JS
- **Autenticação diária** - A senha é válida por um dia
- **Design responsivo** - Funciona em desktop e mobile
- **Tema automático** - Suporte a modo claro e escuro
- **Animações suaves** - Transições elegantes
- **Totalmente customizável** - Todos os textos e configurações podem ser alterados

## 📦 Instalação

1. Baixe o arquivo `access-protection.js`
2. Inclua o script na sua página HTML:

```html
<script src="access-protection.js"></script>
```

3. Pronto! O sistema será ativado automaticamente.

## 🔧 Configuração

### Configuração Básica

A senha padrão é `senha123`. Para alterar, edite a variável no início do arquivo:

```javascript
const CONFIG = {
  overlayTitle: "Acesso Restrito",
  overlayText:
    "Esta página é protegida. Por favor, insira a senha para continuar.",
  buttonText: "Desbloquear",
  correctPassword: "senha123", // ← Altere aqui
  errorMessage: "Senha incorreta. Tente novamente.",
  storageKey: "page_access_auth",
  placeholder: "Digite a senha",
};
```

### Customização Dinâmica

Você também pode alterar as configurações após o carregamento:

```javascript
// Atualizar configurações
window.AccessProtection.updateConfig({
  overlayTitle: "Área VIP",
  overlayText: "Conteúdo exclusivo para membros",
  correctPassword: "minhasenha",
  buttonText: "Entrar",
});
```

## 🎮 API Disponível

### Métodos Principais

```javascript
// Forçar exibição do overlay
window.AccessProtection.forceShowOverlay();

// Limpar autenticação (forçar nova senha)
window.AccessProtection.clearAuthentication();

// Atualizar configurações
window.AccessProtection.updateConfig({
  correctPassword: "novasenha",
});

// Remover completamente o sistema
window.AccessProtection.destroy();
```

### Configurações Disponíveis

| Propriedade       | Tipo   | Descrição                     |
| ----------------- | ------ | ----------------------------- |
| `overlayTitle`    | string | Título do modal               |
| `overlayText`     | string | Texto explicativo             |
| `buttonText`      | string | Texto do botão                |
| `correctPassword` | string | Senha correta                 |
| `errorMessage`    | string | Mensagem de erro              |
| `placeholder`     | string | Placeholder do campo de senha |

## 🎨 Personalização Visual

O sistema utiliza variáveis CSS que podem ser customizadas:

```css
:root {
  --color-primary: #218391; /* Cor principal */
  --color-primary-hover: #1d7480; /* Cor do hover */
  --color-error: #c0152f; /* Cor do erro */
  --color-background: #fcfcf9; /* Fundo do modal */
  /* ... outras variáveis */
}
```

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta automaticamente a:

- Desktop
- Tablet
- Mobile
- Tema claro/escuro do sistema

## 🔒 Segurança

⚠️ **Importante**: Este sistema é adequado para proteção básica de conteúdo. Para aplicações que requerem segurança real, implemente validação no servidor.

### Como funciona:

1. A autenticação é armazenada em memória (não em localStorage)
2. A validação expira no final do dia
3. O sistema bloqueia completamente a interface

## 📋 Exemplos de Uso

### Uso Básico

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Minha Página Protegida</title>
  </head>
  <body>
    <h1>Conteúdo Protegido</h1>
    <p>Este conteúdo só é visível após a autenticação.</p>

    <script src="access-protection.js"></script>
  </body>
</html>
```

### Uso com Customização

```html
<script src="access-protection.js"></script>
<script>
  // Personalizar após carregar
  window.AccessProtection.updateConfig({
    overlayTitle: "Clube VIP",
    overlayText: "Acesso restrito aos membros do clube",
    correctPassword: "clubevip2024",
    buttonText: "Entrar no Clube",
  });
</script>
```

### Uso Avançado

```javascript
// Verificar se está autenticado
if (window.AccessProtection.isAuthenticatedToday()) {
  console.log("Usuário já autenticado hoje");
}

// Customizar baseado em condições
if (window.innerWidth < 768) {
  window.AccessProtection.updateConfig({
    overlayTitle: "Acesso Mobile",
  });
}
```

## 🆘 Solução de Problemas

### O overlay não aparece

- Verifique se o script está sendo carregado corretamente
- Verifique o console do navegador por erros

### O overlay não desaparece após a senha correta

- Verifique se a senha está correta (case-sensitive)
- Verifique se há erros no console

### Conflitos com outros scripts

- O sistema usa namespace próprio para evitar conflitos
- Verifique se não há outros elementos com IDs similares

## 📄 Licença

Este projeto é de domínio público. Use como desejar.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:

- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

---

**Versão**: 1.0.0
**Compatibilidade**: Todos os navegadores modernos
**Tamanho**: ~15KB (minificado)
