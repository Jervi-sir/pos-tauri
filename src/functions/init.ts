import SQLite from 'tauri-plugin-sqlite-api'
export const db = async () => await SQLite.open('./test.db')