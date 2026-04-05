# 🔎 Itens do Texto 2 que NÃO aparecem no Texto 1 (Requerem Correção)

## 🔴 Problemas Críticos

### 1. IDOR na Deleção de Usuários

No `DeleteUser.Controller`, o ID do usuário é obtido diretamente da URL sem validação de ownership.

**Problema:**
Qualquer usuário autenticado pode deletar outro usuário apenas conhecendo seu ID.

**Impacto:**

- Quebra total de isolamento entre usuários
- Vulnerabilidade crítica de segurança (controle de acesso inexistente)

**Correção recomendada:**

- Validar se o `id` pertence ao usuário autenticado (`req.user.sub`)
- Ou aplicar regra de autorização (ex: admin vs usuário comum)

---

### 2. Bypass de Senha (Falta de `await`)

No `UpdateUser.UseCase`, o método `compare` é chamado sem `await`.

```ts
const isValidPassword = this.passwordHasherProvider.compare(...)
```
