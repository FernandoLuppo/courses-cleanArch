# Documentação Técnica do Sistema - Desafio Node

Este documento fornece uma visão detalhada da arquitetura, fluxo de dados e decisões técnicas implementadas no projeto.

---

## 1. Visão Geral
A aplicação é um sistema de backend robusto, focado em segurança e escalabilidade, seguindo os princípios da **Clean Architecture** (Arquitetura Limpa). O sistema gerencia usuários e sessões com foco especial em proteção contra ataques comuns, como brute force e timing attacks.

## 2. Stack Tecnológica
- **Linguagem:** TypeScript
- **Runtime:** Node.js (v22+)
- **Framework Web:** Express (v5)
- **ORM:** Prisma
- **Banco de Dados Relacional:** PostgreSQL
- **Banco de Dados em Memória:** Redis (Cache, Rate Limiting e Locking)
- **Autenticação:** JSON Web Tokens (JWT) e Cookies HttpOnly
- **Segurança de Senhas:** Argon2 (hashing)
- **Validação de Dados:** Zod
- **Logging:** Pino

---

## 3. Arquitetura do Sistema
O projeto segue uma estrutura baseada em camadas, facilitando a manutenção e a testabilidade:

### Camadas Principais:
1.  **Domain (Domínio):** Contém as regras de negócio puras (Entidades, Repositórios e Erros). É o coração do sistema e não depende de nenhuma tecnologia externa.
2.  **Application (Aplicação):** Orquestra o fluxo de dados entre o domínio e a infraestrutura. Contém os **Use Cases** e as interfaces dos **Providers**.
3.  **Infrastructure (Infraestrutura):** Implementações concretas de tecnologias externas (Banco de Dados, Servidor HTTP, Drivers de Cache, Providers de Hash).
4.  **Factory (Fábricas):** Responsável pela Injeção de Dependências, instanciando controladores, middlewares e casos de uso com suas respectivas dependências.
5.  **Shared (Compartilhado):** Elementos comuns a todas as camadas, como o objeto `Result` e classes de erros globais.

### Comunicação entre Camadas:
- O fluxo segue de fora para dentro: **Request -> Controller -> Use Case -> Entity -> Repository -> DB**.
- A resposta retorna seguindo o caminho inverso, utilizando o objeto `Result` para garantir previsibilidade em casos de sucesso ou falha.

---

## 4. Fluxos Principais

### 4.1. Fluxo de Login
O login foi implementado com múltiplas camadas de segurança:
1.  **Rate Limiting no Redis:** Verifica se o IP ou e-mail já excederam o limite de tentativas.
2.  **Bloqueio Persistente no DB:** Verifica se a conta está temporariamente bloqueada por sucessivas falhas.
3.  **Dummy Hash (Anti-Timing Attack):** Se o usuário não existir, o sistema ainda assim executa uma comparação de hash para manter o tempo de resposta constante, impedindo que atacantes descubram e-mails válidos pelo tempo de execução.
4.  **Distributed Lock (Redis):** Durante a criação da sessão, um lock é aplicado para evitar condições de corrida (Race Conditions) ao gerenciar o limite de sessões ativas por usuário (máximo de 3).
5.  **Tokens:** Gera um `accessToken` (JWT) e um `refreshToken` (Hashed no banco), ambos enviados via cookies **HttpOnly Secure**.

### 4.2. Gerenciamento de Sessão e Rotação
- **Refresh Token:** O sistema utiliza a técnica de rotação de tokens. Cada vez que o `accessToken` expira, o `refreshToken` é usado para gerar um novo par. O token antigo é invalidado.
- **Detecção de Reuso:** Se um `refreshToken` já revogado for utilizado, o sistema revoga **todas** as sessões ativas do usuário, assumindo uma possível brecha de segurança.

### 4.3. Rate Limiting Global
Implementado via `rate-limiter-flexible` com persistência no Redis, limitando requisições por IP para prevenir ataques de negação de serviço (DoS) e brute force.

---

## 5. Decisões Arquiteturais e Racionais
- **Uso de Cookies HttpOnly:** Escolhido para mitigar ataques XSS (Cross-Site Scripting), impedindo que scripts maliciosos acessem os tokens.
- **Lock Atômico no Redis:** Garante a consistência dos dados em ambientes distribuídos, especialmente ao limitar o número de sessões simultâneas.
- **Separação por Factories:** Centraliza a criação de objetos complexos, permitindo que o sistema seja facilmente alterado (ex: trocar de banco ou de provedor de log) sem impactar o código principal.
- **Implementação de Adaptadores (Adapters):** O `HttpAdapter` desacopla a lógica de negócio do framework Express, facilitando uma futura troca de framework (ex: para Fastify ou NestJS).

---

## 6. Observações e Inconsistências Identificadas
- **Módulos Vazios:** Foram identificadas estruturas de pastas e arquivos para `Course` e `Class` (`src/domain/entities/course`, `src/application/use-cases/class`, etc.), porém os arquivos estão vazios ou sem implementação. Isso sugere um desenvolvimento em andamento ou placeholders para funcionalidades futuras.
- **Esquema Prisma Parcial:** O banco de dados atualmente só contém as tabelas `User` e `Session`, não refletindo as entidades de cursos e classes sugeridas pela estrutura de arquivos.
- **Log de Erros:** O sistema utiliza `pino` para logs, o que é excelente para performance, mas os logs de erro em alguns blocos `catch` poderiam ser mais granulares.

---

## 7. Conclusão
O sistema apresenta uma fundação técnica sólida e madura, com foco extremo em segurança e organização de código. A implementação de fluxos de autenticação segue as melhores práticas da indústria, e o uso de Clean Architecture garante que a aplicação esteja preparada para crescer de forma sustentável.
