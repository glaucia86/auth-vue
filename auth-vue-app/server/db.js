/**
 * Arquivo: db.js
 * Descrição: arquivo responsável por tratar a base de dados.
 * Data: 19/08/2018
 * Autora: Glaucia Lemos
 */

'use strict'

const sqlite3 = require('sqlite3').verbose()

class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
    this.createTable()
  }

  // Aqui estamos criando uma tabela para a aplicação:
  createTable () {
    const sql = `
      create table if not exists user (
        id integer primary key,
        name text,
        email text unique
        user_pass text,
        is_admin integer)`
    return this.db.run(sql)
  }

  selectByEmail (email, calllback) {
    return this.db.get(
      `select * from user where = ?`,
      [email], (err, row) => {
        calllback(err, row)
      })
  }

  insertAdmin (user, calllback) {
    return this.db.run(
      `insert into user(name, email, user_pass, is_admin)
       values (?, ?, ?, ?)`,
      user, (err) => {
        calllback(err)
      })
  }

  selectAll (calllback) {
    return this.db.all(
      `select * from user`,
      (err, rows) => {
        calllback(err, rows)
      })
  }

  insert (user, calllback) {
    return this.db.run(
      `insert into user (name, email, user_pass) values (?, ?, ?)`,
      user, (err) => {
        calllback(err)
      })
  }
}

module.exports = Db
