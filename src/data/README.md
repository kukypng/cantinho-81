
# Instruções para Editar Dados da Loja

Este guia foi criado para ajudar você a personalizar sua loja online sem precisar entender programação. Basta editar os arquivos nesta pasta seguindo as instruções abaixo.

## 📁 Arquivos que Você Pode Editar

### 📝 defaultSettings.json
Este arquivo contém as configurações gerais da sua loja como nome, número de WhatsApp, taxas de entrega, etc.

### 📝 initialProducts.json
Este arquivo contém todos os produtos que serão exibidos na sua loja.

## ✏️ Como Editar os Arquivos

1. Clique no arquivo que deseja alterar
2. Clique no botão "Editar" (geralmente representado por um ícone de lápis)
3. Faça suas alterações seguindo os exemplos abaixo
4. Salve o arquivo

## 📱 Configurações da Loja (defaultSettings.json)

```json
{
  "storeName": "Nome da sua loja aqui",
  "whatsappNumber": "5511999999999",  // Número com código do país (55) e DDD
  "deliveryFee": 10.00,               // Valor da taxa de entrega
  "freeDeliveryThreshold": 50.00,     // Valor mínimo para entrega grátis (0 para desativar)
  "welcomeMessage": "Bem-vindo à nossa loja!",  // Mensagem de boas-vindas na página inicial
  "footerMessage": "Feito com amor ❤️",         // Mensagem no rodapé da página
  "customCakeMessage": "Descreva como quer seu bolo personalizado:", // Mensagem para pedidos de bolos personalizados
  "socialMedia": {
    "instagram": "https://instagram.com/sualoja",  // Link para seu Instagram
    "whatsapp": "https://wa.me/5511999999999"      // Link direto para WhatsApp
  }
}
```

## 🛍️ Produtos (initialProducts.json)

Cada produto segue o formato:

```json
{
  "id": "1",                         // Número único para identificar o produto
  "name": "Nome do Produto",         // Nome que aparecerá na loja
  "description": "Descrição completa do produto aqui...",
  "price": 19.90,                    // Preço (use ponto, não vírgula)
  "imageUrl": "https://...",         // Link para imagem do produto
  "featured": true,                  // true = destaque na página inicial, false = sem destaque
  "category": "Categoria do Produto" // Categoria para agrupar produtos similares
}
```

### 🌟 Exemplo para Adicionar um Novo Produto:

Copie este modelo, altere as informações e adicione ao arquivo initialProducts.json:

```json
{
  "id": "10",  // Use um número que ainda não existe na lista
  "name": "Novo Produto",
  "description": "Uma descrição detalhada do seu novo produto...",
  "price": 25.90,
  "imageUrl": "https://placehold.co/400x300/333/666", // Link para imagem
  "featured": false,
  "category": "Bolos no pote"  // Use uma categoria existente ou crie uma nova
}
```

## ✅ Depois de Editar

Após fazer as alterações nos arquivos:

1. Salve os arquivos
2. Atualize a página da sua loja para ver as mudanças

**Importante**: Se você estiver usando o painel administrativo da loja, as mudanças feitas diretamente nesses arquivos só serão aplicadas quando você reiniciar a aplicação ou limpar os dados do navegador.
