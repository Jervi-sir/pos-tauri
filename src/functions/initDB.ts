import SQLite from 'tauri-plugin-sqlite-api'

async function initDB() {
    return await SQLite.open('./database.db');
}

async function createDB() { 
    const db = await initDB();
    try {
      await db.execute(`
        SELECT * FROM products LIMIT 1
      `)
      return console.log('database already exists')
    } catch(e) {
      //create if no exists
      await db.execute(`
      create TABLE if not EXISTS products (
        barcode text NOT NULL UNIQUE,
        name TEXT NOT NULL,
        model text NOT NULL,
        price_original FLOAT NOT NULL,
        price_sale FLOAT NOT NULL,
        quantity_amount INT DEFAULT 0,
        quantity_status varCHar(10) DEFAULT 'outOfStock'
        );
      `) 
      return console.log('database created');
    }
  }

async function dropDB() {
    const db = await initDB();
    await db.execute(`
      drop TABLE if exists products
    `)
    console.log('database dropped');
}


async function closeDB() {
    const db = await initDB();
    await db.close();
    console.log('database is closed');
}



export {
    initDB,
    createDB,
    dropDB,
    closeDB
}

