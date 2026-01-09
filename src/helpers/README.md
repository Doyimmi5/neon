# 🛠️ Helpers - Documentação

Este diretório contém utilitários e funções auxiliares para o bot Discord.

## 📁 Estrutura

### 🔧 **BotUtils.js**
Utilitários específicos do bot Discord.

**Principais funções:**
- `getImageFromMessage()` - Extrai imagem de mensagem, menção ou URL
- `findMatchingRoles()` - Encontra cargos correspondentes por nome/ID
- `findMatchingChannels()` - Encontra canais correspondentes por nome/ID
- `findMatchingMembers()` - Encontra membros correspondentes por nome/ID

### 🌐 **HttpUtils.js**
Utilitários para requisições HTTP.

**Principais funções:**
- `getJson(url, options)` - Requisição GET retornando JSON
- `getBuffer(url, options)` - Requisição GET retornando buffer
- `postJson(url, data, options)` - Requisição POST com JSON
- Tratamento automático de erros e timeouts

### 📝 **Logger.js**
Sistema de logging colorido para console.

**Métodos disponíveis:**
- `logger.success(message)` - Log verde de sucesso
- `logger.error(message)` - Log vermelho de erro
- `logger.warn(message)` - Log amarelo de aviso
- `logger.info(message)` - Log azul de informação
- `logger.debug(message)` - Log cinza de debug

### 🔨 **ModUtils.js**
Utilitários para moderação.

**Principais funções:**
- `banTarget(issuer, target, reason)` - Banir usuário
- `kickTarget(issuer, target, reason)` - Expulsar usuário
- `timeoutTarget(issuer, target, duration, reason)` - Timeout usuário
- `warnTarget(issuer, target, reason)` - Avisar usuário
- Verificações automáticas de permissões

### 🔧 **Utils.js**
Utilitários gerais do sistema.

**Principais funções:**
- `timeformat(seconds)` - Formatar tempo (ex: "2h 30m")
- `getRemainingTime(timestamp)` - Tempo restante até timestamp
- `diffHours(date1, date2)` - Diferença em horas entre datas
- `getRandomInt(max)` - Número aleatório
- `isValidColor(color)` - Validar cor
- `isHex(color)` - Validar cor hexadecimal
- `parsePermissions(permissions)` - Formatar permissões para leitura

### ✅ **Validator.js**
Validadores para diferentes tipos de dados.

**Principais funções:**
- `isValidURL(url)` - Validar URL
- `isValidEmail(email)` - Validar email
- `isValidDiscordId(id)` - Validar ID do Discord
- `isValidHexColor(color)` - Validar cor hexadecimal
- `isValidImageURL(url)` - Validar URL de imagem

### 📊 **channelTypes.js**
Mapeamento de tipos de canais Discord.

**Conteúdo:**
- Constantes para tipos de canais
- Mapeamento de IDs para nomes legíveis
- Utilitários para identificação de tipos

### 🔐 **permissions.js**
Mapeamento de permissões Discord.

**Conteúdo:**
- Lista completa de permissões Discord
- Mapeamento de flags para nomes legíveis
- Utilitários para verificação de permissões

## 📂 Extenders

### 🏰 **Guild.js**
Extensões para a classe Guild do Discord.js.

**Métodos adicionados:**
- `findMatchingRoles(query)` - Buscar cargos por nome/ID
- `findMatchingChannels(query)` - Buscar canais por nome/ID
- `findMatchingMembers(query)` - Buscar membros por nome/ID

### 📺 **GuildChannel.js**
Extensões para canais de servidor.

**Métodos adicionados:**
- `canSendEmbeds()` - Verificar se pode enviar embeds
- `safeSend(content)` - Enviar mensagem com tratamento de erro

### 💬 **Message.js**
Extensões para mensagens.

**Métodos adicionados:**
- `safeReply(content)` - Responder com tratamento de erro
- `safeEdit(content)` - Editar com tratamento de erro
- `safeDelete()` - Deletar com tratamento de erro

## 🚀 Como usar

```javascript
// Importar helpers
const { getJson } = require("@helpers/HttpUtils");
const { timeformat } = require("@helpers/Utils");
const logger = require("@helpers/Logger");

// Usar funções
const data = await getJson("https://api.example.com/data");
const formattedTime = timeformat(3600); // "1h"
logger.success("Operação concluída!");
```

## 📋 Convenções

- **Async/Await**: Todas as funções assíncronas usam async/await
- **Error Handling**: Tratamento de erro consistente
- **JSDoc**: Documentação completa com tipos
- **Modular**: Cada helper tem responsabilidade específica

## 🔄 Atualizações

Os helpers são atualizados regularmente para:
- ✅ Melhorar performance
- ✅ Adicionar novas funcionalidades
- ✅ Corrigir bugs
- ✅ Manter compatibilidade com Discord.js

---

**💡 Dica:** Use os helpers para manter o código limpo e reutilizável!