import { Request, Response } from "express";
import prisma from "../db/prisma";


// ==============================
// LISTAR TODOS OS CARTAZES
// GET /cartazes
// ==============================

export async function listarCartazes(
  req: Request,
  res: Response
) {
  try {
    const cartazes = await prisma.cartaz.findMany({
      orderBy: {
        ordem: "asc"
      }
    });

    res.json(cartazes);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar os cartazes."
    });
  }
}


// ==============================
// BUSCAR CARTAZ POR ID
// GET /cartazes/:id
// ==============================

export async function buscarCartaz(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const cartaz = await prisma.cartaz.findUnique({
      where: {
        id
      }
    });

    if (!cartaz) {
      return res.status(404).json({
        mensagem: "Cartaz não encontrado."
      });
    }

    res.json(cartaz);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar o cartaz."
    });
  }
}


// ==============================
// CRIAR CARTAZ
// POST /cartazes
// ==============================

export async function criarCartaz(
  req: Request,
  res: Response
) {
  try {
    const {
      titulo,
      imagem,
      horarioInicio,
      horarioFim,
      duracao,
      ordem
    } = req.body;

    if (
      !titulo ||
      !imagem ||
      !horarioInicio ||
      !horarioFim ||
      duracao === undefined ||
      ordem === undefined
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios."
      });
    }

    const novoCartaz = await prisma.cartaz.create({
      data: {
        titulo,
        imagem,
        horarioInicio,
        horarioFim,
        duracao: Number(duracao),
        ordem: Number(ordem)
      }
    });

    res.status(201).json(novoCartaz);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar o cartaz."
    });
  }
}


// ==============================
// ATUALIZAR CARTAZ
// PUT /cartazes/:id
// ==============================

export async function atualizarCartaz(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const {
      titulo,
      imagem,
      horarioInicio,
      horarioFim,
      duracao,
      ordem
    } = req.body;

    const cartazExistente = await prisma.cartaz.findUnique({
      where: {
        id
      }
    });

    if (!cartazExistente) {
      return res.status(404).json({
        mensagem: "Cartaz não encontrado."
      });
    }

    const cartazAtualizado = await prisma.cartaz.update({
      where: {
        id
      },

      data: {
        titulo,
        imagem,
        horarioInicio,
        horarioFim,
        duracao:
          duracao !== undefined
            ? Number(duracao)
            : undefined,

        ordem:
          ordem !== undefined
            ? Number(ordem)
            : undefined
      }
    });

    res.json(cartazAtualizado);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar o cartaz."
    });
  }
}


// ==============================
// EXCLUIR CARTAZ
// DELETE /cartazes/:id
// ==============================

export async function deletarCartaz(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensagem: "ID inválido."
      });
    }

    const cartazExistente = await prisma.cartaz.findUnique({
      where: {
        id
      }
    });

    if (!cartazExistente) {
      return res.status(404).json({
        mensagem: "Cartaz não encontrado."
      });
    }

    await prisma.cartaz.delete({
      where: {
        id
      }
    });

    res.json({
      mensagem: "Cartaz excluído com sucesso."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir o cartaz."
    });
  }
}


// ==============================
// CARTAZES ATIVOS PARA AS TVs
// GET /tv/cartazes
// ==============================

export async function listarCartazesAtivos(
  req: Request,
  res: Response
) {
  try {
    const agora = new Date();

    const horarioAtual = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo"
    });

    const cartazes = await prisma.cartaz.findMany({
      where: {
        horarioInicio: {
          lte: horarioAtual
        },

        horarioFim: {
          gt: horarioAtual
        }
      },

      orderBy: {
        ordem: "asc"
      }
    });

    res.json(cartazes);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar cartazes ativos."
    });
  }
}