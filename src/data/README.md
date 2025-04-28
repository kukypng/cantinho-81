
# Instruções para Editar Dados da Loja

Este diretório contém arquivos JSON que armazenam os dados iniciais da sua loja. Você pode editar esses arquivos para personalizar sua loja sem precisar modificar o código da aplicação.

## Arquivos Disponíveis

### 1. initialProducts.json
Este arquivo contém os produtos iniciais da loja. A estrutura de cada produto é:

```json
{
  "id": "ID único do produto",
  "name": "Nome do produto",
  "description": "Descrição do produto",
  "price": 299.00,
  "imageUrl": "Caminho para a imagem do produto",
  "featured": true/false,
  "category": "Categoria do produto"
}
```

### 2. defaultSettings.json
Este arquivo contém as configurações iniciais da loja:

```json
{
  "storeName": "Nome da sua loja",
  "whatsappNumber": "Número do WhatsApp (com código do país)",
  "deliveryFee": 0,
  "freeDeliveryThreshold": 0,
  "welcomeMessage": "Mensagem de boas-vindas",
  "footerMessage": "Mensagem do rodapé"
}
```

### 3. userCredentials.json
Este arquivo contém as credenciais de usuário para acesso ao painel administrativo:

```json
[
  {
    "email": "Email do administrador",
    "password": "Senha do administrador",
    "isAdmin": true
  }
]
```

## Como Editar

1. Abra o arquivo que deseja editar em um editor de texto ou IDE.
2. Faça as alterações necessárias seguindo a estrutura existente.
3. Salve o arquivo.
4. Se a aplicação já estiver em execução, você precisará reiniciá-la para que as alterações sejam aplicadas.

**Importante**: Estas configurações iniciais serão usadas apenas na primeira vez que a aplicação for executada ou quando não houver dados salvos no localStorage. Após isso, os dados serão gerenciados pelo aplicativo e armazenados no localStorage do navegador.

Para redefinir os dados para os valores iniciais, você pode limpar o localStorage do navegador ou modificar os dados diretamente no painel administrativo.
