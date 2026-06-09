Feature: Recarregar página inicial

  Como visitante do e-commerce
  Quero recarregar os dados da página inicial
  Para visualizar as informações mais recentes do catálogo

  Scenario: Recarregar dados ao clicar no botão
    Given a página inicial do e-commerce está carregada
    When eu clico no botão "Recarregar"
    Then os dados da página inicial devem ser carregados novamente
