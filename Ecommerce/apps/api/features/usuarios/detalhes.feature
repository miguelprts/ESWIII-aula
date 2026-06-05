# GET /usuarios/1

Feature: Consulta de Usuário por Id

  Como cliente da API do e-commerce
  Quero consultar um usuário específico pelo identificador
  Para verificar os dados de cadastro

  Scenario: Visualizar detalhes de um usuário existente
    Given existe um usuário cadastrado com id 1
    When eu envio uma requisição GET de detalhe de usuário para "/usuarios/1"
    Then o status da resposta de detalhe de usuário deve ser 200
    And a resposta de detalhe de usuário deve conter os dados do usuário 1

  Scenario: Retornar erro ao buscar usuário inexistente
    Given não existe usuário cadastrado com id 999
    When eu envio uma requisição GET de detalhe de usuário para "/usuarios/999"
    Then o status da resposta de detalhe de usuário deve ser 404
    And a resposta deve informar que o usuário não foi encontrado
