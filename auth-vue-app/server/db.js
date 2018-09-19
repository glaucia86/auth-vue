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

  createTable() {
    const sql = ``  
  }
}
