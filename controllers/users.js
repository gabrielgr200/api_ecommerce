const express = require('express');
const router = express.Router();
const db = require('./../db/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

router.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


router.post("/register", async (req, res) => {
  const dados = req.body;

  try {
    const existingUserByName = await db.cadastro.findOne({ where: { name: dados.name } });
    if (existingUserByName) {
      return res.status(400).json({
        mensagem: "Nome de usuário já existe",
      });
    }

    const existingUserByEmail = await db.cadastro.findOne({ where: { email: dados.email } });
    if (existingUserByEmail) {
      return res.status(400).json({
        mensagem: "Email já está em uso",
      });
    }

    const hashedPassword = bcrypt.hashSync(dados.password, 10);
    dados.password = hashedPassword;

    const dadosUsuario = await db.cadastro.create(dados);

    return res.json({
      mensagem: "Usuário cadastrado com sucesso",
      dadosUsuario,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      mensagem: "Usuário não foi cadastrado"
    });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    let user;

    if (identifier.includes('@')) {
      user = await db.cadastro.findOne({ where: { email: identifier } });
    } else {
      user = await db.cadastro.findOne({ where: { name: identifier } });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        mensagem: "Credenciais inválidas"
      });
    }

    const token = jwt.sign({ userId: user.id }, '8a2b1f8c4e7d5a0c3b6e9d7a2f4c#@$jhladmdfchvvsjhdf97849i363gdb334+!@$', { expiresIn: '7d' });

    return res.json({
      mensagem: "Login bem-sucedido",
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao efetuar login"
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, '8a2b1f8c4e7d5a0c3b6e9d7a2f4c#@$jhladmdfchvvsjhdf97849i363gdb334+!@$');

      const user = await db.cadastro.findOne({
        where: { id: decodedToken.userId },
        attributes: ['id', 'name', 'email']
      });

      if (!user) {
        return res.status(404).json({
          mensagem: "Usuário não encontrado"
        });
      }

      return res.json({
        user
      });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          mensagem: "Token expirado. Faça o login novamente."
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          mensagem: "Token inválido"
        });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao buscar usuário"
    });
  }
});


router.post("/comentarios", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, '8a2b1f8c4e7d5a0c3b6e9d7a2f4c#@$jhladmdfchvvsjhdf97849i363gdb334+!@$');

      const user = await db.cadastro.findOne({
        where: { id: decodedToken.userId },
        attributes: ['id', 'name', 'email']
      });

      if (!user) {
        return res.status(404).json({
          mensagem: "Usuário não encontrado"
        });
      }

      const { comment, validation } = req.body;

      const novoComentario = await db.comments.create({
        comment,
        userId: user.id,
        validation,
      });

      return res.json({
        mensagem: "Comentário salvo com sucesso",
        comentario: novoComentario
      });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          mensagem: "Token expirado. Faça o login novamente."
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          mensagem: "Token inválido"
        });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao salvar o comentário"
    });
  }
});

router.get("/listar-comentarios", async (req, res) => {
  try {
    const comentarios = await db.comments.findAll({
      attributes: ['comment', 'validation'],
      include: {
        model: db.cadastro,
        attributes: ['name']
      },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      comentarios
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao listar os comentários"
    });
  }
});


router.put("/user/name", async (req, res) => {
  const { currentUsername, newUsername } = req.body;

  try {
    const user = await db.cadastro.findOne({ where: { name: currentUsername } });

    if (!user) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    user.name = newUsername;

    await user.save();

    return res.json({
      mensagem: "Nome de usuário atualizado com sucesso"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao atualizar o nome de usuário"
    });
  }
});


router.put("/user/email", async (req, res) => {
  const { currentEmail, newEmail } = req.body;

  try {
    const user = await db.cadastro.findOne({ where: { email: currentEmail } });

    if (!user) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    user.email = newEmail;

    await user.save();

    return res.json({
      mensagem: "Email do usuário atualizado com sucesso"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao atualizar o email do usuário"
    });
  }
});


// router.put("/user/password", async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   try {
//     const user = await db.cadastro.findOne({ where: { password: currentPassword } });

//     if (!user) {
//       return res.status(404).json({
//         mensagem: "Senha atual incorreta"
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

//     if (!isPasswordValid) {
//       return res.status(404).json({
//         mensagem: "Senha atual incorreta"
//       });
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedNewPassword;

//     await user.save();

//     return res.json({
//       mensagem: "Senha atualizada com sucesso"
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       mensagem: "Erro ao atualizar a senha"
//     });
//   }
// });



router.delete("/user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, '8a2b1f8c4e7d5a0c3b6e9d7a2f4c#@$jhladmdfchvvsjhdf97849i363gdb334+!@$');

    const user = await db.cadastro.findOne({
      where: { id: decodedToken.userId },
    });

    if (!user) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    await user.destroy();

    return res.json({
      mensagem: "Conta do usuário excluída com sucesso"
    });
  } catch (err) {
    console.error(err);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        mensagem: "Token inválido"
      });
    }
    return res.status(500).json({
      mensagem: "Erro ao excluir a conta do usuário"
    });
  }
});

module.exports = router;