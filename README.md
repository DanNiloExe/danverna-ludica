# 🎲 Danverna Lúdica

Uma página criada para organizar e divulgar um encontro de jogos de tabuleiro ao ar livre, com temática medieval e clima de taverna.

A proposta é reunir jogadores para uma tarde de jogos e piquenique , facilitando a divulgação do evento e a confirmação de presença dos participantes.

## ✨ Funcionalidades

- **Informações do encontro:** apresentação da data, horário e local.
- **Contagem regressiva:** cronômetro atualizado automaticamente até o início do evento.
- **Confirmação de presença:** formulário para informar se irá participar, indicar acompanhante ou justificar a ausência.
- **Contagem de participantes:** exibição da quantidade de presenças confirmadas e recusadas.
- **Integração com Google Sheets:** registro e consulta das respostas por meio do Google Apps Script.
- **Adicionar ao calendário:** opções para salvar o evento no Google Agenda ou baixar um arquivo `.ics`.
- **Controle de respostas:** armazenamento local para evitar envios repetidos pelo mesmo navegador.

## 🛠️ Tecnologias utilizadas

- **HTML5:** estrutura da página.
- **CSS3:** personalização visual e estilos próprios.
- **JavaScript:** funcionalidades e interações da página.
- **Tailwind CSS:** estilização e responsividade.
- **Google Apps Script:** integração e comunicação com a planilha.
- **Google Sheets:** armazenamento das respostas.
- **Lucide:** biblioteca de ícones.
- **Google Fonts:** tipografia utilizada no projeto.

## 🎨 Identidade visual

O projeto utiliza uma temática medieval inspirada em tavernas de fantasia e RPGs, com elementos como pergaminhos, madeira, tons terrosos e detalhes dourados.

A proposta visual busca combinar o universo dos jogos de tabuleiro com uma interface simples de navegar e adaptada para diferentes tamanhos de tela.

## ⚙️ Como executar

1. Clone este repositório:

   ```bash
   git clone URL_DO_REPOSITORIO
   ```

2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` no navegador.

Não é necessário instalar dependências para visualizar a página.

**Observação:** para utilizar o formulário e a contagem de participantes, é necessário configurar um Google Apps Script publicado como Web App e inserir sua URL na variável `GOOGLE_SCRIPT_URL`, no JavaScript.

## 📌 Sobre o projeto

A Danverna Lúdica surgiu como uma solução simples para organizar um encontro presencial entre pessoas interessadas em jogos de tabuleiro.

Além da divulgação do evento, o projeto também foi uma oportunidade de praticar desenvolvimento web, manipulação do DOM, armazenamento local, integração com serviços externos e criação de interfaces responsivas.
