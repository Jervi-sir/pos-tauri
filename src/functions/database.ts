import { initDB } from './initDB'

const db = await initDB().finally(() => console.log('database has been called'));

async function countProducts() {
    const count = await db.select<Array<{ count: number }>>(
      'SELECT COUNT(*) as count FROM products'
    )
    return count;
}

async function showAll() {
    const rows = await db.select(
      'SELECT * FROM products'
    )

    return (rows);
}

async function addProduct(item) {
  if(item.quantity > 0) {
    item.status = "inStock"
  }

  try {
    await db.execute(
    'INSERT INTO products VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)', 
      [item.barcode,
        item.name,
        item.model,
        item.price_original,
        item.price_sale,
        item.quantity,
        item.status]
    )
  } catch(err) {
    console.log(err)
  }
}

async function searchDB(key) {
  const rows = await db.select(
    "SELECT * FROM products WHERE model LIKE '%" + key + "%' OR name LIKE '%" + key + "%' OR barcode LIKE '%" + key + "%' "
  )
  return(rows);
}

async function updateQtn(amount, bardcode) {
  const row = await db.select(
      'UPDATE products SET quantity_amount = (?1) WHERE barcode = (?2)',
      [amount, bardcode]
    )
  console.log('updated');
  return row;
}


/*
const rows = await db.select<Array<{ name: string }>>('SELECT name FROM users WHERE age > ?', [20])
const rows = await db.select<Array<any>>('SELECT * FROM users LIMIT $1 OFFSET $2', [10, 0])
const isClosed = await db.close()
*/

export { 
  countProducts,
  showAll,
  addProduct,
  searchDB,
  updateQtn
}
