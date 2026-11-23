/** Menu do livro e consultas locais da ficha, do sumário e dos arquivos da edição. */
import { statSync } from "node:fs";
import { join, resolve } from "node:path";
import { BoxRenderable, TextAttributes, TextRenderable } from "@opentui/core";
import { localizarLivro, resumo } from "../../book/project.ts";
import {
  button,
  dim,
  fitText,
  heading,
  keyValueTable,
  scrollPanel,
} from "../components.ts";
import { withIcon, type IconName } from "../icons.ts";
import { clickable } from "../pointer.ts";
import type { Screen, ScreenContext } from "../screen.ts";
import type { Theme } from "../theme.ts";

const opcoes = [
  {
    nome: "Ficha editorial",
    atalho: "f",
    icone: "user",
    cor: "accent",
    dica: "Autoria, editora e edição",
  },
  {
    nome: "Capítulos",
    atalho: "c",
    icone: "list",
    cor: "accentSecondary",
    dica: "Ordem de leitura e fontes",
  },
  {
    nome: "Arquivos de saída",
    atalho: "a",
    icone: "state",
    cor: "ok",
    dica: "PDF, EPUB e MOBI",
  },
  {
    nome: "Guia do Ebookfy",
    atalho: "g",
    icone: "docs",
    cor: "warn",
    dica: "Consultar o manual",
  },
] as const satisfies readonly {
  nome: string;
  atalho: string;
  icone: IconName;
  cor: keyof Theme;
  dica: string;
}[];

type Livro = ReturnType<typeof resumo>;

/** O sumário completo inclui o caminho editável de cada capítulo. */
function sumario(ctx: ScreenContext, livro: Livro, caminhos: boolean) {
  const lista = scrollPanel(ctx.renderer, ctx.theme, {
    title: caminhos ? "Capítulos e fontes" : "Sumário",
    flexGrow: 1,
  });
  for (const [i, capitulo] of livro.chapters.entries()) {
    const linha = new BoxRenderable(ctx.renderer, {
      flexDirection: "row",
      flexShrink: 0,
      gap: 1,
    });
    linha.add(
      new TextRenderable(ctx.renderer, {
        content: String(i + 1).padStart(2, "0"),
        fg: ctx.theme.accentSecondary,
        flexShrink: 0,
      }),
    );
    linha.add(
      new TextRenderable(ctx.renderer, {
        content: capitulo.title,
        fg: ctx.theme.text,
        flexShrink: 1,
        minWidth: 0,
      }),
    );
    lista.add(linha);
    if (caminhos) lista.add(dim(ctx.renderer, ctx.theme, capitulo.file));
  }
  return lista;
}

