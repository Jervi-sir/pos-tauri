import SQLite from 'tauri-plugin-sqlite-api'

const db = await SQLite.open('./database.db')

async function getCounts() {
    const counts = await db.select<Array<{ count: number }>>('SELECT COUNT(*) as count FROM products')

    return counts;
}

async function updateQtn(item) {
    const row = await this.db.select(
        'UPDATE products SET quantity_amount = (?1) WHERE barcode = (?2)',
        [item.quantity.amount, item.details.barcode]
        )
    return row;
}

async function search(keyword) {
    const key = keyword;
    const rows = await this.db.select(
        "SELECT * FROM products WHERE model LIKE '%" + key + "%' OR name LIKE '%" + key + "%' OR barcode LIKE '%" + key + "%' "
    )
    this.products = [];
    rows.forEach(item => {
        this.products.push(this.putDataInJson(item));
    });
    console.log(rows);
}


/*
const rows = await db.select<Array<{ name: string }>>('SELECT name FROM users WHERE age > ?', [20])
const rows = await db.select<Array<any>>('SELECT * FROM users LIMIT $1 OFFSET $2', [10, 0])
const isClosed = await db.close()
*/

export { getCounts, search, updateQtn }
