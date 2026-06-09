import { Carrinho, Categoria, Produto, Usuario } from "./model";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function postJson<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export function listarProdutos(): Promise<Produto[]> {
  return getJson<Produto[]>("/produtos");
}

export function listarCategorias(): Promise<Categoria[]> {
  return getJson<Categoria[]>("/categorias");
}

export function listarUsuarios(): Promise<Usuario[]> {
  return getJson<Usuario[]>("/usuarios");
}

export function buscarCarrinhoAtual(): Promise<Carrinho> {
  return getJson<Carrinho>("/carrinhos/ultimo");
}

export function salvarCarrinhoAtual(carrinho: Carrinho): Promise<Carrinho> {
  return postJson<Carrinho, Carrinho>("/carrinhos/ultimo", carrinho);
}
