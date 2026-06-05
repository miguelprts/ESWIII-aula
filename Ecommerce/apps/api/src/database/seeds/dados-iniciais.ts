import { Carrinho } from "../../model/carrinho";
import { Categoria } from "../../model/categoria";
import { Produto } from "../../model/produto";
import { Usuario } from "../../model/usuario";

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: "Camiseta Básica",
    preco: 59,
    estoque: 20,
    categoria: "Camisetas",
    destaque: true,
    promocao: false,
    novidade: true,
  },
  {
    id: 2,
    nome: "Calça Jeans Slim",
    preco: 149,
    estoque: 5,
    categoria: "Calças",
    destaque: false,
    promocao: true,
    novidade: false,
  },
  {
    id: 3,
    nome: "Jaqueta de Couro",
    preco: 399,
    estoque: 0,
    categoria: "Jaquetas",
    destaque: true,
    promocao: false,
    novidade: false,
  },
  {
    id: 4,
    nome: "Tênis Casual",
    preco: 199,
    estoque: 15,
    categoria: "Calçados",
    destaque: false,
    promocao: true,
    novidade: true,
  },
  {
    id: 5,
    nome: "Bermuda Jeans",
    preco: 89,
    estoque: 8,
    categoria: "Bermudas",
    destaque: false,
    promocao: false,
    novidade: true,
  },
  {
    id: 6,
    nome: "Camisa Social",
    preco: 120,
    estoque: 12,
    categoria: "Camisas",
    destaque: true,
    promocao: false,
    novidade: false,
  },
];

export const categoriasIniciais: Categoria[] = [
  {
    id: 1,
    categoria: "Camisetas",
  },
  {
    id: 2,
    categoria: "Calças",
  },
  {
    id: 3,
    categoria: "Jaquetas",
  },
  {
    id: 4,
    categoria: "Calçados",
  },
  {
    id: 5,
    categoria: "Bermudas",
  },
  {
    id: 6,
    categoria: "Camisas",
  },
];

export const usuariosIniciais: Usuario[] = [
  {
    id: 1,
    nome: "Alice Silva",
    email: "alice.silva@example.com",
  },
  {
    id: 2,
    nome: "Bob Costa",
    email: "bob.costa@example.com",
  },
];

export const carrinhosIniciais: Carrinho[] = [
  {
    itens: [
      {
        id: 1,
        nome: "Camiseta Básica",
        preco: 59,
        estoque: 20,
        categoria: "Camisetas",
        destaque: true,
        promocao: false,
        novidade: true,
        quantidade: 2,
      },
      {
        id: 2,
        nome: "Calça Jeans Slim",
        preco: 149,
        estoque: 5,
        categoria: "Calças",
        destaque: false,
        promocao: true,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
  {
    itens: [
      {
        id: 3,
        nome: "Jaqueta de Couro",
        preco: 399,
        estoque: 0,
        categoria: "Jaquetas",
        destaque: true,
        promocao: false,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
];
