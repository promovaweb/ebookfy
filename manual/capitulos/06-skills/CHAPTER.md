# Escolher e executar as skills

As skills numeradas acompanham o trabalho desde a organização até a entrega. A migração no fim do catálogo é um ponto de entrada para livros existentes.

## ebookfy-01-organizar

Prepare a raiz a partir do starter kit. Identifique o leitor, a pergunta do livro e a entrega que ele poderá reproduzir. Registre título, idioma, autoria, identificador e edição em [book].

Compare ebookfy info --json com o briefing e registre lacunas de pesquisa antes da redação.

## ebookfy-02-pesquisar

Leia a descrição do livro no ebook.toml. Para cada pergunta do sumário, reúna a fonte primária, a data de consulta e a passagem usada no capítulo. Guarde esse material em pesquisa/, fora dos capítulos publicados.

Reproduza comandos no ambiente citado e guarde a saída obtida. Registre as permissões de imagens e encaminhe a atribuição para files.credits. Leve lacunas ao editor antes de redigir a passagem.

## ebookfy-03-planejar

Liste as perguntas do leitor na ordem necessária para executar a tarefa. Para cada pergunta, reserve uma pasta com CHAPTER.md e escreva o resultado esperado e as fontes em notas de trabalho.

Ordene as entradas [[chapters]] no ebook.toml. Confira pelo CLI se o percurso começa com uma tarefa viável e termina com uma aplicação completa.

## ebookfy-04-capitulos

Abra o CHAPTER.md indicado por [[chapters]]. Use um título de nível 1 e apresente um problema concreto, a explicação e um exemplo reproduzível. Ao mover a pasta, leve as imagens junto.

Para reordenar a leitura, mova a tabela inteira no TOML. Confira o título e a posição com ebookfy info.

## ebookfy-05-imagens

Guarde a imagem em imagens/ ao lado do CHAPTER.md correspondente. Use um nome descritivo e um caminho relativo como `![Descrição do detalhe](imagens/detalhe.png)`.

Registre origem e permissão de uso no arquivo de créditos. Abra as três saídas e confira legenda, resolução e leitura em tela estreita.

## ebookfy-06-capa

Leia título, subtítulo e autoria da configuração. Em um manual de projeto, siga a marca do produto. Em um ebook editorial, parta da foto original autorizada e guarde sua atribuição.

Exporte uma capa PNG ou JPEG, configure files.cover e confira a miniatura no leitor EPUB. Examine também a primeira página do PDF.

## ebookfy-07-introducao

Use a primeira entrada de [[chapters]] para uma introdução autônoma ou abra o primeiro capítulo com ela. Apresente o material de partida, o exemplo que acompanhará o percurso e a primeira ação do leitor.

Releia files.preface. Corte a apresentação que já aparece ali e execute a primeira instrução com as informações disponíveis até esse ponto.

## ebookfy-08-prefacio

Abra files.preface. Apresente o público, os materiais necessários e o trabalho que o leitor terá produzido ao terminar. Indique o capítulo apropriado para leitores experientes.

Confira se o sumário cobre os assuntos apresentados e reserve os exemplos detalhados para os capítulos.

## ebookfy-09-creditos

Abra files.credits. Registre autoria, edição, revisão, fontes de imagens e respectivas licenças. Consulte a autorização original de cada imagem antes de indicar condições de uso.

Compare os nomes e as atribuições com book.authors, book.publisher e book.rights. Identifique material de terceiros com origem e link.

## ebookfy-10-autor

Abra files.author. Redija uma apresentação breve apoiada na participação real de cada pessoa ou organização no trabalho. Use a grafia de book.authors.

Confira nomes e destinos dos links com as fontes fornecidas. Inclua apenas experiências verificáveis e pertinentes ao tema.

## ebookfy-11-conclusao

Consulte a promessa no prefácio e o último item de [[chapters]]. Retome o trabalho produzido pelo leitor, explique como conferir o resultado e proponha uma aplicação compatível com o material.

Inclua a conclusão no último CHAPTER.md ou registre um capítulo próprio antes dos créditos. Confira o percurso completo na TUI.

## ebookfy-12-revisar

Leia o prefácio, cada capítulo na ordem configurada, créditos e autoria. Execute os exemplos, confirme referências e confira se cada capítulo entrega o que anuncia.

Registre por arquivo a passagem examinada, a correção necessária e a conferência posterior. Abra a TUI para revisar título, edição e sequência.

## ebookfy-13-exportar

Confira os programas dos formatos pedidos em output.formats. Execute ebookfy build --json e leia a lista de arquivos produzidos.

Abra PDF, EPUB e MOBI quando selecionados. Confira metadados, capa, índice, imagens e acentos. Registre a versão do livro junto aos artefatos entregues.

## ebookfy-14-distribuir

Consulte book.version, book.rights e output.formats no ebook.toml. Reúna somente os arquivos produzidos pela compilação daquela edição e calcule SHA-256 para a conferência após a transferência.

Confirme o destino autorizado para distribuição. Depois do envio, baixe os exemplares pelo mesmo caminho que o leitor usará, compare os hashes e registre os links junto à edição.

## ebookfy-15-migrar

Em um projeto com reading-order.txt, use a ordem explícita do guia. Para um ebook de conteúdo, separe o manuscrito por títulos e preserve as notas de pesquisa e revisão fora da leitura.

Transfira os metadados para o TOML e os recursos para as pastas de capítulo. Compare o texto e a sequência das novas saídas com a edição anterior.

## Usar as referências e as checklists

No starter kit, cada pasta em `.agents/skills/` contém um `SKILL.md` e um diretório `references/`. Abra primeiro o arquivo da etapa. A seção de referência indica quando recorrer ao exemplo ou à tabela de diagnóstico. Na checklist, marque somente as verificações que você realizou e anote o arquivo ou exemplar usado na prova.

Por exemplo, ao receber uma fotografia para o segundo capítulo, use a etapa 05 para escolher o detalhe e testar a figura na página. A etapa 09 ajuda a relacionar aquele arquivo à atribuição recebida. Na etapa 13, leia a passagem no EPUB com a fonte ampliada e compare com a página do PDF. Se o texto estiver legível em apenas um formato, registre esse resultado e retorne à figura antes de distribuir.

## Conduzir uma revisão com o agente

Suponha que o capítulo da oficina já tenha texto e uma figura. Abra o agente na cópia do livro e peça a revisão de um capítulo específico. Informe o resultado esperado e os arquivos que ele pode consultar. Este pedido é suficiente para iniciar uma leitura dirigida.

> Use ebookfy-12-revisar no segundo capítulo. Confira se os passos permitem preparar a bancada com os materiais citados, se a imagem está na pasta do capítulo e se os créditos identificam sua origem. Registre os trechos que precisam de ajuste antes de editar.

Depois da leitura, compare as observações com a passagem mencionada. Quando uma instrução de montagem precisar mudar, peça um ajuste naquele trecho e repita a prova de leitura. A revisão editorial precisa examinar o exemplo e seu efeito no texto. A compilação verifica outra parte do trabalho, como a disponibilidade dos recursos e a leitura dos formatos de saída.

Para migrar um projeto antigo, comece pela skill 15 e volte à organização ou ao planejamento conforme o estado das fontes. Para trocar apenas a figura de um capítulo, entre pela skill 05, revise os créditos e passe à exportação. A sequência serve como percurso para um livro novo e permite retomar tarefas pontuais de uma edição existente.
