# NOX FINANCE

**Repositório:** https://github.com/Norazx7/NoxFinance

**Seu dinheiro. Sua estratégia. Seu controle.**

Aplicativo Android de gestão financeira pessoal com inteligência artificial integrada (**NOX AI**).

> Projeto acadêmico — **Witorio Bandeira Couto** (matrícula **202508316201**)  
> Universidade Estácio de Sá — Goiânia/GO  
> Análise e Desenvolvimento de Sistemas  
> Disciplina: Programação Para Dispositivos Móveis em Android  
> Professor: Fabrício Leonard Leopoldino · Semestre **2026.2**

---

## O que é

O NOX FINANCE centraliza receitas, despesas, contas, cartões, orçamentos, metas e relatórios em um único ambiente. O diferencial é a **NOX AI**, que interpreta apenas dados financeiros autorizados e já calculados pelo backend — sem inventar valores, sem SQL arbitrário e sem alterar movimentações sem confirmação.

## Estrutura do repositório

```
backend/                 API NestJS + Prisma + PostgreSQL
mobile/                  App React Native (Expo + TypeScript)
docs/                    Documentação acadêmica e API
docs/apresentacao/       PPTX, PDF e roteiro de fala
scripts/                 Utilitários (geração da apresentação)
uploads/                 Material de referência enviado
```

## Stack

| Camada | Tecnologias |
|--------|-------------|
| App Android | React Native, Expo, TypeScript, Expo Router, Zustand, TanStack Query |
| Backend | Node.js, NestJS, TypeScript, API REST, JWT + Refresh Token |
| Banco | PostgreSQL + Prisma ORM |
| IA | Provedor trocável no backend (`mock`, `ollama`, `openai`) |

**Regra monetária:** valores em **centavos** (`Int`). Não usamos ponto flutuante nos cálculos financeiros.

## Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- npm
- (Opcional) Expo Go / Android Studio para dispositivo ou emulador
- (Opcional) Ollama ou chave OpenAI para LLM real

## Configuração rápida

### 1) Banco de dados

```bash
# Exemplo local
sudo service postgresql start
# usuário/senha/db conforme backend/.env.example
```

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed          # dados fictícios de demonstração
npm run start:dev     # http://localhost:3847/api
```

Swagger: `http://localhost:3847/api/docs`

**Conta demo (dados de exemplo):**
- e-mail: `demo@noxfinance.app`
- senha: `Demo1234`

### 3) App mobile

```bash
cd mobile
cp .env.example .env   # ou use o .env já criado
npm install
npm run web            # demo web na porta 3848
# ou
npm run android        # Expo / emulador Android
```

`EXPO_PUBLIC_API_URL` deve apontar para a API (padrão: `http://localhost:3847/api`).  
No emulador Android use `http://10.0.2.2:3847/api`.

## Testes

```bash
cd backend
npm test
```

Foram implementados testes unitários para utilitários monetários e validação de `amountCents` nas movimentações.

## Documentação

- [Descrição e objetivos](docs/PROJETO.md)
- [Arquitetura e modelo de dados](docs/ARQUITETURA.md)
- [Requisitos](docs/REQUISITOS.md)
- [API](docs/api/API.md)
- [Roteiro de Extensão](docs/extensao/NOX_FINANCE_Roteiro_de_Extensao.md)
  - `docs/extensao/NOX_FINANCE_Roteiro_de_Extensao.docx`
  - `docs/extensao/NOX_FINANCE_Roteiro_de_Extensao.pdf`

## Divulgação acadêmica (LinkedIn + GitHub + arquivo)

Pacote em `docs/divulgacao/`:

1. **Post LinkedIn:** `docs/divulgacao/POST_LINKEDIN_NOX_FINANCE.md` (copiar de `POST_LINKEDIN_COPIAR.txt`)
2. **Link GitHub:** preencher em `docs/divulgacao/LINKS.md` após publicar o repositório
3. **Arquivo (Roteiro de Extensão):** `docs/divulgacao/arquivos/NOX_FINANCE_Roteiro_de_Extensao.docx` (e PDF)

Checklist: `docs/divulgacao/EVIDENCIAS_OBRIGATORIAS.md`

  - `docs/apresentacao/NOX_FINANCE_Apresentacao.pptx`
  - `docs/apresentacao/NOX_FINANCE_Apresentacao.pdf`

## Limitações conhecidas

- Provedor LLM padrão acadêmico é `mock` (determinístico), salvo configuração de Ollama/OpenAI.
- Recuperação de senha retorna o token na API em ambiente acadêmico (em produção seria enviado por e-mail).
- Build Android assinado (EAS/APK de loja) está planejado; o app é Expo/Android-ready.
- Transferências entre contas existem no modelo, mas o efeito contábil completo é limitado no MVP.
- Não há notificações push neste recorte.

## Próximas etapas

- Build/release Android assinado
- Notificações de vencimento e limites
- Exportação de relatórios (PDF/CSV)
- Ampliação de testes e2e em dispositivo físico
- Observabilidade do provedor LLM em produção

## Licença acadêmica

Material desenvolvido para fins acadêmicos na disciplina citada. Dados de seed são fictícios e identificados como exemplo.
