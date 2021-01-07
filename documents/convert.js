/**
 * 转换eqp amplr model
 */

let convert = require('./xlsToJs');

convert('./itemlist.xls', '../assets/Script/ItemInfo.ts', 'itemInfo', 'itemInfos', 'ItemInfo', data => {
    let jsonLIst = [];
    for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
        const rowData = data[rowIdx];

        console.log('>>> ', rowData[0]);

        let id = rowData[0];
        let name = rowData[1];
        let sort = Number(rowData[2]);
        let price = Number(rowData[3]);
        let imgName = rowData[0];

        let baseData = {
            id,
            sort,
            name,
            price,
            imgName
        };

        jsonLIst.push(baseData);
    }

    return jsonLIst;
});
