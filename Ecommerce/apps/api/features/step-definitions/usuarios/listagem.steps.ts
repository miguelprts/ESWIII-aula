import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import { usuariosIniciais } from "../../../src/database/seeds/dados-iniciais";
import { Usuario } from "../../../src/model/usuario";
import { usuarioRepository } from "../../../src/repository/usuarios";

let response: request.Response;

Given("existem usuários cadastrados", async function () {
  await usuarioRepository.replaceAll(usuariosIniciais);
});

Given("não existem usuários cadastrados", async function () {
  await usuarioRepository.clear();
});

When(
  "eu envio uma requisição GET de listagem de usuários para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then(
  "o status da resposta da listagem de usuários deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then(
  "a resposta da listagem de usuários deve conter os usuários cadastrados",
  async function () {
    expect(response.body).to.be.an("array");

    const usuariosRecebidos = response.body as Usuario[];
    const usuariosEsperados = await usuarioRepository.list();

    for (const usuarioEsperado of usuariosEsperados) {
      const usuarioRecebido = usuariosRecebidos.find(
        (usuario) => usuario.id === usuarioEsperado.id,
      );

      expect(usuarioRecebido).to.include(usuarioEsperado);
    }
  },
);

Then(
  "a resposta da listagem de usuários deve ser uma lista vazia",
  function () {
    expect(response.body).to.deep.equal([]);
  },
);
