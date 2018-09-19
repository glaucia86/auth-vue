/**
 * Arquivo: app.js
 * Descrição: arquivo responsável por armazenar todos os dados relacionado ao
 *  backend.
 * Data: 19/08/2018
 * Autora: Glaucia Lemos
 */

'use strict'

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const dataBase = require('./db')
const config = require('./config')

// Aqui estou fazendo a chamada da configuração da base de dados: sqlite3
const db = new dataBase('sqlitedb')

// Chamada do Express:
const app = express()

// Variável que lidará com as rotas da aplicação:
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// Aqui vamos definir o middleware para o CORS - para evitar erros com cross origin:
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origins', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')

  next()
}

app.use(allowCrossDomain)

router.post('registrar', (req, res) => {
  db.insert([
    req.body.nome,
    req.body.email,
    bcrypt.hashSync(req.body.senha, 8)
  ],
  (err) => {
    if (err) {
      res.status(500).send('Houve problema ao realizar o registro do usuário.')
    }

    db.selecionarPorEmail(req.body.email, (err, user) => {
      if (err) {
        return res.status(500).send('Houve problema ao retornar um usuário.')
      }

      // Aqui vamos criar uma variável 'token' a qual esse token irá expirar em 24h:
      let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
      res.status(200).send({ auth: true, token: token, user: user })
    })
  })
})
