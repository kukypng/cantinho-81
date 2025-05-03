
# 📝 Guia Fácil para Editar Dados da Loja

Este guia simples foi criado para ajudar você a personalizar sua loja online **sem precisar entender programação**. Basta seguir as instruções abaixo.

## 📋 Arquivos que Você Pode Editar

### 📄 defaultSettings.json
Este arquivo contém as **configurações gerais da sua loja** como nome, número de WhatsApp, taxas de entrega, etc.

### 📄 initialProducts.json
Este arquivo contém todos os **produtos** que serão exibidos na sua loja.

### 📄 defaultCoupons.json
Este arquivo contém a lista de **cupons de desconto** disponíveis na sua loja.

## ✏️ Como Editar os Arquivos

1. Clique no arquivo que deseja alterar
2. Clique no botão "Editar" (lápis)
3. Faça suas alterações seguindo os exemplos abaixo
4. Salve o arquivo clicando em "Commit" ou "Salvar"

## ⚙️ Configurações da Loja (defaultSettings.json)

```json
{
  "storeName": "Nome da sua loja",          // Nome que aparece no topo do site
  "whatsappNumber": "5511999999999",        // Número com código do país (55) e DDD
  "deliveryFee": 10.00,                     // Taxa de entrega em reais (sem vírgula)
  "freeDeliveryThreshold": 50.00,           // Valor mínimo para entrega grátis (0 para desativar)
  "welcomeMessage": "Bem-vindo!",           // Mensagem na página inicial (pode deixar vazio)
  "footerMessage": "Feito com amor ❤️",     // Mensagem no rodapé
  "customCakeMessage": "Descreva seu bolo:", // Texto para pedidos personalizados
  "socialMedia": {
    "instagram": "https://instagram.com/sualoja",  // Link para Instagram
    "whatsapp": "https://wa.me/5511999999999"      // Link para WhatsApp
  }
}
```

## 🛍️ Produtos (initialProducts.json)

Cada produto segue este formato:

```json
{
  "id": "1",                         // Número único para identificar o produto
  "name": "Nome do Produto",         // Nome que aparecerá na loja
  "description": "Descrição do produto aqui...",
  "price": 19.90,                    // Preço (use ponto, não vírgula)
  "imageUrl": "https://...",         // Link para imagem do produto
  "featured": true,                  // true = destaque na página inicial
  "category": "Bolos no pote"        // Categoria do produto
}
```

### 🌟 Como Adicionar um Novo Produto:

Copie este modelo, altere as informações e adicione ao arquivo initialProducts.json:

```json
{
  "id": "10",  // Use um número que ainda não existe na lista
  "name": "Novo Produto",
  "description": "Descrição do seu novo produto...",
  "price": 25.90,
  "imageUrl": "https://placehold.co/400x300/333/666", // Link para imagem
  "featured": false,
  "category": "Bolos no pote"  // Use categoria existente ou crie nova
}
```

## 🎟️ Cupons de Desconto (defaultCoupons.json)

Cada cupom segue este formato:

```json
{
  "code": "BEMVINDO10",                 // Código que o cliente vai digitar
  "discountType": "percentage",         // "percentage" (%) ou "fixed" (valor fixo)
  "discountValue": 10,                  // 10% ou R$10,00 (dependendo do tipo)
  "minOrderValue": 0,                   // Valor mínimo para usar (0 = sem mínimo)
  "active": true,                       // true = ativo, false = inativo
  "description": "10% de desconto",     // Descrição do cupom
  "expiryDate": "2025-12-31",           // Data de expiração (YYYY-MM-DD) (vazio = sem expiração)
  "usageLimit": 0,                      // Limite de uso (0 = ilimitado)
  "usageCount": 0                       // Contador de uso (não altere)
}
```

### 🌟 Como Adicionar um Novo Cupom:

Copie este modelo, altere as informações e adicione ao arquivo defaultCoupons.json:

```json
{
  "code": "DESCONTO20", 
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderValue": 30.00,
  "active": true,
  "description": "20% de desconto em compras acima de R$30",
  "expiryDate": "2025-12-31",
  "usageLimit": 100,
  "usageCount": 0
}
```

## 📱 Redes Sociais

Para editar seus links de redes sociais:

1. Abra o arquivo `defaultSettings.json`
2. Encontre a seção "socialMedia"
3. Atualize os links do Instagram e WhatsApp

## ❓ Precisa de Ajuda?

Se precisar de mais ajuda, entre em contato com o administrador do sistema ou visite as configurações da loja no painel administrativo.
