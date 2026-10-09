import { useEffect, useRef, useState } from "react";
import type { TipoProduto } from "../../types/types";
import { Link, useNavigate } from "react-router";
import { CiEdit as Editar } from "react-icons/ci";
import { RiDeleteBin6Line as Excluir } from "react-icons/ri";

export default function Produtos() {
  document.title = "Produtos";

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbztyyl_ACyO-HWCYTJwFfpKIe5BHSCQlEogcLAs2YSPIYU2pLv8muknFzIKqB5y7rZ9IQ/exec";

  //REF do DIALOG para o produto que será deletado:
  const dialogRef = useRef<HTMLDialogElement>(null);
  //STATE do DIALOG para o produto que será deletado:
  const [idExclusivo, setIdExclusivo] = useState<string>("");

  //Abrir modal
  const abrirModal = (id: string) => {
    setIdExclusivo(id);
    dialogRef.current?.showModal();
  }

  //Criando o redirecionador
  const navigate = useNavigate();

  //Estrutua que vai receber a lista, seja ela mocada ou externa!
  const [produtos, setProdutos] = useState<TipoProduto[]>([]);


  useEffect(() => {

    //Função para carregar os dados
    const carregaProdutos = async () => {
      try {

        //const response = await fetch("http://localhost:3001/produtos");
        const response = await fetch(WEB_APP_URL);
        if (!response.ok) {
          throw new Error(`Falha na requisição dos produtos... ${response.status} - ${response.statusText}`);
        }

        /*const data: TipoProduto[] = await response.json();
        console.log(data);*/

        const data:any[][] = await response.json();
        const prod = data.slice(1).map((p)=>({
          id:p[0],
          nome:p[1],
          preco:p[2],
          estoque:p[3],
          avatar:p[4],
        }))

        setProdutos(prod); //Atualizando a lista de produtos
        //setProdutos(data); //Atualizando a lista de produtos

      } catch (error) {
        console.error(error);
      }
    }

    carregaProdutos();

  }, []);

  const handleDelete = async () => {
    try {

      const response = await fetch(`http://localhost:3001/produtos/${idExclusivo}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Falha na exclusão dos produtos... ${response.status} - ${response.statusText}`);
      }
      alert("Produto excluído com sucesso!");
      navigate("/"); //Redirecionando para a página inicial

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <h2>Produtos</h2>

      <dialog ref={dialogRef} style={{ padding: "20px", borderRadius: "8px", border: "1px solid #ccc" }}>
        <h3>Confirmar Exclusão de Produto</h3>
        <p>Tem certeza que deseja excluir este produto?</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "15px" }}>
          <button onClick={() => dialogRef.current?.close()}>Cancelar</button>
          <button onClick={() => handleDelete()} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Excluir</button>
        </div>

      </dialog>

      <table border={1} style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NOME</th>
            <th>PREÇO</th>
            <th>AVATAR</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.preco}</td>
              <td><img src={p.avatar} alt={p.nome} width={30} /></td>
              <td>
                <Link to={`/editar-produtos/${p.id}`}><Editar /></Link> |
                <Excluir style={{ cursor: "pointer" }} onClick={() => abrirModal(p.id)} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Quantidade de produtos : {produtos.length}</td>
          </tr>
        </tfoot>
      </table>
    </main>
  );
}