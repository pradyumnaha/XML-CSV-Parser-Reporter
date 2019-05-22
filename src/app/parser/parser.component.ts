import { Component, OnInit, ViewChild } from "@angular/core";
import { ParserUtil } from './parser.util';
import { Constants } from './parser.constants';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements OnInit {
  
  @ViewChild('fileImportInput')
  fileImportInput: any;
  csvRecords = [];
  csvRows = [];
  csvWriteData;
  failedRec = [];
  headersRow = [];
  csvDataWithoutHeader = []
  displayUserInfo: boolean = true;
  modalTitle: string = "";
  modalBody: string = "";
  Arr:string | ArrayBuffer = "";

  constructor(private parseUtil: ParserUtil, private ngxXml2jsonService: NgxXml2jsonService ) {
  }

  ngOnInit() {
    document.getElementById('processRec').style.display = 'none';
    this.displayUserInfo = true;
   }

  fileChangeListener($event): void {
    this.displayUserInfo = false;

    var text = [];
    var target = $event.target || $event.srcElement;
    var files = target.files; 
    

    if(Constants.validateHeaderAndRecordLengthFlag){
      
      if (this.parseUtil.isCSVFile(files[0])) {
        this.parseCsv($event);
      }
      else if (this.parseUtil.isXMLFile(files[0])) {
        this.parseXml($event);
      }
      else{
        alert("Please import valid .csv/.xml file.");
        this.fileReset();
      }

      
    }
  }

  parseCsv($event){
    document.getElementById('processRec').style.display = 'block';
    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      let csvData = (reader.result).toString();
      console.log(csvData);
      let csvRecordsArray = csvData.split(/\r\n|\n/);

      if(Constants.isHeaderPresentFlag){
        this.headersRow = this.parseUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter); 
      }
      
      this.csvRecords = this.parseUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, Constants.tokenDelimeter);
      this.csvRecords.pop();
      console.log(this.csvRecords);
      this.csvDataWithoutHeader = this.csvRecords.slice();
      this.csvDataWithoutHeader.shift();
      if(this.csvRecords == null){
        this.fileReset();
      }    
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  }

  parseXml($event) {
    document.getElementById('processRec').style.display = 'block';
    let input = $event.target;
    let obj;
    let manipulatedCsvObj;
    let manipulatedCsvArray = [];
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            this.Arr = reader.result;
            const parser = new DOMParser();
            const xml = parser.parseFromString(this.Arr.toString(), 'text/xml');
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

            this.csvDataWithoutHeader = manipulatedCsvArray.map( Object.values );
            if(this.headersRow.length === 0){
              for(var key in manipulatedCsvArray[0]){
                this.headersRow.push(key);
                
                
              }
            }
            this.csvRecords = [this.headersRow, ...this.csvDataWithoutHeader]; 
            console.log(this.headersRow);
            console.log(this.csvDataWithoutHeader);
            console.log(this.csvRecords);          
        }
        reader.readAsText(input.files[index]);
    };
    
   
    if(this.csvRecords == null){
      this.fileReset();
    }
  }

  fileReset(){
    this.fileImportInput.nativeElement.value = "";
    this.displayUserInfo = true;
    this.csvRecords= [];
    this.headersRow= [];
    this.csvRows= []; 
    this.csvWriteData= [];
    this.failedRec = [];
    this.csvDataWithoutHeader = [];
    document.getElementById('processRec').style.display = 'none';
  }

  fileProcess(){ 
    const failedArr1 = [];
    const failedArr2 = [];

    for(let i=1; i < this.csvRecords.length; i++){
      let arr = this.csvRecords[i];
      let endVal;
      let endBal = Number(arr[arr.length-1]);
      let mutation = Number(arr[arr.length-2]);
      let startBal = Number(arr[arr.length-3]);
      endVal = startBal + mutation;
      endVal = (Math.round(endVal * 100) / 100);
      console.log(endVal);
      console.log(endBal);
      if(endBal != endVal){
        failedArr1.push(arr);        
      }  
    }
    console.log(failedArr1);
    // for(let i=0; i < this.csvRecords.length; i++){
    //   let arr1 = this.csvRecords[i];
    //   if (i==0){
    //     this.failedRec2.push(arr1);
    //     continue;
    //   }       
        
    //   //prevVal = arr1[0];
    //   for(let j=i+1; j<this.csvRecords.length; j++){
    //     let arr2 = this.csvRecords[j];
        
    //     if(arr1[0] === arr2[0]){
    //       this.failedRec2.push(arr2);
    //       break;        
    //     }  
    //   }
    // }

    for(let i=0; i < this.csvRecords.length; i++){
      let arr1 = this.csvRecords[i];
      if (i==0){
        failedArr2.push(arr1);
        continue;
      }       
        
      for(let j=0; j<this.csvRecords.length; j++){
        if(i==j || j==0){
          continue;
        }
        let arr2 = this.csvRecords[j];
        
        if(arr1[0] === arr2[0]){
          failedArr2.push(arr1);
          break;        
        }  
      }
    }
    const failedArrays = failedArr2.concat(failedArr1);
    const filteredFailedArrays = failedArrays.filter(function (item, pos) {return failedArrays.indexOf(item) == pos});

    if(filteredFailedArrays.length > 1){
      filteredFailedArrays.forEach(el => {
        this.csvRows.push(el.join(','));
      });
      console.log(this.csvRows.join('\n'));
      this.downloadRpt(this.csvRows.join('\n'));
      this.modalTitle = "Info: Process Failure";
      this.modalBody = "CSV file process failed. There are few records in the file which either does not have unique Reference or contains negative End balance. Please check the report (ProcessFailure.csv).";
    }
    else{
      this.modalTitle = "Info: Process Success";
      this.modalBody = "CSV file process successfully. No failed records found.";
    }  
    document.getElementById('processRec').style.display = 'none';
  }

  downloadRpt(data){
    this.csvWriteData = data;
    const blob = new Blob([this.csvWriteData], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `ProcessFailure.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
