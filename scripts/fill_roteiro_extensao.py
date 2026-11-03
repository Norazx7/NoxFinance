#!/usr/bin/env python3
"""Gera o Roteiro de Extensão preenchido do NOX FINANCE."""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT_DIR = Path("/workspace/docs/extensao")
OUT_DOCX = OUT_DIR / "NOX_FINANCE_Roteiro_de_Extensao.docx"
OUT_MD = OUT_DIR / "NOX_FINANCE_Roteiro_de_Extensao.md"
OUT_PDF = OUT_DIR / "NOX_FINANCE_Roteiro_de_Extensao.pdf"


def set_run_font(run, *, size=12, bold=False, color=None):
    run.font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    run.font.size = Pt(size)
    run.bold = bold
    if color is not None:
        run.font.color.rgb = color


def add_center(doc, text, *, size=12, bold=True, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(space_after)
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold)
    return p


def add_h1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(10)
    run = p.add_run(text)
    set_run_font(run, size=14, bold=True)
    return p


def add_h2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    set_run_font(run, size=12, bold=True)
    return p


def add_h3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    set_run_font(run, size=12, bold=True)
    return p


def add_body(doc, text, *, first_line_indent=True):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    if first_line_indent:
        p.paragraph_format.first_line_indent = Cm(1.25)
    run = p.add_run(text)
    set_run_font(run, size=12, bold=False)
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    # clear default and set font
    if p.runs:
        p.runs[0].text = text
        set_run_font(p.runs[0], size=12)
    else:
        run = p.add_run(text)
        set_run_font(run, size=12)
    return p


MD = r'''# ROTEIRO DE EXTENSÃO — NOX FINANCE

**Instituição:** Universidade Estácio de Sá  
**Campus/Unidade:** Goiânia – GO  
**Título:** NOX FINANCE — Aplicativo Android de gestão financeira pessoal com inteligência artificial  
**Discente:** Witorio Bandeira Couto (Matrícula 202508316201)  
**Professor orientador:** Fabrício Leonard Leopoldino  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Disciplina:** Programação Para Dispositivos Móveis em Android  
**Ano:** 2026  
**Cidade/Estado:** Goiânia/GO  
**Semestre:** 2026.2  

> Observação: não foram inventados parceiros, termos de cooperação, reuniões comunitárias, avaliações de reação ou resultados de campo não documentados. Itens sem evidência estão como **pendente / a anexar**.

## 1. DIAGNÓSTICO E TEORIZAÇÃO

### 1.1 Identificação das partes interessadas e parceiros

As partes interessadas prioritárias são pessoas adultas — em especial estudantes e profissionais em formação — que desejam organizar a vida financeira pessoal no celular.

Perfil estimado (público-alvo potencial): 18–45 anos; ensino médio completo e/ou superior em andamento; necessidade de previsibilidade de caixa; piloto acadêmico estimado entre 5 e 20 pessoas (a confirmar); aberto a qualquer gênero.

Parceiros institucionais formais: **não há parceria formal assinada neste momento**. Termo de cooperação e evidências de adesão: **pendente / a anexar**.

### 1.2 Problemática

Problema priorizado: dificuldade de controle consolidado das finanças pessoais, com registros fragmentados, baixa visibilidade de saldos/limites e pouca orientação personalizada com base nos próprios dados.

Escuta comunitária formal (atas/entrevistas/formulários de diagnóstico): **pendente / a anexar**, se exigido pela disciplina.

### 1.3 Justificativa

O projeto articula aprendizagem baseada em projetos com demanda real de organização financeira, aplicando desenvolvimento mobile Android, API REST, modelagem, autenticação, testes e IA responsável no curso de ADS.

### 1.4 Objetivos

1. Desenvolver o app Android NOX FINANCE para registro e acompanhamento financeiro.
2. Disponibilizar planejamento (orçamentos, metas, recorrências, previsão) e relatórios.
3. Oferecer a NOX AI interpretando apenas fatos autorizados calculados pelo backend.

Instrumentos de avaliação com o público: formulário/depoimento — resultados **pendente / a anexar**.

### 1.5 Referencial teórico

Lusardi e Mitchell (2014) — alfabetização financeira; Nielsen e Budiu (2013) — usabilidade móvel; Floridi et al. (2018) — ética da IA. No NOX FINANCE, o backend calcula e a IA explica, sem inventar valores.

## 2. PLANEJAMENTO E DESENVOLVIMENTO

### 2.1 Plano de trabalho

Etapas: estrutura → autenticação → gestão financeira → planejamento → dashboard/relatórios → NOX AI → documentação/apresentação → validação com público (pendente). Responsável: Witorio Bandeira Couto. Prazos conforme Plano de Ensino e orientação do professor.

### 2.2 Envolvimento do público

Planejado: teste do app + avaliação de reação. Registros sociocomunitários: **pendente / a anexar**.

### 2.3 Grupo de trabalho

Projeto individual. Witorio Bandeira Couto (desenvolvimento Full Stack e documentação). Orientação: Fabrício Leonard Leopoldino.

### 2.4 Metas e indicadores

MVP funcional; orçamentos/relatórios; NOX AI com factsUsed; testes monetários. Avaliação social: pendente.

### 2.5 Recursos

Humanos/acadêmicos/tecnológicos open source. Sem previsão de gasto da IES.

### 2.6 Detalhamento técnico

Expo/React Native + NestJS + PostgreSQL/Prisma + NOX AI. Entregáveis em `backend/`, `mobile/`, `docs/`. Demo: `demo@noxfinance.app` / `Demo1234`.

## 3. ENCERRAMENTO

### 3.1 Relato coletivo

MVP técnico alcançado. Validação sociocomunitária depende de avaliação de campo (**pendente**).

### 3.1.1 Avaliação de reação

Instrumento previsto; resultados **pendente / a anexar**.

### 3.2 Relato individual — Witorio Bandeira Couto

Contextualização, metodologia, resultados, reflexão e considerações finais conforme documento DOCX completo.
'''


