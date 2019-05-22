import { Injectable }       from '@angular/core';

@Injectable()
export class ParserUtil {

    constructor() {}

    isXMLFile(file) {
        return file.name.endsWith(".xml");
    }

    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr, tokenDelimeter) {        
        let headers = csvRecordsArr[0].split(tokenDelimeter);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray, tokenDelimeter) {
        var dataArr = [];
        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(tokenDelimeter);
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            dataArr.push(col);
        }
         
        return dataArr;
    }

}