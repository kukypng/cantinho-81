
# 📝 Configurações do Site

Este diretório contém arquivos de configuração que permitem editar facilmente os elementos do site **sem precisar saber programação avançada**.

## 📋 Arquivos de Configuração

### ⚙️ `store.json`
Contém as configurações básicas da loja como nome, taxa de entrega, etc.

### 🎨 `appearance.json`
Configurações de aparência como cores, fontes, etc.

### 🛒 `initialProducts.json`
Lista de produtos iniciais que serão exibidos na loja ao iniciar pela primeira vez.

### 🎟️ `defaultCoupons.json`
Cupons de desconto padrão disponíveis na loja ao iniciar pela primeira vez.

### ⚙️ `defaultSettings.json`
Configurações padrão da loja ao iniciar pela primeira vez.

## ✏️ Como Editar

1. **Abra** o arquivo que deseja editar
2. **Modifique** os valores seguindo o formato existente
3. **Salve** o arquivo
4. **Atualize** a página para ver as mudanças

### ⚠️ Dicas Importantes:
- Mantenha o formato do arquivo (não remova vírgulas, aspas, etc.)
- Não altere as chaves à esquerda dos dois pontos (`:`)
- Apenas modifique os valores à direita dos dois pontos
- Use ponto (`.`) para números decimais, não vírgula

### 🎨 Editando Cores (appearance.json)
```json
"colors": {
  "primary": "#ff7eb9",  // Cor dos botões principais e destaques
  "secondary": "#f2c0d5", // Cor dos elementos secundários
  "accent": "#fec832",   // Cor de destaque para chamar atenção
  "background": "#ffffff", // Cor de fundo do site
  "text": "#333333"      // Cor do texto principal
}
```

### 🏪 Editando Informações da Loja (store.json)
```json
"storeName": "Minha Loja", // Nome da sua loja
"whatsappNumber": "5511999999999", // Seu WhatsApp com código do país
"deliveryFee": 10, // Taxa de entrega em reais
```

### 🛒 Adicionando um Novo Produto (via painel admin)
1. Faça login no painel administrativo
2. Vá para a seção "Produtos"
3. Clique em "Adicionar Produto"
4. Preencha as informações e salve
