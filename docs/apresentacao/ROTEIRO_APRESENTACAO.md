# Roteiro de Apresentação — NOX FINANCE

**Duração sugerida:** ~10 minutos  
**Aluno:** Witorio Bandeira Couto  
**Matrícula:** 202508316201  
**Instituição:** Universidade Estácio de Sá — Goiânia/GO  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Disciplina:** Programação Para Dispositivos Móveis em Android  
**Professor:** Fabrício Leonard Leopoldino  
**Semestre:** 2026.2

Arquivos: `NOX_FINANCE_Apresentacao.pptx` e `NOX_FINANCE_Apresentacao.pdf`.

---

## Slide 1 — Capa (~30s)

Bom dia/boa tarde. Meu nome é **Witorio Bandeira Couto** e vou apresentar o **NOX FINANCE**, aplicativo Android de gestão financeira pessoal com inteligência artificial. O slogan resume a proposta: *Seu dinheiro. Sua estratégia. Seu controle.*

## Slide 2 — Identificação acadêmica (~30s)

Sou aluno de Análise e Desenvolvimento de Sistemas na Estácio de Sá, unidade Goiânia. Esta entrega faz parte da disciplina de Programação Para Dispositivos Móveis em Android, com o professor Fabrício Leonard Leopoldino, no semestre 2026.2. Minha área de interesse é desenvolvimento Full Stack.

## Slide 3 — Problema (~45s)

O problema que identifiquei é a dificuldade de controlar receitas e despesas de forma consolidada. Muitas pessoas usam planilhas isoladas, anotações soltas ou simplesmente não registram. Falta visão unificada, planejamento consistente e orientação personalizada com base nos próprios dados.

## Slide 4 — Objetivo geral (~40s)

O objetivo geral é centralizar o controle financeiro pessoal em um aplicativo Android com recursos inteligentes. Especificamente: registrar movimentações, administrar contas e cartões, planejar orçamentos e metas, gerar relatórios e oferecer assistência via NOX AI.

## Slide 5 — Solução (~50s)

O NOX FINANCE resolve isso em quatro eixos: registrar, organizar, planejar e orientar. O diferencial é a NOX AI, que interpreta apenas dados autorizados e já calculados pelo backend — sem inventar valores.

## Slide 6 — Público-alvo (~30s)

O público-alvo são pessoas que desejam organizar as finanças no celular, acompanhar gastos e planejar objetivos, sem depender de planilhas complexas.

## Slide 7 — Funcionalidades (~60s)

As principais funcionalidades são: dashboard com indicadores; movimentações com categorias e filtros; contas e cartões; planejamento com orçamentos, metas e previsão de caixa; relatórios; e a NOX AI para perguntas e simulações.

## Slide 8 — Experiência do usuário (~45s)

A identidade visual é tema escuro premium com verde esmeralda. As telas de login, dashboard, movimentações e NOX AI priorizam clareza e estados de carregamento, vazio e erro.

## Slide 9 — Arquitetura (~60s)

A arquitetura tem quatro camadas: app React Native/Expo; API NestJS; PostgreSQL com Prisma; e NOX AI no backend com provedor trocável (mock, Ollama ou OpenAI). O app nunca recebe chaves de API.

## Slide 10 — Banco de dados (~45s)

As entidades principais são User, Account, Card, Category, Transaction, Budget, Goal e RecurringExpense. Valores monetários ficam em centavos (inteiros), evitando ponto flutuante. Os dados são isolados por usuário.

## Slide 11 — NOX AI (~60s)

A regra crítica: o backend calcula; a IA explica. Ela responde perguntas como “quanto gastei neste mês?” ou “se eu comprar X, como fica meu orçamento?”, usando fatos autorizados. Simulações não alteram movimentações sem confirmação.

## Slide 12 — Segurança (~45s)

Há cadastro/login com JWT e refresh token, recuperação de senha, bcrypt, validação de entrada e isolamento por `userId`. Chaves de LLM permanecem no servidor.

## Slide 13 — Desenvolvimento e desafios (~50s)

O projeto avançou por fases, da estrutura à IA e documentação. Os desafios reais foram precisão monetária, consistência de saldos, isolamento multiusuário e impedir alucinação de valores pela IA.

## Slide 14 — Resultados e próximos passos (~50s)

Está implementado o MVP funcional: API, app, autenticação, gestão financeira, planejamento, dashboard, relatórios, NOX AI, testes monetários e materiais acadêmicos. Próximos passos: build Android assinado, notificações e exportação de relatórios.

## Slide 15 — Encerramento (~30s)

Agradeço a atenção. Fico à disposição para perguntas e demonstração.  
**NOX FINANCE — Seu dinheiro. Sua estratégia. Seu controle.**

---

## Cronometragem sugerida

| Bloco | Slides | Tempo |
|------|--------|-------|
| Abertura e contexto | 1–4 | ~2 min |
| Solução e produto | 5–8 | ~3 min |
| Técnica | 9–12 | ~3 min |
| Fechamento | 13–15 | ~2 min |
