import { When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";

import app from "../../../src/app";

let response: request.Response;

// Given está em shared.steps.ts para ser reutilizado em outros cenários de produtos

When(
  "eu envio uma requisição GET de listagem de categorias para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then("o status da resposta da listagem de categorias deve ser {int}", function (statusCode: number) {
  expect(response.status).to.equal(statusCode);
});
