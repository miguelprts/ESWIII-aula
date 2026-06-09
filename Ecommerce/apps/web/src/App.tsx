import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Minus,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import {
  buscarCarrinhoAtual,
  listarCategorias,
  listarProdutos,
  listarUsuarios,
  salvarCarrinhoAtual,
} from "./api";
import { Carrinho, Categoria, Produto, Usuario } from "./model";
import "./App.css";

const imagensPorProduto: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  2: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
  3: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
  4: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  5: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
  6: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
};

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carrinho, setCarrinho] = useState<Carrinho>({ itens: [] });
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
  const [busca, setBusca] = useState("");
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvandoCarrinho, setSalvandoCarrinho] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarDados(): Promise<void> {
    setCarregando(true);
    setErro(null);

    try {
      const [
        produtosDaApi,
        categoriasDaApi,
        usuariosDaApi,
        carrinhoDaApi,
      ] = await Promise.all([
        listarProdutos(),
        listarCategorias(),
        listarUsuarios(),
        buscarCarrinhoAtual(),
      ]);

      setProdutos(produtosDaApi);
      setCategorias(categoriasDaApi);
      setUsuarios(usuariosDaApi);
      setCarrinho(carrinhoDaApi);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os dados da API.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function persistirCarrinho(novoCarrinho: Carrinho): Promise<void> {
    setCarrinho(novoCarrinho);
    setSalvandoCarrinho(true);
    setErro(null);

    try {
      const carrinhoSalvo = await salvarCarrinhoAtual(novoCarrinho);
      setCarrinho(carrinhoSalvo);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar o carrinho.",
      );
    } finally {
      setSalvandoCarrinho(false);
    }
  }

  function adicionarProduto(produto: Produto): void {
    if (produto.estoque <= 0) {
      return;
    }

    const itemExistente = carrinho.itens.find((item) => item.id === produto.id);
    const itens = itemExistente
      ? carrinho.itens.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: Math.min(item.quantidade + 1, item.estoque),
              }
            : item,
        )
      : [...carrinho.itens, { ...produto, quantidade: 1 }];

    void persistirCarrinho({ itens });
  }

  function alterarQuantidade(produtoId: number, quantidade: number): void {
    const itens = carrinho.itens
      .map((item) => {
        if (item.id !== produtoId) {
          return item;
        }

        return {
          ...item,
          quantidade: Math.max(1, Math.min(quantidade, item.estoque)),
        };
      })
      .filter((item) => item.quantidade > 0);

    void persistirCarrinho({ itens });
  }

  function removerProduto(produtoId: number): void {
    const itens = carrinho.itens.filter((item) => item.id !== produtoId);

    void persistirCarrinho({ itens });
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const combinaCategoria =
        categoriaSelecionada === "todas" ||
        produto.categoria === categoriaSelecionada;
      const combinaBusca = produto.nome
        .toLowerCase()
        .includes(busca.trim().toLowerCase());
      const combinaDisponibilidade =
        !apenasDisponiveis || produto.estoque > 0;

      return combinaCategoria && combinaBusca && combinaDisponibilidade;
    });
  }, [apenasDisponiveis, busca, categoriaSelecionada, produtos]);

  const totalDisponivel = produtos.filter((produto) => produto.estoque > 0).length;
  const totalPromocoes = produtos.filter((produto) => produto.promocao).length;
  const quantidadeCarrinho = carrinho.itens.reduce(
    (total, item) => total + item.quantidade,
    0,
  );
  const totalCarrinho = carrinho.itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0,
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Catalogo do e-commerce</h1>
        </div>
        {/* <button
          className="refresh-button"
          type="button"
          onClick={() => void carregarDados()}
          title="Recarregar dados da API"
        >
          <RefreshCcw size={18} aria-hidden="true" />
          <span>Recarregar</span>
        </button> */}
      </header>

      <section className="summary-grid" aria-label="Resumo do catalogo">
        <article className="summary-card">
          <ShoppingBag size={22} aria-hidden="true" />
          <div>
            <strong>{produtos.length}</strong>
            <span>produtos</span>
          </div>
        </article>
        <article className="summary-card">
          <PackageCheck size={22} aria-hidden="true" />
          <div>
            <strong>{totalDisponivel}</strong>
            <span>em estoque</span>
          </div>
        </article>
        <article className="summary-card">
          <Tag size={22} aria-hidden="true" />
          <div>
            <strong>{totalPromocoes}</strong>
            <span>promocoes</span>
          </div>
        </article>
        <article className="summary-card">
          <Users size={22} aria-hidden="true" />
          <div>
            <strong>{usuarios.length}</strong>
            <span>usuarios</span>
          </div>
        </article>
      </section>

      <section className="filters" aria-label="Filtros do catalogo">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar produto"
          />
        </label>

        <label className="select-field">
          <span>Categoria</span>
          <select
            value={categoriaSelecionada}
            onChange={(event) => setCategoriaSelecionada(event.target.value)}
          >
            <option value="todas">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.categoria}>
                {categoria.categoria}
              </option>
            ))}
          </select>
        </label>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={apenasDisponiveis}
            onChange={(event) => setApenasDisponiveis(event.target.checked)}
          />
          <span>Somente produtos em estoque</span>
        </label>
      </section>

      {erro && (
        <section className="error-box" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          <span>{erro}</span>
        </section>
      )}

      <div className="catalog-layout">
        <section className="product-grid" aria-label="Produtos">
          {carregando ? (
            <p className="status-message">Carregando produtos...</p>
          ) : produtosFiltrados.length === 0 ? (
            <p className="status-message">Nenhum produto encontrado.</p>
          ) : (
            produtosFiltrados.map((produto) => {
              const estaNoCarrinho = carrinho.itens.some(
                (item) => item.id === produto.id,
              );

              return (
                <article className="product-card" key={produto.id}>
                  <img
                    src={imagensPorProduto[produto.id]}
                    alt={produto.nome}
                    className="product-image"
                    loading="lazy"
                  />
                  <div className="product-content">
                    <div>
                      <p className="category-label">{produto.categoria}</p>
                      <h2>{produto.nome}</h2>
                    </div>
                    <p className="price">{formatarMoeda(produto.preco)}</p>
                    <div className="product-footer">
                      <span
                        className={
                          produto.estoque > 0
                            ? "stock available"
                            : "stock empty"
                        }
                      >
                        {produto.estoque > 0
                          ? `${produto.estoque} em estoque`
                          : "sem estoque"}
                      </span>
                      <div className="badges" aria-label="Marcadores do produto">
                        {produto.destaque && <span>Destaque</span>}
                        {produto.promocao && <span>Promocao</span>}
                        {produto.novidade && <span>Novidade</span>}
                      </div>
                    </div>
                    <button
                      className="add-button"
                      type="button"
                      onClick={() => adicionarProduto(produto)}
                      disabled={produto.estoque <= 0}
                    >
                      <Plus size={18} aria-hidden="true" />
                      <span>
                        {produto.estoque <= 0
                          ? "Indisponivel"
                          : estaNoCarrinho
                            ? "Adicionar mais"
                            : "Adicionar"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="cart-panel" aria-label="Carrinho">
          <div className="cart-header">
            <div>
              <p className="contexto">Carrinho</p>
              <h2>{quantidadeCarrinho} itens</h2>
            </div>
            <span>{salvandoCarrinho ? "salvando" : "sincronizado"}</span>
          </div>

          {carrinho.itens.length === 0 ? (
            <p className="empty-cart">Nenhum produto no carrinho.</p>
          ) : (
            <div className="cart-items">
              {carrinho.itens.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-main">
                    <strong>{item.nome}</strong>
                    <span>{formatarMoeda(item.preco)}</span>
                  </div>
                  <div className="quantity-row">
                    <button
                      type="button"
                      onClick={() =>
                        alterarQuantidade(item.id, item.quantidade - 1)
                      }
                      title="Diminuir quantidade"
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.estoque}
                      value={item.quantidade}
                      onChange={(event) =>
                        alterarQuantidade(
                          item.id,
                          Number(event.target.value) || 1,
                        )
                      }
                      aria-label={`Quantidade de ${item.nome}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        alterarQuantidade(item.id, item.quantidade + 1)
                      }
                      title="Aumentar quantidade"
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                    <button
                      className="remove-button"
                      type="button"
                      onClick={() => removerProduto(item.id)}
                      title="Remover produto"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="cart-total">
            <span>Total</span>
            <strong>{formatarMoeda(totalCarrinho)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default App;