def build_docx():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(3)
    section.right_margin = Cm(2)

    # CAPA
    for _ in range(2):
        doc.add_paragraph()
    add_center(doc, "UNIVERSIDADE ESTÁCIO DE SÁ", size=14, bold=True)
    add_center(doc, "CAMPUS / UNIDADE GOIÂNIA – GO", size=12, bold=True)
    add_center(doc, "Curso: Análise e Desenvolvimento de Sistemas", size=12, bold=False)
    add_center(
        doc,
        "Disciplina: Programação Para Dispositivos Móveis em Android",
        size=12,
        bold=False,
    )
    for _ in range(4):
        doc.add_paragraph()
    add_center(
        doc,
        "NOX FINANCE — Aplicativo Android de gestão financeira pessoal com inteligência artificial",
        size=14,
        bold=True,
    )
    add_center(doc, "Projeto / Roteiro de Extensão", size=12, bold=False)
    for _ in range(5):
        doc.add_paragraph()
    add_center(doc, "Discente: Witorio Bandeira Couto", size=12, bold=True)
    add_center(doc, "Matrícula: 202508316201", size=12, bold=False)
    add_center(doc, "Professor orientador: Fabrício Leonard Leopoldino", size=12, bold=True)
    for _ in range(4):
        doc.add_paragraph()
    add_center(doc, "2026", size=12, bold=True)
    add_center(doc, "Goiânia/GO", size=12, bold=True)

    doc.add_page_break()

    add_body(
        doc,
        "Observação de honestidade acadêmica: este roteiro utiliza apenas os dados "
        "institucionais e de autoria fornecidos. Não foram inventados parceiros, "
        "termos de cooperação, reuniões comunitárias, notas, depoimentos ou resultados "
        "de avaliação de campo. Itens ainda sem evidência estão sinalizados como "
        "“pendente / a anexar”.",
        first_line_indent=False,
    )

    # 1
    add_h1(doc, "1. DIAGNÓSTICO E TEORIZAÇÃO")

    add_h2(doc, "1.1 Identificação das partes interessadas e parceiros")
    add_body(
        doc,
        "As partes interessadas prioritárias do projeto são pessoas adultas, em especial "
        "estudantes e profissionais em formação, que desejam organizar a vida financeira "
        "pessoal no celular — controlar receitas e despesas, acompanhar saldos, cartões, "
        "metas e orçamentos.",
    )
    add_body(
        doc,
        "Perfil estimado do público-alvo potencial (não se trata, neste documento, de amostra "
        "empiricamente aferida): faixa etária aproximada de 18 a 45 anos; escolaridade de "
        "ensino médio completo e/ou ensino superior em andamento; contexto socioeconômico "
        "marcado pela necessidade de maior previsibilidade de caixa; quantidade estimada "
        "para piloto acadêmico entre 5 e 20 pessoas (a confirmar na etapa de validação); "
        "público aberto a qualquer gênero.",
    )
    add_body(
        doc,
        "Parceiros institucionais formais (empresas, ONGs ou órgãos públicos com termo de "
        "cooperação): não há parceria formal assinada neste momento. Caso venha a ser "
        "estabelecida, o termo de acordo deverá ser anexado a este roteiro. Evidências de "
        "adesão ao piloto e eventuais acordos: pendente / a anexar.",
    )

    add_h2(doc, "1.2 Problemática e/ou problemas identificados")
    add_body(
        doc,
        "O problema priorizado é a dificuldade de controle consolidado das finanças pessoais "
        "no cotidiano. Observa-se fragmentação de registros (planilhas, anotações isoladas "
        "ou ausência de registro), baixa visibilidade de saldos e limites de cartão, "
        "planejamento frágil de metas/orçamentos e escassez de orientação personalizada "
        "baseada nos próprios dados do usuário.",
    )
    add_body(
        doc,
        "A situação-problema que motiva o projeto é a ausência de um ambiente único, "
        "acessível por dispositivo móvel Android, capaz de unir registro, organização, "
        "planejamento, relatórios e assistência interpretativa responsável.",
    )
    add_body(
        doc,
        "A demanda sociocomunitária foi considerada a partir da relevância social da "
        "autonomia financeira entre estudantes e jovens adultos. Registros formais de "
        "escuta comunitária (atas, entrevistas ou formulários de diagnóstico de campo) "
        "permanecem pendentes / a anexar, caso a disciplina exija essa evidência específica.",
    )

    add_h2(doc, "1.3 Justificativa")
    add_body(
        doc,
        "Academicamente, o projeto articula a aprendizagem baseada em projetos com uma "
        "demanda real de organização financeira. No curso de Análise e Desenvolvimento de "
        "Sistemas, na disciplina Programação Para Dispositivos Móveis em Android, a proposta "
        "permite aplicar conhecimentos de desenvolvimento mobile, API REST, modelagem de "
        "dados, autenticação, testes e integração com inteligência artificial.",
    )
    add_body(
        doc,
        "A pertinência formativa está na construção Full Stack de uma solução utilizável: "
        "aplicativo React Native/Expo, backend NestJS, PostgreSQL e NOX AI com regra ética "
        "de não inventar valores. Os cálculos financeiros ocorrem no backend; a IA apenas "
        "interpreta fatos autorizados. A motivação do discente é desenvolver competências "
        "de engenharia de software com impacto social direto: controle, previsibilidade e "
        "reflexão sobre hábitos financeiros.",
    )

    add_h2(
        doc,
        "1.4 Objetivos/resultados/efeitos a serem alcançados",
    )
    add_body(
        doc,
        "Os objetivos a seguir descrevem resultados concretos pretendidos pelo projeto:",
        first_line_indent=False,
    )
    add_bullet(
        doc,
        "Desenvolver um aplicativo Android de gestão financeira pessoal (NOX FINANCE) que "
        "permita registrar movimentações, acompanhar contas/cartões e visualizar indicadores.",
    )
    add_bullet(
        doc,
        "Disponibilizar recursos de planejamento (orçamentos, metas, recorrências e previsão "
        "de fluxo) e relatórios para apoiar decisões do usuário.",
    )
    add_bullet(
        doc,
        "Oferecer a NOX AI como assistência interpretativa baseada exclusivamente em dados "
        "autorizados e calculados pelo sistema, sem alteração automática de movimentações.",
    )
    add_body(
        doc,
        "Instrumentos previstos para participação do público na avaliação: formulário de "
        "reação (usabilidade e utilidade percebida), registro de uso em piloto e depoimento "
        "opcional. Resultados desses instrumentos: pendente / a anexar.",
    )

    add_h2(doc, "1.5 Referencial teórico")
    add_body(
        doc,
        "A proposição do NOX FINANCE apoia-se em três eixos teóricos-práticos.",
    )
    add_body(
        doc,
        "Primeiro, a alfabetização e o comportamento financeiro individual. Lusardi e "
        "Mitchell (2014) destacam que conhecimentos e atitudes financeiras influenciam "
        "decisões econômicas ao longo da vida. Ferramentas digitais de acompanhamento "
        "podem apoiar a formação de hábitos de registro e planejamento, desde que sejam "
        "compreensíveis e confiáveis.",
    )
    add_body(
        doc,
        "Segundo, a interação humano-computador e a usabilidade em aplicativos móveis. "
        "Nielsen e Budiu (2013) enfatizam clareza, feedback e redução de carga cognitiva. "
        "No NOX FINANCE, isso se traduz em dashboard objetivo, estados de carregamento, "
        "erro e vazio, além de identidade visual consistente em tema escuro com destaque "
        "esmeralda, facilitando a leitura de saldos e categorias.",
    )
    add_body(
        doc,
        "Terceiro, a responsabilidade no uso de inteligência artificial em sistemas de "
        "apoio à decisão. Floridi et al. (2018) discutem princípios de ética da IA, "
        "incluindo transparência e accountability. No projeto, a NOX AI não inventa números "
        "nem executa consultas arbitrárias: o backend calcula fatos financeiros autorizados "
        "e a linguagem natural apenas explica esses resultados, exigindo confirmação humana "
        "para qualquer alteração de dados. Esses referenciais sustentam as ações de "
        "extensão do projeto.",
    )

    # 2
    add_h1(doc, "2. PLANEJAMENTO E DESENVOLVIMENTO DO PROJETO")

    add_h2(doc, "2.1 Plano de trabalho")
    add_body(
        doc,
        "O plano de trabalho do semestre 2026.2 tem como responsável o discente Witorio "
        "Bandeira Couto e organiza as ações necessárias para alcançar os objetivos do "
        "NOX FINANCE:",
    )
    add_bullet(doc, "Estrutura do projeto, identidade visual e navegação.")
    add_bullet(doc, "Autenticação: cadastro, login, refresh token e recuperação de senha.")
    add_bullet(doc, "Gestão financeira: contas, cartões, categorias e movimentações em centavos.")
    add_bullet(doc, "Planejamento: orçamentos, metas, recorrências e previsão de fluxo.")
    add_bullet(doc, "Dashboard e relatórios com comparação entre períodos.")
    add_bullet(doc, "NOX AI com perguntas e simulações baseadas em fatos autorizados.")
    add_bullet(doc, "Testes, documentação acadêmica e apresentação (PPTX/PDF/roteiro).")
    add_bullet(doc, "Validação com público (formulário/piloto): pendente / a anexar evidências.")
    add_body(
        doc,
        "Formas de acompanhamento: checklists técnicos, testes automatizados monetários, "
        "Swagger da API e materiais em docs/. Datas exatas de entrega institucional não "
        "foram fornecidas neste material e devem seguir o item 14 do Plano de Ensino, bem "
        "como as orientações do professor Fabrício Leonard Leopoldino.",
    )

    add_h2(
        doc,
        "2.2 Envolvimento do público participante na formulação, desenvolvimento e avaliação",
    )
    add_body(
        doc,
        "A forma planejada de envolvimento contempla a escuta do problema de controle "
        "financeiro pessoal, o convite ao teste do aplicativo (conta demo ou conta própria) "
        "e a avaliação de reação por formulário e/ou depoimento.",
    )
    add_body(
        doc,
        "Estratégias de mobilização previstas incluem divulgação acadêmica do MVP, "
        "demonstração das telas principais e orientação de uso da conta de demonstração "
        "com dados fictícios. Registros de reuniões, capturas e formulários preenchidos "
        "pelo público sociocomunitário: pendente / a anexar. Até a coleta dessas evidências, "
        "priorizou-se a entrega técnica de um MVP utilizável e documentado.",
    )

    add_h2(doc, "2.3 Grupo de trabalho")
    add_body(
        doc,
        "Trata-se de projeto individual. Witorio Bandeira Couto é o discente responsável "
        "pela análise, arquitetura, desenvolvimento Full Stack (mobile, API, banco e NOX AI), "
        "testes monetários, documentação acadêmica e materiais de apresentação. Fabrício "
        "Leonard Leopoldino atua como professor orientador da disciplina. Não há outros "
        "integrantes informados para este projeto.",
    )

    add_h2(doc, "2.4 Metas, critérios ou indicadores de avaliação do projeto")
    add_body(
        doc,
        "Para o objetivo de gestão financeira no app, a meta é um MVP Android-ready; o "
        "indicador é a operação dos fluxos principais com a API; o critério de sucesso é "
        "login, dashboard e CRUD de movimentações funcionando.",
    )
    add_body(
        doc,
        "Para planejamento e relatórios, o indicador é a existência de endpoints e telas de "
        "orçamento, metas e despesas por categoria; o critério é o progresso visível e "
        "consistente com os dados. Para a NOX AI, o indicador é a presença de factsUsed/"
        "disclaimer e simulação sem efeito colateral; o critério é não inventar valores e "
        "não alterar movimentações sem confirmação.",
    )
    add_body(
        doc,
        "Na qualidade técnica, os valores monetários devem permanecer em centavos (Int) e "
        "os testes Jest devem passar. A avaliação social mediante formulário de reação "
        "permanece pendente / a anexar.",
    )

    add_h2(doc, "2.5 Recursos previstos")
    add_body(
        doc,
        "Recursos humanos: discente desenvolvedor e orientação docente. Recursos "
        "institucionais/acadêmicos: ambiente da disciplina, repositório do projeto e "
        "documentação. Recursos materiais/tecnológicos: computador, Node.js, PostgreSQL, "
        "Expo/React Native, NestJS, Prisma e ferramentas de documentação/apresentação.",
    )
    add_body(
        doc,
        "Recursos financeiros: não há previsão de gastos específicos da IES neste roteiro. "
        "Há preferência por stack open source e provedor LLM mock/Ollama local para "
        "minimizar custos. Qualquer despesa eventual deve indicar fonte própria do discente.",
    )

    add_h2(doc, "2.6 Detalhamento técnico do projeto")
    add_body(
        doc,
        "A solução de Tecnologia da Informação desenvolvida é o NOX FINANCE, aplicativo "
        "Android de gestão financeira pessoal com inteligência artificial integrada.",
    )
    add_body(
        doc,
        "Na camada mobile utilizam-se React Native, Expo, TypeScript, Expo Router, Zustand "
        "e TanStack Query, com identidade visual em tema escuro e destaque esmeralda. Na "
        "camada backend: Node.js, NestJS, API REST, JWT/Refresh Token, validações e "
        "cálculos financeiros em centavos. Na persistência: PostgreSQL com Prisma ORM, "
        "com as principais entidades User, Account, Card, Category, Transaction, Budget, "
        "Goal e RecurringExpense.",
    )
    add_body(
        doc,
        "A NOX AI integra provedor de LLM no backend (mock, Ollama ou OpenAI), usando apenas "
        "fatos autorizados calculados pelo sistema; simulações não alteram dados sem "
        "confirmação. Entregáveis existentes: código em backend/ e mobile/; seed de "
        "demonstração; testes unitários; Swagger; documentação em docs/; apresentação em "
        "docs/apresentacao/. Conta demo (dados fictícios): demo@noxfinance.app / Demo1234.",
    )

    # 3
    add_h1(doc, "3. ENCERRAMENTO DO PROJETO")

    add_h2(doc, "3.1 Relato Coletivo")
    add_body(
        doc,
        "Do ponto de vista técnico-acadêmico, os objetivos de desenvolvimento do MVP foram "
        "alcançados: há aplicativo funcional integrado à API, com gestão financeira, "
        "planejamento, relatórios e NOX AI baseada em fatos calculados.",
    )
    add_body(
        doc,
        "Quanto aos objetivos sociocomunitários de validação com público externo (adoção "
        "assistida, formulário de reação e evidências de impacto percebido), o atingimento "
        "pleno ainda depende da execução e do anexo da avaliação de campo, sob orientação "
        "docente.",
    )

    add_h3(doc, "3.1.1 Avaliação de reação da parte interessada")
    add_body(
        doc,
        "Instrumento previsto: formulário curto abordando utilidade, clareza, intenção de "
        "uso e sugestões, e/ou depoimento da parte interessada. Resultados da avaliação de "
        "reação: pendente / a anexar. Não foram inventados depoimentos, notas ou percentuais "
        "de satisfação.",
    )

    add_h2(doc, "3.2 Relato de Experiência Individual")
    add_body(
        doc,
        "Discente: Witorio Bandeira Couto. O relato a seguir sistematiza as aprendizagens "
        "construídas sob perspectiva individual.",
        first_line_indent=False,
    )

    add_h3(doc, "CONTEXTUALIZAÇÃO")
    add_body(
        doc,
        "Participei como único discente desenvolvedor do projeto NOX FINANCE, na disciplina "
        "Programação Para Dispositivos Móveis em Android (Universidade Estácio de Sá — "
        "Goiânia/GO, semestre 2026.2), sob orientação do professor Fabrício Leonard "
        "Leopoldino. Minha participação abrangeu o diagnóstico do problema, a implementação "
        "Full Stack, os testes, a documentação e a preparação da apresentação acadêmica.",
    )

    add_h3(doc, "METODOLOGIA")
    add_body(
        doc,
        "A experiência foi vivenciada em ambiente acadêmico de desenvolvimento de software, "
        "com público-alvo potencial composto por pessoas que buscam organização financeira "
        "pessoal. O período corresponde ao semestre 2026.2. As etapas seguiram estrutura, "
        "autenticação, gestão financeira, planejamento, dashboard/relatórios, NOX AI e "
        "finalização documental.",
    )

    add_h3(doc, "RESULTADOS E DISCUSSÃO")
    add_body(
        doc,
        "A expectativa era entregar não apenas telas, mas um sistema utilizável com backend "
        "real e IA responsável. O vivido confirmou a complexidade de manter precisão "
        "monetária, isolamento por usuário e consistência de saldos. O resultado foi um MVP "
        "funcional documentado. Entre as aprendizagens destacam-se arquitetura em camadas, "
        "disciplina com centavos e desenho de IA sem alucinação numérica. A principal "
        "dificuldade foi a amplitude funcional frente ao tempo acadêmico; a validação social "
        "ainda depende de evidências de campo.",
    )

    add_h3(doc, "REFLEXÃO APROFUNDADA")
    add_body(
        doc,
        "A teoria de alfabetização financeira reforça por que o registro e o feedback "
        "importam; a usabilidade explica escolhas de interface; a ética da IA justifica a "
        "regra “backend calcula, IA explica”. Na prática, esses princípios precisaram virar "
        "restrições técnicas concretas, como DTOs, armazenamento em centavos, factsUsed e "
        "confirmação humana antes de alterar movimentações.",
    )

    add_h3(doc, "CONSIDERAÇÕES FINAIS")
    add_body(
        doc,
        "Como perspectivas futuras, recomenda-se piloto com formulário de reação anexado, "
        "build Android assinado, notificações de limites/vencimentos e exportação de "
        "relatórios. Alternativas tecnológicas (por exemplo, Flutter no cliente ou outro "
        "provedor de LLM) existem, mas a stack escolhida atendeu ao objetivo acadêmico de "
        "entrega Full Stack com foco Android via Expo. Capturas técnicas do aplicativo "
        "estão em docs/apresentacao/screenshots/. Evidências de interação sociocomunitária "
        "e avaliação de reação devem ser anexadas quando coletadas (pendente).",
    )

    add_h2(doc, "Referências")
    add_body(
        doc,
        "FLORIDI, L. et al. AI4People—An Ethical Framework for a Good AI Society: "
        "Opportunities, Risks, Principles, and Recommendations. Minds and Machines, 2018.",
        first_line_indent=False,
    )
    add_body(
        doc,
        "LUSARDI, A.; MITCHELL, O. S. The Economic Importance of Financial Literacy: Theory "
        "and Evidence. Journal of Economic Literature, 2014.",
        first_line_indent=False,
    )
    add_body(
        doc,
        "NIELSEN, J.; BUDIU, R. Mobile Usability. Berkeley: New Riders, 2013.",
        first_line_indent=False,
    )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUT_DOCX))
    OUT_MD.write_text(MD, encoding="utf-8")
    print(f"Wrote {OUT_DOCX}")
    print(f"Wrote {OUT_MD}")


if __name__ == "__main__":
    build_docx()
