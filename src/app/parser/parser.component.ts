import { Component, OnInit, ViewChild } from "@angular/core";
import { ParserUtil } from './parser.util';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements OnInit {
  
  @ViewChild('fileLoadInput')
  fileLoadInput: any;
  dataRecords = [];
  dataRows = [];
  csvWriteDataRpt;
  headersRow = [];
  dataWithoutHeader = []
  displayUserInfo: boolean = true;
  supportedFileFormat: boolean = true;
  modalTitle: string = "";
  modalBody: string = "";
  arrFrmXml:string | ArrayBuffer = "";
  successProcess: boolean = false;
  failureProcess: boolean = false;
  processBtn: boolean = false;

  constructor(private parseUtil: ParserUtil, private ngxXml2jsonService: NgxXml2jsonService ) {
  }

  ngOnInit() {}

  fileChangeListener($event): void {
    this.displayUserInfo = false;
    const files = $event.target.files || $event.srcElement.files;   
    if (this.parseUtil.isFileExtCsv(files[0])) {
      this.parseCsv($event);
      this.supportedFileFormat = true;
      this.successProcess = false;
      this.failureProcess = false;
    } else if (this.parseUtil.isFileExtXml(files[0])) {
      this.parseXml($event);
      this.supportedFileFormat = true;
      this.successProcess = false;
      this.failureProcess = false;
    } else{
      this.supportedFileFormat = false;
    }  
  }

  parseCsv($event){
    this.processBtn = true;
    const input = $event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = () => {
      let csvData = (reader.result).toString();
      let csvRecordsArray = csvData.split(/\r\n|\n/);
      this.headersRow = this.parseUtil.getHeaderArr(csvRecordsArray, ','); 
      
      this.dataRecords = this.parseUtil.getRecordsArrFrmCsvFile(csvRecordsArray, ',');
      this.dataRecords.pop();
      this.dataWithoutHeader = this.dataRecords.slice();
      this.dataWithoutHeader.shift();
      if(this.dataRecords == null){
        this.fileReset();
      }    
    }

    reader.onerror = () => {
      alert('Unable to read ' + input.files[0]);
    };
  }

  parseXml($event) {
    this.processBtn = true;
    let input = $event.target;
    let obj;
    let manipulatedCsvObj;
    let manipulatedCsvArray = [];
    for (let index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            this.arrFrmXml = reader.result;
            const parser = new DOMParser();
            const xml = parser.parseFromString(this.arrFrmXml.toString(), 'text/xml');
            obj = this.ngxXml2jsonService.xmlToJson(xml);
            obj.records.record.forEach(element => {
              manipulatedCsvObj = {
                "Reference": element["@attributes"].reference,
                "Account Number": element.accountNumber,
                "Description": element.description,
                "Start Balance": element.startBalance,
                "Mutation": element.mutation,
                "End Balance": element.endBalance
              }
              manipulatedCsvArray.push(manipulatedCsvObj);
            });

            this.dataWithoutHeader = manipulatedCsvArray.map( Object.values );
            if(this.headersRow.length === 0){
              for(let key in manipulatedCsvArray[0]){
                this.headersRow.push(key);                        
              }
            }
            this.dataRecords = [this.headersRow, ...this.dataWithoutHeader];        
        }
        reader.readAsText(input.files[index]);
    };   
   
    if(this.dataRecords == null){
      this.fileReset();
    }
  }

  fileReset(){
    this.fileLoadInput.nativeElement.value = "";
    this.supportedFileFormat = true;
    this.displayUserInfo = true;
    this.dataRecords= [];
    this.headersRow= [];
    this.dataRows= []; 
    this.csvWriteDataRpt= [];
    this.dataWithoutHeader = [];
    this.successProcess = false;
    this.failureProcess = false;
    this.processBtn = false;
  }

  fileProcess(){ 
    const failedArr1 = [];
    const failedArr2 = [];
    for(let i=1; i < this.dataRecords.length; i++){
      let arr = this.dataRecords[i];
      let endVal;
      let endBal = Number(arr[arr.length-1]);
      let mutation = Number(arr[arr.length-2]);
      let startBal = Number(arr[arr.length-3]);
      endVal = startBal + mutation;
      endVal = (Math.round(endVal * 100) / 100);
      if(endBal != endVal){
        failedArr1.push(arr);        
      }  
    }

    for(let i=0; i < this.dataRecords.length; i++){
      let arr1 = this.dataRecords[i];
      if (i==0){
        failedArr2.push(arr1);
        continue;
      }       
        
      for(let j=0; j<this.dataRecords.length; j++){
        if(i==j || j==0){
          continue;
        }
        let arr2 = this.dataRecords[j];
        
        if(arr1[0] === arr2[0]){
          failedArr2.push(arr1);
          break;        
        }  
      }
    }
    const failedArrays = failedArr2.concat(failedArr1);
    const filteredFailedArrays = failedArrays.filter(function (item, pos) {return failedArrays.indexOf(item) == pos});

    if(filteredFailedArrays.length > 1){
      this.failureProcess = true;
      this.dataWithoutHeader = filteredFailedArrays.slice();
      this.dataWithoutHeader.shift();
      this.dataRows = [];
      filteredFailedArrays.forEach(el => {
        this.dataRows.push(el.join(','));
      });
      this.downloadRpt(this.dataRows.join('\n'));
      this.failureProcess = true;
      this.modalTitle = "Info: Process Failure";
      this.modalBody = "File process failed. There are few records in the file which either does not have unique Reference or End balance is not calculated properly. Please check the report (FailedRecordsReport.csv).";
    }
    else{
      this.successProcess = true;
      this.modalTitle = "Info: Process Success";
      this.modalBody = "File processed successfully. No failed records found.";
    }
    this.processBtn = false;
  }

  downloadRpt(data){
    this.csvWriteDataRpt = data.slice();
    let today = new Date();
    let date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    let time = `${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
    let dateTime = `${date}_${time}`;
    const blob = new Blob([this.csvWriteDataRpt], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `FailedRecordsReport_${dateTime}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}