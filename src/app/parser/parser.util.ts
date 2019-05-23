import { Injectable }       from '@angular/core';

@Injectable()
export class ParserUtil {

    constructor() {}

    isFileExtXml(file) {
        return file.name.endsWith(".xml");
    }

    isFileExtCsv(file) {
        return file.name.endsWith(".csv");
    }

    getHeaderArr(recArr, delimeter) {        
        let headers = recArr[0].split(delimeter);
        let headerArr = [];
        for (let j = 0; j < headers.length; j++) {
            headerArr.push(headers[j]);
        }
        return headerArr;
    }

    getRecordsArrFrmCsvFile(csvRecordsArray, delimeter) {
        var dataArr = [];
        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(delimeter);
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            dataArr.push(col);
        }
         
        return dataArr;
    }

}