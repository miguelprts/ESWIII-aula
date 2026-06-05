# GET /usuarios

Feature: Listagem de Usuários

  Como cliente da API do e-commerce
  Quero visualizar os usuários cadastrados
  Para consultar os cadastros disponíveis no sistema

  Scenario: Visualizar lista de usuários cadastrados
    Given existem usuários cadastrados
    When eu envio uma requisição GET de listagem de usuários para "/usuarios"
    Then o status da resposta da listagem de usuários deve ser 200
    And a resposta da listagem de usuários deve conter os usuários cadastrados

  Scenario: Visualizar lista vazia de usuários
    Given não existem usuários cadastrados
    When eu envio uma requisição GET de listagem de usuários para "/usuarios"
    Then o status da resposta da listagem de usuários deve ser 200
    And a resposta da listagem de usuários deve ser uma lista vazia