/** A seleção permanece no mesmo item ao voltar de uma consulta ou atualizar o TOML. */
export function criarTelaLivro(): Screen {
  let selecionado = 0;
  let detalhe = false;
  let pintar: (() => void) | undefined;
  let temLivro = false;
  let rolagem: ReturnType<typeof scrollPanel>["body"] | undefined;

  function abrir(ctx: ScreenContext, i: number) {
    if (i === 3) {
      ctx.goTo("docs");
      return;
    }
    if (!temLivro) return;
    selecionado = i;
    detalhe = true;
    ctx.refresh();
  }

  function voltar(ctx: ScreenContext) {
    detalhe = false;
    ctx.refresh();
  }

  return {
    id: "overview",
    title: "Livro",
    icon: "overview",
    description: "Menu do livro, capítulos e arquivos da edição",
    watch: () => [resolve(localizarLivro() ?? process.cwd(), "ebook.toml")],
    actions: [
      {
        keys: ["r"],
        description: "atualizar",
        icon: "refresh",
        run: (ctx) => ctx.refresh(),
      },
    ],
    onKey(tecla, ctx) {
      if (detalhe && (tecla === "escape" || tecla === "backspace")) {
        voltar(ctx);
        return true;
      }
      const indice = opcoes.findIndex((op) => op.atalho === tecla);
      if (indice >= 0 && (temLivro || indice === 3)) {
        abrir(ctx, indice);
        return true;
      }
      if (!temLivro) return false;
      if (tecla === "up" || tecla === "down") {
        const delta = tecla === "down" ? 1 : -1;
        if (detalhe) rolagem?.scrollBy(delta);
        else {
          selecionado = (selecionado + delta + opcoes.length) % opcoes.length;
          pintar?.();
        }
        return true;
      }
      if (!detalhe && (tecla === "return" || tecla === "space")) {
        abrir(ctx, selecionado);
        return true;
      }
      return false;
    },
    mount(ctx) {
      const { renderer, theme } = ctx;
      const raiz = new BoxRenderable(renderer, {
        flexDirection: "column",
        flexGrow: 1,
        minHeight: 0,
        gap: ctx.space.gapY,
      });
      pintar = undefined;
      rolagem = undefined;
      let livro: Livro;
      try {
        livro = resumo();
        temLivro = true;
      } catch (erro) {
        temLivro = false;
        detalhe = false;
        const aviso = scrollPanel(renderer, theme, {
          title: "Abrir um livro",
          flexGrow: 1,
        });
        aviso.add(heading(renderer, theme, "Projeto indisponível"));
        aviso.add(
          dim(
            renderer,
            theme,
            erro instanceof Error ? erro.message : String(erro),
          ),
        );
        aviso.add(
          dim(
            renderer,
            theme,
            "Para começar em uma pasta vazia, execute ebookfy init.",
          ),
        );
        aviso.add(
          button(renderer, theme, {
            key: "g",
            label: "Abrir guia",
            onPress: () => ctx.goTo("docs"),
          }),
        );
        raiz.add(aviso);
        ctx.status("Projeto indisponível");
        return raiz;
      }

      raiz.add(
        heading(
          renderer,
          theme,
          fitText(livro.title, renderer.width - 2 * ctx.space.pageX),
        ),
      );
      const formatos = livro.output.formats
        .map((f) => f.toUpperCase())
        .join(" / ");
      raiz.add(
        dim(
          renderer,
          theme,
          fitText(
            livro.publisher + "  ·  v" + livro.version + "  ·  " + formatos,
            renderer.width - 2 * ctx.space.pageX,
          ),
        ),
      );
      if (detalhe) {
        raiz.add(
          button(renderer, theme, {
            key: "Esc",
            label: "Voltar ao menu",
            onPress: () => voltar(ctx),
          }),
        );
        const painel =
          selecionado === 1
            ? sumario(ctx, livro, true)
            : scrollPanel(renderer, theme, {
                title: opcoes[selecionado]!.nome,
                flexGrow: 1,
              });
        if (selecionado === 0) {
          painel.add(
            keyValueTable(renderer, theme, [
              ["Autoria", livro.authors.join(", ")],
              ["Editora", livro.publisher],
              ["Edição", livro.version],
              ["Data", livro.date],
              ["Idioma", livro.language],
              ["Identificador", livro.identifier],
            ]),
          );
          painel.add(dim(renderer, theme, livro.description));
        }
        if (selecionado === 2) {
          const pasta = localizarLivro()!;
          for (const formato of livro.output.formats) {
            const caminho = join(
              livro.output.directory,
              livro.slug + "-v" + livro.version + "." + formato,
            );
            const existe = statSync(join(pasta, caminho), {
              throwIfNoEntry: false,
            })?.isFile();
            painel.add(
              new TextRenderable(renderer, {
                content:
                  formato.toUpperCase() +
                  "  " +
                  (existe ? "Disponível" : "A gerar"),
                fg: existe ? theme.ok : theme.warn,
              }),
            );
            painel.add(dim(renderer, theme, caminho));
          }
          painel.add(heading(renderer, theme, "Gerar a edição: ebookfy build"));
        }
        rolagem = painel.body;
        raiz.add(painel);
        ctx.status(opcoes[selecionado]!.nome);
        return raiz;
      }

      const compacto = ctx.layout() === "compact";
      const corpo = new BoxRenderable(renderer, {
        flexDirection: "row",
        flexGrow: 1,
        minHeight: 0,
        gap: ctx.space.gapX,
      });
      const menu = scrollPanel(renderer, theme, {
        title: "Menu do livro",
        width: compacto ? "100%" : 32,
        flexGrow: 0,
        active: true,
      });
      const linhas = opcoes.map((op, i) => {
        const item = new BoxRenderable(renderer, {
          flexDirection: "column",
          flexShrink: 0,
          marginTop: i > 0 && !compacto ? 1 : 0,
        });
        const rotulo = new TextRenderable(renderer, {
          height: 1,
          attributes: TextAttributes.BOLD,
          selectable: false,
        });
        item.add(rotulo);
        item.add(
          new TextRenderable(renderer, {
            content: "    " + op.dica,
            fg: theme.textDim,
            selectable: false,
            height: 1,
          }),
        );
        menu.add(item);
        const atualizar = () => {
          const atual = i === selecionado;
          rotulo.content =
            (atual ? "> " : "  ") +
            withIcon(ctx.icons, op.icone, op.nome) +
            "  [" +
            op.atalho +
            "]";
          rotulo.fg = atual ? theme.keyText : theme[op.cor];
          rotulo.bg = atual ? theme.keyBackground : theme.surface;
        };
        clickable(renderer, item, {
          onClick: () => abrir(ctx, i),
          onHover: (ativo) => {
            if (ativo) {
              selecionado = i;
              pintar?.();
            }
          },
        });
        return { item, atualizar };
      });
      pintar = () => {
        for (const linha of linhas) linha.atualizar();
        menu.body.scrollChildIntoView(linhas[selecionado]!.item.id);
      };
      pintar();
      corpo.add(menu);
      if (!compacto) corpo.add(sumario(ctx, livro, false));
      raiz.add(corpo);
      ctx.status("↑↓ escolher · Enter abrir");
      return raiz;
    },
  };
}

export const overviewScreen = criarTelaLivro();
