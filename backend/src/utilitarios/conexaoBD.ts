import {open} from 'sqlite'
import sqlite3 from 'sqlite3';

//conecta ao banco
export const conectarBanco = async () => {
  return open({ 
    filename: './backend/db/app.db',
    driver: sqlite3.Database })
}
//conecta ao banco teste
export const conectarBancoTeste = async () => {
  return open({ 
    filename: './backend/db/teste.db',
    driver: sqlite3.Database })
}