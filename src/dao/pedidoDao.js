const pool = require('../config/Database');

class PedidoDao {
  async getAll() {
    const res = await pool.query(`
      SELECT * FROM pedido
      ORDER BY id_pedido
    `);

    return res.rows;
  }



 async getVendedorByPedido(idPedido) {
    const res = await pool.query(`
      SELECT DISTINCT e.id_usuario_responsavel
      FROM item_pedido ip
      JOIN produto p ON ip.id_produto = p.id_produto
      JOIN empresa e ON p.id_empresa = e.id_empresa
      WHERE ip.id_pedido = $1
      LIMIT 1
    `, [idPedido]);

    return res.rows[0];
  }



async getById(id) {
    const pedido = await pool.query(`SELECT * FROM pedido WHERE id_pedido = $1`, [id]);

    if (!pedido.rows[0]) return null;

    const itens = await pool.query(`
      SELECT 
        ip.id_item_pedido,
        ip.id_produto,
        p.nome AS produto,
        e.nome_fantasia AS empresa_vendedora,
        e.cidade AS cidade_origem,
        e.estado AS estado_origem,
        ip.quantidade,
        ip.preco_unitario,
        (ip.quantidade * ip.preco_unitario) AS subtotal
      FROM item_pedido ip
      JOIN produto p ON p.id_produto = ip.id_produto
      JOIN empresa e ON p.id_empresa = e.id_empresa
      WHERE ip.id_pedido = $1
    `, [id]);

    const fretes = await pool.query(`
      SELECT id_frete, id_produto, valor, prazo_dias, cidade_origem, estado_origem, status
      FROM frete
      WHERE id_pedido = $1
    `, [id]);

    const itensFormatados = itens.rows.map(item => {
      const freteDoItem = fretes.rows.find(f => f.id_produto === item.id_produto);
      
      return {
        ...item,
        frete: freteDoItem ? {
          id_frete: freteDoItem.id_frete,
          valor: freteDoItem.valor,
          prazo_dias: freteDoItem.prazo_dias,
          status: freteDoItem.status
        } : null
      };
    });

    return {
      ...pedido.rows[0],
      itens: itensFormatados, 
    };
  }

  async create(pedido) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { id_usuario, status = 'REALIZADO', itens, id_afiliacao } = pedido;

      if (!id_usuario) {
        throw new Error('O campo id_usuario é obrigatório');
      }

      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        throw new Error('O pedido precisa ter pelo menos um item');
      }

      let valorTotal = 0;

      for (const item of itens) {
        const produto = await client.query(`
          SELECT id_produto, preco, estoque
          FROM produto
          WHERE id_produto = $1
        `, [item.id_produto]);

        if (!produto.rows[0]) {
          throw new Error(`Produto ${item.id_produto} não encontrado`);
        }

        if (produto.rows[0].estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto ${item.id_produto}`);
        }

        valorTotal += Number(produto.rows[0].preco) * Number(item.quantidade);
      }

      const pedidoCriado = await client.query(`
        INSERT INTO pedido (id_usuario, valor_total, status, data_pedido)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `, [id_usuario, valorTotal, status]);

      const idPedido = pedidoCriado.rows[0].id_pedido;

      for (const item of itens) {
        const produto = await client.query(`
          SELECT preco FROM produto WHERE id_produto = $1
        `, [item.id_produto]);

        const precoUnitario = produto.rows[0].preco;

        await client.query(`
          INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario)
          VALUES ($1, $2, $3, $4)
        `, [idPedido, item.id_produto, item.quantidade, precoUnitario]);

        await client.query(`
          UPDATE produto SET estoque = estoque - $1 WHERE id_produto = $2
        `, [item.quantidade, item.id_produto]);
      }
      if (id_afiliacao) {
       
        const afiliacaoRes = await client.query(`
          SELECT id_produto, percentual_comissao, status 
          FROM afiliacao_produto 
          WHERE id_afiliacao = $1
        `, [id_afiliacao]);

        if (afiliacaoRes.rows.length > 0) {
          const afiliacao = afiliacaoRes.rows[0];

          // Só ganha se a afiliação já estiver APROVADA pelo Vendedor
          if (afiliacao.status === 'APROVADO') {
            
            // Procura nos itens do carrinho se o cliente realmente comprou o produto do afiliado
            let valorVendaAfiliado = 0;
            
            for (const item of itens) {
              if (item.id_produto === afiliacao.id_produto) {
                const produtoAfiliado = await client.query(`SELECT preco FROM produto WHERE id_produto = $1`, [item.id_produto]);
                // Calcula quanto o cliente gastou APENAS no produto indicado
                valorVendaAfiliado += Number(produtoAfiliado.rows[0].preco) * Number(item.quantidade);
              }
            }

            // Se o produto indicado estava no carrinho, cria a comissão!
            if (valorVendaAfiliado > 0) {
              const percentual = Number(afiliacao.percentual_comissao);
              const valorComissao = valorVendaAfiliado * (percentual / 100);

              await client.query(`
                INSERT INTO comissao
                (id_afiliacao, id_pedido, valor_venda, percentual, valor_comissao, status, data_registro)
                VALUES ($1, $2, $3, $4, $5, 'PENDENTE', NOW())
              `, [id_afiliacao, idPedido, valorVendaAfiliado, percentual, valorComissao]);
              
              console.log(`[SISTEMA] Comissão de R$ ${valorComissao} gerada com sucesso para a afiliação ${id_afiliacao}!`);
            }
          }
        }
      }

      await client.query('COMMIT');
      return this.getById(idPedido);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  async update(id, data) {
    const camposPermitidos = ['id_usuario', 'valor_total', 'status'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const key in data) {
      if (camposPermitidos.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualizar');
    }

    values.push(id);

    const res = await pool.query(`
      UPDATE pedido
      SET ${fields.join(', ')}
      WHERE id_pedido = $${i}
      RETURNING *
    `, values);

    return res.rows[0];
  }

  async cancelar(id) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const pedido = await client.query(`
        SELECT *
        FROM pedido
        WHERE id_pedido = $1
      `, [id]);

      if (!pedido.rows[0]) {
        await client.query('ROLLBACK');
        return null;
      }

      if (pedido.rows[0].status === 'CANCELADO') {
        throw new Error('Este pedido já está cancelado');
      }

      const itens = await client.query(`
        SELECT id_produto, quantidade
        FROM item_pedido
        WHERE id_pedido = $1
      `, [id]);

      for (const item of itens.rows) {
        await client.query(`
          UPDATE produto
          SET estoque = estoque + $1
          WHERE id_produto = $2
        `, [
          item.quantidade,
          item.id_produto
        ]);
      }

      const pedidoCancelado = await client.query(`
        UPDATE pedido
        SET status = 'CANCELADO'
        WHERE id_pedido = $1
        RETURNING *
      `, [id]);

      await client.query('COMMIT');

      return pedidoCancelado.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const res = await pool.query(`
      DELETE FROM pedido
      WHERE id_pedido = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }
}

module.exports = new PedidoDao();