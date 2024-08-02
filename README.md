# CentroComunitario

## Comandos de Execução

Para executar a aplicação na porta 3000 - ˋˋˋnpm startˋˋˋ
Para executar o docker em 2° plano - ˋˋˋdocker-compose up -d --buildˋˋˋ
Para parar o docker - ˋˋˋdocker-compose downˋˋˋ

# Descrição do problema

Durante emergências, como desastres naturais ou crises sociais, centros comunitários podem desempenhar um papel crucial ao fornecer abrigo, alimentos, cuidados médicos e outros serviços essenciais para a comunidade. Para garantir que os recursos sejam utilizados de maneira eficiente e que as necessidades da comunidade sejam atendidas, é necessário um bom sistema de informações para ajudar na tomada de decisões e na coordenação dos esforços entre diferentes centros.

Você foi designado para desenvolver um sistema, que fará parte de um conjunto de micro serviços, que irá coletar informações de centros comunitários em todo o país, organizá-las e prover informações com base nelas.

## Requisitos

### Você irá desenvolver uma API RESTFul para armazenar informações sobre os centros comunitários, seus recursos (pessoais e materiais), informações sobre ocupação, etc., ajudando no intercâmbio de recursos.

#### Adicionar centros comunitários

Um centro comunitário deve ter um nome, endereço, localização, quantidade máxima de pessoas que o centro suporta, quantidade de pessoas ocupando o centro, etc. Ao adicionar o centro comunitário, devem ser adicionados seus recursos atuais. Você deve identificar quais informações serão pertinentes para serem adicionadas em cada registro.

#### Atualizar percentual de ocupação de um centro comunitário

Um centro comunitário deve poder atualizar a quantidade de pessoas que o está ocupando no momento. Deste modo, o sistema deve gerar uma notificação caso o centro atinja sua capacidade máxima, está notificação será consumida por outro micro serviço, o qual não faz parte do escopo deste sistema, para que os centros próximos sejam notificados da possibilidade de aumento de pessoas nas próximas horas.

### Intercâmbio de recursos

Os recursos dos centros comunitários só podem ser alterados via intercâmbio. Aquisição de recursos avulsos será feita em outra API, a qual não fará parte do escopo deste sistema, pois requer um processo específico.

Os centros comunitários poderão trocar recursos entre eles. Para isso, eles devem respeitar a tabela de valores abaixo, onde o valor do recurso é descrito em termos de pontos. Ambos os centros comunitários deverão oferecer a mesma quantidade de pontos. Por exemplo, 2 voluntários e 1 veículo de transporte (2 x 3 + 1 x 5 = 11), valem o mesmo que 1 médico e 1 kit de suprimentos médicos (1 x 4 + 1 x 7 = 11). Esta regra poderá ser quebrada caso algum centro esteja com ocupação maior que 90%, onde ele poderá oferecer menos recursos que outro centro no intercâmbio. A negociação deve ser armazenada em um histórico e os itens deverão ser transferidos de um centro comunitário a outro.

#### Tabela de pontos dos recursos

| Item                         | Pontos   |
| ---------------------------- | -------- |
| 1 Médico                     | 4 pontos |
| 1 Voluntário                 | 3 pontos |
| 1 Kit de suprimentos médicos | 7 pontos |
| 1 Veículo de transporte      | 5 pontos |
| 1 Cesta básica               | 2 pontos |

### Relatórios

A API deve oferecer os seguintes relatórios:

- Centros comunitários com ocupação maior que 90%.
- Quantidade média de cada tipo de recurso cadastrado no sistema (Ex: 2 veículos de transporte por centro).
- Histórico de negociação.
  - O relatório de histórico de negociação deve conter somente negociações de um determinado centro. Deste modo, deve-se filtrar este relatório para que não sejam retornadas negociações pertencentes a outros centros. Este filtro deve ser obrigatório.
  - Do mesmo modo, o Histórico de negociações deve disponibilizar a opção de filtrar as negociações que aconteceram de um ponto no passado até o momento atual. Por exemplo: Ao enviar a data de três horas atrás nesse filtro, só devem ser retornados as negociações que aconteceram no período de três horas atrás até o momento atual.

## Notas

- Deverá ser utilizado NodeJs, Serverless Framework (pode ser utilizado o Serverless Offline) ou Express.
- Deverá ser utilizado o MongoDB para persistência dos dados.
- Pode ser utilizado Docker para gerar uma imagem do sistema e também Docker Compose para agregar as dependências.
- Nós ainda nos preocupamos com uma programação adequada (código limpo) e técnicas de arquitetura, você deve demonstrar isso mesmo em meio a um desastre natural.
- Não esqueça de documentar a sua API.
- Sua API deve estar coberta por testes unitários.
- Da descrição acima você pode escrever uma solução básica ou adicionar requisitos não descritos. Use seu tempo com sabedoria; Uma solução ótima e definitiva pode levar muito tempo para ser efetiva, então você deve trazer a melhor solução possível, que leve o mínimo de tempo, mas que ainda seja capaz de demonstrar suas habilidades.
- Comente qualquer dúvida e cada decisão tomada.
- Publique o projeto no github e envie o repositório para o e-mail manoel.neto@phoebustecnologia.com.br
- Implemente o máximo possível dos requisitos mencionados. Caso não seja possível atender todos os itens solicitados, envie o repositório mesmo assim.
  teste-pratico-nodejs.md
  Exibindo teste-pratico-nodejs.md.
