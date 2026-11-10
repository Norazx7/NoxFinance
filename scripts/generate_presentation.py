#!/usr/bin/env python3
"""Gera a apresentação acadêmica NOX FINANCE (.pptx)."""

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

OUT_DIR = Path("/workspace/docs/apresentacao")
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PPTX = OUT_DIR / "NOX_FINANCE_Apresentacao.pptx"

BG = RGBColor(0x0A, 0x0B, 0x0D)
CARD = RGBColor(0x16, 0x19, 0x22)
EMERALD = RGBColor(0x10, 0xB9, 0x81)
EMERALD_SOFT = RGBColor(0x34, 0xD3, 0x99)
TEXT = RGBColor(0xF3, 0xF4, 0xF6)
MUTED = RGBColor(0x9C, 0xA3, 0xAF)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)


def set_slide_bg(slide, color=BG):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_round(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def set_runs(paragraph, text, size=18, bold=False, color=TEXT, align=None, font="Calibri"):
    paragraph.clear()
    if align is not None:
        paragraph.alignment = align
    run = paragraph.add_run()
    run.text = text
    run.font.name = font
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    return run


def add_textbox(slide, left, top, width, height, lines):
    """lines: list of (text, size, bold, color, align)"""
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    for idx, item in enumerate(lines):
        text, size, bold, color, align = item
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        set_runs(p, text, size=size, bold=bold, color=color, align=align)
        p.space_after = Pt(6)
    return box


def add_notes(slide, text):
    notes = slide.notes_slide.notes_text_frame
    notes.clear()
    notes.text = text


def accent_bar(slide):
    add_rect(slide, Inches(0), Inches(0), Inches(0.12), Inches(7.5), EMERALD)


def footer(slide, page, total=15):
    add_textbox(
        slide,
        Inches(0.6),
        Inches(7.05),
        Inches(8.5),
        Inches(0.3),
        [
            (
                f"NOX FINANCE  ·  Witorio Bandeira Couto  ·  Estácio Goiânia  ·  {page}/{total}",
                10,
                False,
                MUTED,
                PP_ALIGN.LEFT,
            )
        ],
    )


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # 1 CAPA
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_rect(s, Inches(0), Inches(0), Inches(13.333), Inches(0.08), EMERALD)
    add_textbox(
        s,
        Inches(0.9),
        Inches(1.6),
        Inches(11),
        Inches(1),
        [("NOX FINANCE", 54, True, WHITE, PP_ALIGN.LEFT)],
    )
    add_textbox(
        s,
        Inches(0.9),
        Inches(2.6),
        Inches(11),
        Inches(0.5),
        [("Seu dinheiro. Sua estratégia. Seu controle.", 22, False, EMERALD_SOFT, PP_ALIGN.LEFT)],
    )
    add_textbox(
        s,
        Inches(0.9),
        Inches(3.6),
        Inches(11),
        Inches(2.2),
        [
            ("Witorio Bandeira Couto", 18, True, TEXT, PP_ALIGN.LEFT),
            ("Universidade Estácio de Sá — Goiânia/GO", 16, False, MUTED, PP_ALIGN.LEFT),
            ("Análise e Desenvolvimento de Sistemas", 16, False, MUTED, PP_ALIGN.LEFT),
            ("Programação Para Dispositivos Móveis em Android", 16, False, MUTED, PP_ALIGN.LEFT),
            ("Professor: Fabrício Leonard Leopoldino  ·  Semestre 2026.2", 16, False, MUTED, PP_ALIGN.LEFT),
        ],
    )
    add_notes(
        s,
        "Bom dia/boa tarde. Meu nome é Witorio Bandeira Couto e vou apresentar o NOX FINANCE, "
        "um aplicativo Android de gestão financeira pessoal com inteligência artificial. "
        "A apresentação dura cerca de 10 minutos.",
    )

    # 2 IDENTIFICAÇÃO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Identificação acadêmica", 32, True, WHITE, PP_ALIGN.LEFT)])
    items = [
        ("Aluno", "Witorio Bandeira Couto"),
        ("Matrícula", "202508316201"),
        ("Instituição", "Universidade Estácio de Sá — Goiânia/GO"),
        ("Curso", "Análise e Desenvolvimento de Sistemas"),
        ("Disciplina", "Programação Para Dispositivos Móveis em Android"),
        ("Professor", "Fabrício Leonard Leopoldino"),
        ("Semestre", "2026.2"),
        ("Área de interesse", "Desenvolvimento Full Stack"),
    ]
    y = 1.2
    for label, value in items:
        add_round(s, Inches(0.8), Inches(y), Inches(11.5), Inches(0.55), CARD)
        add_textbox(
            s,
            Inches(1.0),
            Inches(y + 0.08),
            Inches(11),
            Inches(0.4),
            [(f"{label}:  {value}", 16, False, TEXT, PP_ALIGN.LEFT)],
        )
        y += 0.65
    footer(s, 2)
    add_notes(
        s,
        "Sou estudante de Análise e Desenvolvimento de Sistemas na Estácio de Sá, unidade Goiânia. "
        "Minha área de interesse é desenvolvimento Full Stack, e este projeto integra aplicativo móvel, "
        "API e inteligência artificial.",
    )

    # 3 PROBLEMA
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Problema identificado", 32, True, WHITE, PP_ALIGN.LEFT)])
    problems = [
        ("Controle fragmentado", "Dificuldade de controlar receitas e despesas no dia a dia."),
        ("Visão incompleta", "Falta de uma visão consolidada do saldo, contas e cartões."),
        ("Planejamento frágil", "Metas e limites de gastos pouco acompanhados."),
        ("Orientação genérica", "Ausência de orientação personalizada com base nos dados reais do usuário."),
    ]
    positions = [(0.8, 1.3), (6.8, 1.3), (0.8, 4.0), (6.8, 4.0)]
    for (left, top), (title, desc) in zip(positions, problems):
        add_round(s, Inches(left), Inches(top), Inches(5.5), Inches(2.2), CARD)
        add_rect(s, Inches(left), Inches(top), Inches(0.12), Inches(2.2), EMERALD)
        add_textbox(
            s,
            Inches(left + 0.35),
            Inches(top + 0.35),
            Inches(4.8),
            Inches(1.5),
            [
                (title, 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
                (desc, 14, False, TEXT, PP_ALIGN.LEFT),
            ],
        )
    footer(s, 3)
    add_notes(
        s,
        "O problema central é a falta de um ambiente único para acompanhar a vida financeira. "
        "As pessoas registram gastos em planilhas, apps isolados ou simplesmente não registram. "
        "Isso gera perda de controle, planejamento frágil e decisões sem orientação personalizada.",
    )

    # 4 OBJETIVO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Objetivo geral", 32, True, WHITE, PP_ALIGN.LEFT)])
    add_round(s, Inches(0.8), Inches(1.5), Inches(11.5), Inches(2.2), CARD)
    add_textbox(
        s,
        Inches(1.1),
        Inches(1.8),
        Inches(11),
        Inches(1.6),
        [
            (
                "Centralizar o controle financeiro pessoal em um aplicativo Android com recursos inteligentes,",
                20,
                False,
                TEXT,
                PP_ALIGN.LEFT,
            ),
            (
                "permitindo registrar movimentações, acompanhar saldos, planejar orçamentos e receber orientações da NOX AI.",
                20,
                False,
                TEXT,
                PP_ALIGN.LEFT,
            ),
        ],
    )
    specifics = [
        "Registrar receitas e despesas com categorias",
        "Administrar contas, cartões, metas e orçamentos",
        "Gerar relatórios e comparações entre períodos",
        "Oferecer assistência inteligente sem inventar valores",
    ]
    y = 4.1
    for item in specifics:
        add_textbox(
            s,
            Inches(1.0),
            Inches(y),
            Inches(11),
            Inches(0.4),
            [(f"•  {item}", 16, False, MUTED, PP_ALIGN.LEFT)],
        )
        y += 0.45
    footer(s, 4)
    add_notes(
        s,
        "O objetivo geral é centralizar a gestão financeira pessoal em um app Android. "
        "Os objetivos específicos incluem cadastro de movimentações, contas, cartões, planejamento, "
        "relatórios e a NOX AI como diferencial interpretativo.",
    )

    # 5 SOLUÇÃO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Solução proposta — NOX FINANCE", 30, True, WHITE, PP_ALIGN.LEFT)])
    add_textbox(
        s,
        Inches(0.8),
        Inches(1.1),
        Inches(11.5),
        Inches(0.6),
        [("Um ambiente único para registrar, planejar, analisar e perguntar sobre suas finanças.", 16, False, MUTED, PP_ALIGN.LEFT)],
    )
    boxes = [
        ("Registrar", "Receitas, despesas, categorias e histórico completo."),
        ("Organizar", "Contas, cartões, saldos e limites em um só lugar."),
        ("Planejar", "Orçamentos, metas, recorrências e previsão de caixa."),
        ("Orientar", "NOX AI interpreta dados reais calculados pelo backend."),
    ]
    x = 0.8
    for title, desc in boxes:
        add_round(s, Inches(x), Inches(2.1), Inches(2.85), Inches(3.6), CARD)
        add_rect(s, Inches(x), Inches(2.1), Inches(2.85), Inches(0.12), EMERALD)
        add_textbox(
            s,
            Inches(x + 0.2),
            Inches(2.5),
            Inches(2.45),
            Inches(2.8),
            [
                (title, 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
                (desc, 14, False, TEXT, PP_ALIGN.LEFT),
            ],
        )
        x += 3.05
    footer(s, 5)
    add_notes(
        s,
        "A solução é o NOX FINANCE: o usuário registra, organiza e planeja suas finanças, "
        "e a NOX AI explica os números já calculados pelo sistema — sem inventar valores.",
    )

    # 6 PÚBLICO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Público-alvo", 32, True, WHITE, PP_ALIGN.LEFT)])
    audience = [
        ("Quem", "Pessoas que desejam organizar a vida financeira pessoal no celular."),
        ("Necessidade", "Acompanhar gastos, saldos, cartões e metas sem planilhas complexas."),
        ("Valor", "Controle, previsibilidade e orientação contextualizada."),
        ("Diferencial", "NOX AI baseada em fatos financeiros autorizados e calculados no backend."),
    ]
    y = 1.3
    for title, desc in audience:
        add_round(s, Inches(0.8), Inches(y), Inches(11.5), Inches(1.15), CARD)
        add_textbox(
            s,
            Inches(1.1),
            Inches(y + 0.25),
            Inches(11),
            Inches(0.8),
            [
                (title, 16, True, EMERALD_SOFT, PP_ALIGN.LEFT),
                (desc, 15, False, TEXT, PP_ALIGN.LEFT),
            ],
        )
        y += 1.3
    footer(s, 6)
    add_notes(
        s,
        "O público-alvo são pessoas que querem organizar as finanças no celular. "
        "O diferencial está na combinação de gestão completa com assistência inteligente "
        "amarrada a dados reais do usuário.",
    )

    # 7 FUNCIONALIDADES
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Principais funcionalidades", 32, True, WHITE, PP_ALIGN.LEFT)])
    feats = [
        ("01", "Dashboard", "Saldo, receitas, despesas, gráficos e comparação mensal."),
        ("02", "Movimentações", "CRUD de receitas/despesas com categorias e filtros."),
        ("03", "Contas e cartões", "Saldos por conta e limites de cartão."),
        ("04", "Planejamento", "Orçamentos, metas, recorrências e previsão."),
        ("05", "Relatórios", "Categorias, evolução e comparação de períodos."),
        ("06", "NOX AI", "Perguntas, simulações e recomendações contextualizadas."),
    ]
    positions = [
        (0.8, 1.2),
        (4.7, 1.2),
        (8.6, 1.2),
        (0.8, 4.0),
        (4.7, 4.0),
        (8.6, 4.0),
    ]
    for (left, top), (num, title, desc) in zip(positions, feats):
        add_round(s, Inches(left), Inches(top), Inches(3.6), Inches(2.3), CARD)
        add_textbox(
            s,
            Inches(left + 0.25),
            Inches(top + 0.3),
            Inches(3.1),
            Inches(1.7),
            [
                (num, 14, True, EMERALD, PP_ALIGN.LEFT),
                (title, 18, True, WHITE, PP_ALIGN.LEFT),
                (desc, 13, False, MUTED, PP_ALIGN.LEFT),
            ],
        )
    footer(s, 7)
    add_notes(
        s,
        "As funcionalidades cobrem o ciclo completo: dashboard, movimentações, contas e cartões, "
        "planejamento, relatórios e NOX AI. Todas estão implementadas na API e refletidas no app.",
    )

    # 8 UX — telas reais do aplicativo
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Experiência do usuário", 32, True, WHITE, PP_ALIGN.LEFT)])
    add_textbox(
        s,
        Inches(0.8),
        Inches(1.0),
        Inches(11.5),
        Inches(0.4),
        [("Capturas reais do aplicativo NOX FINANCE (tema escuro + verde esmeralda).", 15, False, MUTED, PP_ALIGN.LEFT)],
    )
    screens_dir = Path("/workspace/docs/apresentacao/screenshots/cropped")
    screens = [
        ("Login", "Acesso seguro com JWT.", screens_dir / "nox-login.png"),
        ("Dashboard", "Saldo e indicadores do mês.", screens_dir / "nox-dashboard.png"),
        ("Planejamento", "Contas, orçamentos e metas.", screens_dir / "nox-planning.png"),
        ("NOX AI", "Perguntas com fatos do backend.", screens_dir / "nox-ai.png"),
    ]
    x = 0.55
    for title, desc, img_path in screens:
        add_round(s, Inches(x), Inches(1.45), Inches(3.0), Inches(5.35), CARD)
        if img_path.exists():
            s.shapes.add_picture(
                str(img_path),
                Inches(x + 0.22),
                Inches(1.65),
                width=Inches(2.55),
                height=Inches(3.85),
            )
        else:
            add_round(s, Inches(x + 0.22), Inches(1.65), Inches(2.55), Inches(3.85), RGBColor(0x0F, 0x1A, 0x16))
            add_textbox(
                s,
                Inches(x + 0.35),
                Inches(3.2),
                Inches(2.3),
                Inches(0.5),
                [("tela indisponível", 12, False, MUTED, PP_ALIGN.CENTER)],
            )
        add_textbox(
            s,
            Inches(x + 0.2),
            Inches(5.6),
            Inches(2.6),
            Inches(0.95),
            [
                (title, 14, True, WHITE, PP_ALIGN.LEFT),
                (desc, 11, False, MUTED, PP_ALIGN.LEFT),
            ],
        )
        x += 3.15
    footer(s, 8)
    add_notes(
        s,
        "Aqui mostro as telas reais do app: login, dashboard com saldo, planejamento e NOX AI. "
        "A identidade visual é tema escuro premium com destaque esmeralda. "
        "Se der tempo, abro o app ao vivo depois deste slide.",
    )

    # 9 ARQUITETURA
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Arquitetura do sistema", 32, True, WHITE, PP_ALIGN.LEFT)])
    layers = [
        ("App Android", "React Native + Expo\nTypeScript\nExpo Router\nZustand + TanStack Query"),
        ("API REST", "Node.js + NestJS\nJWT / Refresh Token\nValidações\nCálculos financeiros"),
        ("Banco", "PostgreSQL\nPrisma ORM\nValores em centavos\nIsolamento por usuário"),
        ("NOX AI", "LLM via backend\nMock / Ollama / OpenAI\nFatos autorizados\nSem SQL arbitrário"),
    ]
    x = 0.8
    for title, desc in layers:
        add_round(s, Inches(x), Inches(1.5), Inches(2.85), Inches(4.4), CARD)
        add_rect(s, Inches(x), Inches(1.5), Inches(2.85), Inches(0.7), EMERALD)
        add_textbox(
            s,
            Inches(x + 0.15),
            Inches(1.6),
            Inches(2.55),
            Inches(0.5),
            [(title, 16, True, BG, PP_ALIGN.CENTER)],
        )
        add_textbox(
            s,
            Inches(x + 0.25),
            Inches(2.5),
            Inches(2.4),
            Inches(3.0),
            [(desc, 14, False, TEXT, PP_ALIGN.LEFT)],
        )
        x += 3.05
    footer(s, 9)
    add_notes(
        s,
        "A arquitetura é em camadas: o app mobile consome uma API NestJS, que persiste em PostgreSQL "
        "via Prisma. A NOX AI fica no backend, trocando de provedor sem expor chaves no aplicativo.",
    )

    # 10 BANCO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Banco de dados — principais entidades", 28, True, WHITE, PP_ALIGN.LEFT)])
    entities = [
        "User",
        "Account",
        "Card",
        "Category",
        "Transaction",
        "Budget",
        "Goal",
        "RecurringExpense",
    ]
    x = 0.8
    y = 1.3
    for i, name in enumerate(entities):
        if i == 4:
            x = 0.8
            y = 3.3
        add_round(s, Inches(x), Inches(y), Inches(2.85), Inches(1.5), CARD)
        add_textbox(
            s,
            Inches(x + 0.2),
            Inches(y + 0.45),
            Inches(2.45),
            Inches(0.6),
            [(name, 18, True, EMERALD_SOFT, PP_ALIGN.CENTER)],
        )
        x += 3.05
    add_textbox(
        s,
        Inches(0.8),
        Inches(5.3),
        Inches(11.5),
        Inches(1.2),
        [
            ("Relacionamentos: User 1-N Account/Card/Category/Transaction/Budget/Goal/RecurringExpense.", 14, False, MUTED, PP_ALIGN.LEFT),
            ("Transaction vincula conta, categoria e opcionalmente cartão. Budget possui limites por categoria.", 14, False, MUTED, PP_ALIGN.LEFT),
            ("Valores monetários armazenados em centavos (Int), evitando ponto flutuante.", 14, False, MUTED, PP_ALIGN.LEFT),
        ],
    )
    footer(s, 10)
    add_notes(
        s,
        "O modelo centraliza o usuário e isola seus dados. As movimentações se relacionam com contas, "
        "categorias e cartões. Orçamentos têm limites por categoria. Dinheiro sempre em centavos.",
    )

    # 11 IA
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Inteligência artificial — NOX AI", 30, True, WHITE, PP_ALIGN.LEFT)])
    add_round(s, Inches(0.8), Inches(1.2), Inches(11.5), Inches(1.5), CARD)
    add_textbox(
        s,
        Inches(1.1),
        Inches(1.45),
        Inches(11),
        Inches(1.1),
        [
            ("Os cálculos financeiros são feitos pelo backend. A IA apenas interpreta e explica.", 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
            ("Ela não inventa valores, não executa SQL arbitrário e não altera movimentações sem confirmação.", 15, False, TEXT, PP_ALIGN.LEFT),
        ],
    )
    ai_points = [
        ("Perguntas", "Gastos do mês, categorias, comparação e saúde financeira."),
        ("Simulações", "Impacto de uma compra no orçamento restante."),
        ("Provedores", "Mock acadêmico, Ollama local ou OpenAI via backend."),
        ("Privacidade", "Contexto limitado aos dados autorizados do usuário autenticado."),
    ]
    x = 0.8
    for title, desc in ai_points:
        add_round(s, Inches(x), Inches(3.1), Inches(2.85), Inches(2.8), CARD)
        add_textbox(
            s,
            Inches(x + 0.2),
            Inches(3.4),
            Inches(2.45),
            Inches(2.2),
            [
                (title, 16, True, WHITE, PP_ALIGN.LEFT),
                (desc, 13, False, MUTED, PP_ALIGN.LEFT),
            ],
        )
        x += 3.05
    footer(s, 11)
    add_notes(
        s,
        "A NOX AI recebe fatos já calculados: saldo, receitas, despesas, categoria dominante e orçamento restante. "
        "O provedor de LLM é trocável. No ambiente acadêmico usamos um provedor mock determinístico.",
    )

    # 12 SEGURANÇA
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Segurança e privacidade", 32, True, WHITE, PP_ALIGN.LEFT)])
    secs = [
        ("Autenticação", "Cadastro, login, JWT de acesso e refresh token com revogação."),
        ("Senhas", "Hash bcrypt e fluxo de recuperação com token de uso único."),
        ("Isolamento", "Todas as consultas filtradas por userId do token."),
        ("API keys", "Chaves de LLM ficam apenas no backend, nunca no app."),
        ("Validação", "DTOs com class-validator e tratamento de erros."),
        ("Dinheiro", "Centavos inteiros; sem float em cálculos monetários."),
    ]
    positions = [(0.8, 1.2), (4.7, 1.2), (8.6, 1.2), (0.8, 4.0), (4.7, 4.0), (8.6, 4.0)]
    for (left, top), (title, desc) in zip(positions, secs):
        add_round(s, Inches(left), Inches(top), Inches(3.6), Inches(2.3), CARD)
        add_textbox(
            s,
            Inches(left + 0.25),
            Inches(top + 0.4),
            Inches(3.1),
            Inches(1.6),
            [
                (title, 16, True, EMERALD_SOFT, PP_ALIGN.LEFT),
                (desc, 13, False, TEXT, PP_ALIGN.LEFT),
            ],
        )
    footer(s, 12)
    add_notes(
        s,
        "Segurança cobre autenticação JWT, isolamento por usuário, validação de entrada, "
        "hash de senhas e proteção das chaves de IA. Os cálculos monetários usam inteiros.",
    )

    # 13 DESENVOLVIMENTO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Desenvolvimento e desafios", 30, True, WHITE, PP_ALIGN.LEFT)])
    add_round(s, Inches(0.8), Inches(1.2), Inches(5.7), Inches(5.0), CARD)
    add_textbox(
        s,
        Inches(1.1),
        Inches(1.5),
        Inches(5.2),
        Inches(4.4),
        [
            ("Etapas", 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
            ("1. Estrutura e identidade visual", 14, False, TEXT, PP_ALIGN.LEFT),
            ("2. Autenticação e proteção de rotas", 14, False, TEXT, PP_ALIGN.LEFT),
            ("3. Gestão financeira (contas, cartões, txs)", 14, False, TEXT, PP_ALIGN.LEFT),
            ("4. Planejamento (orçamentos, metas, fluxo)", 14, False, TEXT, PP_ALIGN.LEFT),
            ("5. Dashboard e relatórios", 14, False, TEXT, PP_ALIGN.LEFT),
            ("6. NOX AI com fatos autorizados", 14, False, TEXT, PP_ALIGN.LEFT),
            ("7. Testes, documentação e apresentação", 14, False, TEXT, PP_ALIGN.LEFT),
        ],
    )
    add_round(s, Inches(6.8), Inches(1.2), Inches(5.7), Inches(5.0), CARD)
    add_textbox(
        s,
        Inches(7.1),
        Inches(1.5),
        Inches(5.2),
        Inches(4.4),
        [
            ("Desafios técnicos reais", 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
            ("• Manter dinheiro em centavos ponta a ponta", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Atualizar saldos de conta/cartão com consistência", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Impedir que a IA invente valores", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Isolar dados por usuário em todas as rotas", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Entregar app + API + docs + PPTX acadêmico", 14, False, TEXT, PP_ALIGN.LEFT),
        ],
    )
    footer(s, 13)
    add_notes(
        s,
        "O desenvolvimento seguiu fases. Os desafios mais relevantes foram precisão monetária, "
        "consistência de saldos, isolamento multiusuário e o desenho da NOX AI sem alucinar números.",
    )

    # 14 RESULTADOS
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_textbox(s, Inches(0.8), Inches(0.4), Inches(11), Inches(0.6), [("Resultados e próximos passos", 30, True, WHITE, PP_ALIGN.LEFT)])
    add_round(s, Inches(0.8), Inches(1.2), Inches(5.7), Inches(5.0), CARD)
    add_textbox(
        s,
        Inches(1.1),
        Inches(1.5),
        Inches(5.2),
        Inches(4.4),
        [
            ("Implementado", 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
            ("• API NestJS + PostgreSQL + Prisma", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• App React Native/Expo (Android-ready)", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Auth, contas, cartões, txs, orçamentos, metas", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Dashboard, relatórios e previsão de caixa", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• NOX AI com provedor trocável", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Testes unitários de operações monetárias", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Documentação e apresentação acadêmica", 14, False, TEXT, PP_ALIGN.LEFT),
        ],
    )
    add_round(s, Inches(6.8), Inches(1.2), Inches(5.7), Inches(5.0), CARD)
    add_textbox(
        s,
        Inches(7.1),
        Inches(1.5),
        Inches(5.2),
        Inches(4.4),
        [
            ("Próximos passos", 18, True, EMERALD_SOFT, PP_ALIGN.LEFT),
            ("• Build/release Android (EAS/APK assinado)", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Notificações de vencimento e limites", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Exportação de relatórios (PDF/CSV)", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Testes e2e amplos no dispositivo físico", 14, False, TEXT, PP_ALIGN.LEFT),
            ("• Provedor LLM em produção com telemetria", 14, False, TEXT, PP_ALIGN.LEFT),
        ],
    )
    footer(s, 14)
    add_notes(
        s,
        "O que está pronto é um MVP funcional completo: API, app, IA, testes e documentação. "
        "Os próximos passos incluem build Android assinado, notificações e exportação de relatórios.",
    )

    # 15 ENCERRAMENTO
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(s)
    accent_bar(s)
    add_rect(s, Inches(0), Inches(0), Inches(13.333), Inches(0.08), EMERALD)
    add_textbox(
        s,
        Inches(0.9),
        Inches(2.0),
        Inches(11.5),
        Inches(1),
        [("NOX FINANCE", 48, True, WHITE, PP_ALIGN.CENTER)],
    )
    add_textbox(
        s,
        Inches(0.9),
        Inches(3.0),
        Inches(11.5),
        Inches(0.5),
        [("Seu dinheiro. Sua estratégia. Seu controle.", 20, False, EMERALD_SOFT, PP_ALIGN.CENTER)],
    )
    add_textbox(
        s,
        Inches(0.9),
        Inches(4.0),
        Inches(11.5),
        Inches(1.5),
        [
            ("Obrigado pela atenção.", 22, True, TEXT, PP_ALIGN.CENTER),
            ("Witorio Bandeira Couto  ·  Matrícula 202508316201", 16, False, MUTED, PP_ALIGN.CENTER),
            ("Universidade Estácio de Sá — Goiânia/GO  ·  2026.2", 16, False, MUTED, PP_ALIGN.CENTER),
        ],
    )
    add_notes(
        s,
        "Agradeço a atenção. Fico à disposição para perguntas sobre arquitetura, decisões técnicas "
        "e demonstração do aplicativo NOX FINANCE.",
    )

    prs.save(OUT_PPTX)
    print(f"Saved {OUT_PPTX}")


if __name__ == "__main__":
    build()
