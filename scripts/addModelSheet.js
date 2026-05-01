const ExcelJS = require('exceljs');

async function addSheet() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('sqlScriptsAndData/models.xlsx');

    // Check if sheet already exists
    const sheetName = 'data_suppliers';
    if (workbook.getWorksheet(sheetName)) {
        console.log(`Sheet "${sheetName}" already exists. Skipping.`);
        return;
    }

    // Get template sheet (first one)
    const template = workbook.worksheets[0];

    // Define columns from the Data_supplier Sequelize model
    const columns = [
        { name: 'id', type: 'INT', auto: true, pk: true, allowNull: false },
        { name: 'supplier', type: 'VARCHAR(255)', allowNull: false },
        { name: 'business_name', type: 'VARCHAR(255)', allowNull: false },
        { name: 'address', type: 'VARCHAR(255)', allowNull: false },
        { name: 'country', type: 'VARCHAR(255)', allowNull: false },
        { name: 'id_currencies', type: 'INT', allowNull: false, fk: 'data_currencies(id)' },
        { name: 'cost_calculation', type: 'VARCHAR(255)', allowNull: false },
    ];

    // Associations
    const associations = [
        'belongsTo: Data_currencies (as: currency_data, FK: id_currencies)',
        'hasMany: Data_factors_volume (as: factors_volume, FK: id_suppliers)',
        'hasMany: Data_factors_coeficient (as: factors_coeficient, FK: id_suppliers)',
    ];

    // Create new sheet
    const newSheet = workbook.addWorksheet(sheetName);

    // Copy column widths from template
    for (let i = 1; i <= template.columnCount; i++) {
        const templateCol = template.getColumn(i);
        const newCol = newSheet.getColumn(i);
        newCol.width = templateCol.width;
    }

    // Styles from template
    const headerFill = {
        type: 'pattern', pattern: 'solid',
        fgColor: { theme: 8, tint: 0.7999816888943144 },
        bgColor: { indexed: 64 }
    };
    const devFill = {
        type: 'pattern', pattern: 'solid',
        fgColor: { theme: 7, tint: 0.7999816888943144 },
        bgColor: { indexed: 64 }
    };
    const defaultFont = { size: 11, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' };
    const boldFont = { ...defaultFont, bold: true };
    const codeFont = { size: 9, color: { theme: 1 }, name: 'Arial', family: 2 };
    const centerAlign = { horizontal: 'center', vertical: 'middle' };
    const leftAlign = { horizontal: 'left', vertical: 'middle' };
    const thinBorder = {
        left: { style: 'thin', color: { indexed: 64 } },
        right: { style: 'thin', color: { indexed: 64 } },
        top: { style: 'thin', color: { indexed: 64 } },
    };
    const fullBorder = {
        ...thinBorder,
        bottom: { style: 'thin', color: { indexed: 64 } },
    };

    // Row 1: DESARROLLO / Produ headers (K1, L1)
    const row1 = newSheet.getRow(1);
    const cellK1 = row1.getCell(11);
    cellK1.value = 'DESARROLLO';
    cellK1.font = boldFont;
    cellK1.fill = devFill;
    cellK1.alignment = centerAlign;
    const cellL1 = row1.getCell(12);
    cellL1.value = 'Produ';
    cellL1.font = boldFont;
    cellL1.fill = devFill;
    cellL1.alignment = centerAlign;

    // Row 2: DB names (K2, L2)
    const row2 = newSheet.getRow(2);
    const cellK2 = row2.getCell(11);
    cellK2.value = 'multibrand_db';
    cellK2.font = boldFont;
    cellK2.fill = devFill;
    cellK2.alignment = centerAlign;
    const cellL2 = row2.getCell(12);
    cellL2.value = 'elvientoblanco_db';
    cellL2.font = boldFont;
    cellL2.fill = devFill;
    cellL2.alignment = centerAlign;

    // Row 3: Column headers (B=id, C-G=columns)
    const row3 = newSheet.getRow(3);
    // B3 = "id"
    const headerNames = columns.map(c => c.name);
    for (let i = 0; i < headerNames.length; i++) {
        const cell = row3.getCell(i + 2); // starts at col B (2)
        cell.value = headerNames[i];
        cell.font = defaultFont;
        cell.fill = headerFill;
        cell.alignment = centerAlign;
        cell.border = thinBorder;
    }

    // Row 3 K,L: code area
    const cellK3 = row3.getCell(11);
    cellK3.fill = devFill;
    cellK3.font = codeFont;
    const cellL3 = row3.getCell(12);
    cellL3.fill = devFill;
    cellL3.font = codeFont;

    // Data rows (4 onwards) - add type info row and sample data
    // Row 4: types
    const row4 = newSheet.getRow(4);
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const cell = row4.getCell(i + 2);
        let typeStr = col.type;
        if (col.pk) typeStr += ' PK AI';
        if (!col.allowNull) typeStr += ' NOT NULL';
        if (col.fk) typeStr += ` FK→${col.fk}`;
        cell.value = typeStr;
        cell.font = defaultFont;
        cell.fill = headerFill;
        cell.alignment = centerAlign;
        cell.border = fullBorder;
    }

    // Row 4 col I: table_name
    row4.getCell(9).value = sheetName;
    row4.getCell(9).font = defaultFont;
    row4.getCell(9).fill = headerFill;
    row4.getCell(9).alignment = centerAlign;

    // Row 4 col J: associations
    row4.getCell(10).value = associations.join('\n');
    row4.getCell(10).font = defaultFont;
    row4.getCell(10).fill = headerFill;
    row4.getCell(10).alignment = { ...leftAlign, wrapText: true };

    // K4, L4: dev/prod code placeholders
    row4.getCell(11).fill = devFill;
    row4.getCell(11).font = defaultFont;
    row4.getCell(12).fill = devFill;
    row4.getCell(12).font = defaultFont;

    // Sample data rows (5-10) with placeholder values
    const sampleData = [
        [null, '1', 'Supplier A', 'Business A', 'Address 1', 'Country 1', '1', 'volume'],
        [null, '2', 'Supplier B', 'Business B', 'Address 2', 'Country 2', '1', 'coeficient'],
    ];

    for (let r = 0; r < sampleData.length; r++) {
        const row = newSheet.getRow(5 + r);
        for (let i = 0; i < columns.length; i++) {
            const cell = row.getCell(i + 2);
            cell.value = sampleData[r][i + 1] || '';
            cell.font = defaultFont;
            cell.fill = headerFill;
            cell.alignment = centerAlign;
            cell.border = fullBorder;
        }
        // I col: table_name
        row.getCell(9).value = sheetName;
        row.getCell(9).font = defaultFont;
        row.getCell(9).fill = headerFill;
        row.getCell(9).alignment = centerAlign;

        // K, L
        row.getCell(11).fill = devFill;
        row.getCell(11).font = defaultFont;
        row.getCell(12).fill = devFill;
        row.getCell(12).font = defaultFont;
    }

    await workbook.xlsx.writeFile('sqlScriptsAndData/models.xlsx');
    console.log(`Sheet "${sheetName}" created successfully!`);
}

addSheet().catch(console.error);
