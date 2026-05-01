const ExcelJS = require('exceljs');

async function inspect() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('sqlScriptsAndData/models.xlsx');
    
    const sheet = workbook.worksheets[0];
    console.log('Sheet name:', sheet.name);
    console.log('Row count:', sheet.rowCount);
    console.log('Column count:', sheet.columnCount);
    console.log('---');
    
    // Column widths
    console.log('Column widths:');
    for (let i = 1; i <= sheet.columnCount; i++) {
        const col = sheet.getColumn(i);
        console.log(`  Col ${i}: width=${col.width}`);
    }
    console.log('---');
    
    // Row heights and data
    for (let r = 1; r <= Math.min(sheet.rowCount, 15); r++) {
        const row = sheet.getRow(r);
        console.log(`Row ${r} (height=${row.height}):`);
        for (let c = 1; c <= sheet.columnCount; c++) {
            const cell = row.getCell(c);
            const fill = cell.fill ? JSON.stringify(cell.fill) : 'none';
            const font = cell.font ? JSON.stringify(cell.font) : 'none';
            const alignment = cell.alignment ? JSON.stringify(cell.alignment) : 'none';
            const border = cell.border ? JSON.stringify(cell.border) : 'none';
            console.log(`  [${r},${c}] value="${cell.value}" font=${font} fill=${fill} alignment=${alignment} border=${border}`);
        }
    }
    
    // Merged cells
    console.log('---');
    console.log('Merged cells:', JSON.stringify(sheet._merges));
    
    // All sheet names
    console.log('---');
    console.log('All sheets:', workbook.worksheets.map(s => s.name));
}

inspect().catch(console.error);
