import {
  After,
  AfterAll,
  Before,
  Given,
  Then,
  When,
} from "@cucumber/cucumber";
import { expect } from "chai";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});

Object.defineProperties(globalThis, {
  window: { value: dom.window, configurable: true },
  document: { value: dom.window.document, configurable: true },
  navigator: { value: dom.window.navigator, configurable: true },
  HTMLElement: { value: dom.window.HTMLElement, configurable: true },
  SVGElement: { value: dom.window.SVGElement, configurable: true },
  Element: { value: dom.window.Element, configurable: true },
  Node: { value: dom.window.Node, configurable: true },
  MutationObserver: {
    value: dom.window.MutationObserver,
    configurable: true,
  },
  getComputedStyle: {
    value: dom.window.getComputedStyle.bind(dom.window),
    configurable: true,
  },
});

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

type TestingLibrary = typeof import("@testing-library/react");

const respostasPorEndpoint: Record<string, unknown> = {
  "/produtos": [
    {
      id: 1,
      nome: "Camiseta Básica",
      descricao: "Camiseta de algodão",
      preco: 59.9,
      categoria: "Camisetas",
      estoque: 10,
      destaque: true,
      promocao: false,
      criadoEm: "2026-01-01",
    },
  ],
  "/categorias": [
    {
      id: 1,
      categoria: "Camisetas",
      totalProdutos: 1,
    },
  ],
  "/usuarios": [
    {
      id: 1,
      nome: "Maria",
      email: "maria@example.com",
    },
  ],
  "/carrinhos/ultimo": {
    itens: [],
  },
};

let chamadasFetch: string[] = [];
let fetchOriginal: typeof globalThis.fetch;

function criarRespostaJson(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function extrairPath(input: RequestInfo | URL): string {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  return new URL(url, "http://localhost:3001").pathname;
}

function contarChamadas(endpoint: string): number {
  return chamadasFetch.filter((path) => path === endpoint).length;
}

async function importarTestingLibrary(): Promise<TestingLibrary> {
  return import("@testing-library/react");
}

Before(function () {
  chamadasFetch = [];
  fetchOriginal = globalThis.fetch;
  document.body.innerHTML = "";

  globalThis.fetch = async (input: RequestInfo | URL) => {
    const path = extrairPath(input);
    chamadasFetch.push(path);

    if (path in respostasPorEndpoint) {
      return criarRespostaJson(respostasPorEndpoint[path]);
    }

    return criarRespostaJson({ message: "Endpoint não encontrado" }, 404);
  };
});

After(async function () {
  const { cleanup } = await importarTestingLibrary();

  cleanup();
  globalThis.fetch = fetchOriginal;
  document.body.innerHTML = "";
});

AfterAll(function () {
  dom.window.close();
});

Given("a página inicial do e-commerce está carregada", async function () {
  const React = await import("react");
  const { render, screen, waitFor } = await importarTestingLibrary();
  const { default: App } = await import("../../../src/App");

  render(React.createElement(App));

  await screen.findByRole("button", { name: /recarregar/i });

  await waitFor(() => {
    expect(contarChamadas("/produtos")).to.equal(1);
    expect(contarChamadas("/categorias")).to.equal(1);
    expect(contarChamadas("/usuarios")).to.equal(1);
    expect(contarChamadas("/carrinhos/ultimo")).to.equal(1);
  });
});

When("eu clico no botão {string}", async function (rotulo: string) {
  const { act } = await import("react");
  const { fireEvent, screen } = await importarTestingLibrary();

  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: rotulo }));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});

Then("os dados da página inicial devem ser carregados novamente", async function () {
  const { waitFor } = await importarTestingLibrary();

  await waitFor(() => {
    expect(contarChamadas("/produtos")).to.equal(2);
    expect(contarChamadas("/categorias")).to.equal(2);
    expect(contarChamadas("/usuarios")).to.equal(2);
    expect(contarChamadas("/carrinhos/ultimo")).to.equal(2);
  });
});
