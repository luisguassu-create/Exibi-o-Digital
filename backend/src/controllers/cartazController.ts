import { Request, Response } from "express";
import prisma from "../db/prisma";

// GET /cartazes
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


// GET /cartazes/:id
export async function buscarCartazPorId(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
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


// POST /cartazes
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

    // Validação dos campos obrigatórios
    if (
      !titulo ||
      !imagem ||
      !horarioInicio ||
      !horarioFim ||
      !duracao ||
      !ordem
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios."
      });
    }

    if (horarioInicio >= horarioFim) {
      return res.status(400).json({
        mensagem: "O horário de início deve ser menor que o horário de fim."
      });
    }

    if (Number(duracao) < 1) {
      return res.status(400).json({
        mensagem: "A duração deve ser maior que 0."
      });
    }

    if (Number(ordem) < 1) {
      return res.status(400).json({
        mensagem: "A ordem deve ser maior que 0."
      });
    }

    // Verifica se já existe outro cartaz com essa ordem
    const ordemExistente = await prisma.cartaz.findFirst({
      where: {
        ordem: Number(ordem)
      }
    });

    if (ordemExistente) {
      return res.status(409).json({
        mensagem: "Já existe um cartaz utilizando esta ordem."
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


// PUT /cartazes/:id
export async function atualizarCartaz(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
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
      !duracao ||
      !ordem
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios."
      });
    }

    if (horarioInicio >= horarioFim) {
      return res.status(400).json({
        mensagem: "O horário de início deve ser menor que o horário de fim."
      });
    }

    if (Number(duracao) < 1) {
      return res.status(400).json({
        mensagem: "A duração deve ser maior que 0."
      });
    }

    if (Number(ordem) < 1) {
      return res.status(400).json({
        mensagem: "A ordem deve ser maior que 0."
      });
    }

    // Procura outro cartaz usando essa ordem
    const ordemExistente = await prisma.cartaz.findFirst({
      where: {
        ordem: Number(ordem),
        NOT: {
          id
        }
      }
    });

    if (ordemExistente) {
      return res.status(409).json({
        mensagem: "Já existe outro cartaz utilizando esta ordem."
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
        duracao: Number(duracao),
        ordem: Number(ordem)
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


// DELETE /cartazes/:id
export async function deletarCartaz(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
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

    await prisma.cartaz.delete({
      where: {
        id
      }
    });

    res.json({
      mensagem: "Cartaz deletado com sucesso."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao deletar o cartaz."
    });
  }
}

// GET /tv/cartazes
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
      mensagem: "Erro ao buscar os cartazes ativos."
    });
  }
}