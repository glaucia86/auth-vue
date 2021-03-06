/**
 * Arquivo: app.js
 * Descrição: arquivo responsável por armazenar todos os dados relacionado ao
 *  backend.
 * Data: 19/08/2018
 * Autora: Glaucia Lemos
 */

'use strict'

const express = require('express')
const DB = require('./db')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

// Aqui estou fazendo a chamada da configuração da base de dados: sqlite3
const db = new DB('sqlitedb')

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

// Rota: Register => rota responsável por criar um novo registro do usuário.
// POST: localhost:3000/register
router.post('/register', (req, res) => {
  db.insert([
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8)
  ],
  (err) => {
    if (err) {
      res.status(500).send('Houve um problema ao realizar o registro do usuário.')
    }

    db.selectByEmail(req.body.email, (err, user) => {
      if (err) {
        return res.status(500).send('Houve um problema ao retornar o usuário.')
      }

      // Aqui vamos criar uma variável 'token' a qual esse token irá expirar em 24h:
      let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
      res.status(200).send({ auth: true, token: token, user: user })
    })
  })
})

// Rota: Register => rota responsável por criar um novo registro do usuário como admin.
// POST: localhost:3000/register-admin
router.post('/register-admin', (req, res) => {
  db.insertAdmin([
    req.body.name,
    req.body.email,
    bcrypt.hashSync(req.body.password, 8),
    1
  ],
  (err) => {
    if (err) {
      res.status(500).send('Houve um problema ao realizar o registro do usuário')
    }

    db.selectByEmail(req.body.email, (err, user) => {
      if (err) {
        return res.status(500).send('Houve um problema ao retornar o usuário')
      }

      let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
      res.status(200).send({ auth: true, token: token, user: user })
    })
  })
})

// Rota: Register => rota responsável por retornar um determinado token a ser gerado para o usuário:
// GET: localhost:3000/me
router.get('/me', (req, res) => {
  let token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).send({ auth: false, message: 'Sem envio de token.' })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Falha de autenticação no token.' })
    }
    res.status(200).send(decoded)
  })
})

// Rota: Login => rota responsável por realizar login na página:
// POST:localhost:3000/login
router.post('/login', (req, res) => {
  db.selectByEmail(req.body.email, (err, user) => {
    if (err) {
      return res.status(500).send('Houve um problema no servidor.')
    }
    if (!user) {
      return res.status(404).send('Usuário não encontrado.')
    }

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass)

    if (!passwordIsValid) {
      return res.status(400).send({ auth: false, token: null })
    }

    let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
    res.status(200).send({ auth: true, token: token, user: user })
  })
})

// Enfim, vamos agora iniciar o servidor:
app.use(router)

let port = process.env.PORT || 3000

let server = app.listen(port, () => {
  console.log('Servidor em execução na porta...: ' + port)
})
