import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import { usuariosIniciais } from "../../../src/database/seeds/dados-iniciais";
import { usuarioRepository } from "../../../src/repository/usuarios";

let response: request.Response;

Given("existe um usuário cadastrado com id {int}", async function (id: number) {
  const usuario = usuariosIniciais.find(
    (usuarioCadastrado) => usuarioCadastrado.id === id,
  );

  if (!usuario) {
    throw new Error(`Usuário de teste com id ${id} não foi definido`);
  }

  await usuarioRepository.replaceAll([usuario]);
});

Given("não existe usuário cadastrado com id {int}", async function (id: number) {
  await usuarioRepository.replaceAll(
    usuariosIniciais.filter((usuario) => usuario.id !== id),
  );
});

When(
  "eu envio uma requisição GET de detalhe de usuário para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then(
  "o status da resposta de detalhe de usuário deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then(
  "a resposta de detalhe de usuário deve conter os dados do usuário {int}",
  async function (id: number) {
    const usuarioEsperado = await usuarioRepository.findById(id);

    if (!usuarioEsperado) {
      throw new Error(`Usuário esperado com id ${id} não foi definido no Given`);
    }

    expect(response.body).to.include(usuarioEsperado);
  },
);

Then("a resposta deve informar que o usuário não foi encontrado", function () {
  expect(response.body).to.deep.equal({
    message: "Usuário não encontrado",
  });
});
