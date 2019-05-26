import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParserComponent } from './parser.component';
import { ParserUtil } from './parser.util';
import { ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { read } from 'fs';
//import { By } from 'protractor';

describe('ParserComponent', () => {
  let component: ParserComponent;
  let fixture: ComponentFixture<ParserComponent>;
  let csvFiles = Array<File>();
  let xmlFiles = Array<File>();
  //set sample csv files for testing
  let CSV = [
    'Reference,AccountNumber,Description,Start Balance,Mutation,End Balance',
    '194261,NL91RABO0315273637,Clothes from Jan Bakker,21.6,-41.83,-20.23',
    '112806,NL27SNSB0917829871,Clothes for Willem Dekker,91.23,+15.57,106.8'
  ].join('\n');
  let contentTypeCSV = 'text/csv';
  let dataCSV = new Blob([CSV], { type: contentTypeCSV });
  let arrayOfBlobCSV = new Array<Blob>();
  arrayOfBlobCSV.push(dataCSV);
  let csvData = new File(arrayOfBlobCSV, "Mock.csv");
  csvFiles.push(csvData);

  //set sample xml data for testing

  let XML = [
    '<records>                                                               ',
    '  <record reference="130498">                                           ',
    '    <accountNumber>NL69ABNA0433647324</accountNumber>                   ',
    '    <description>Tickets for Peter Theuß</description>                  ',
    '    <startBalance>26.9</startBalance>                                   ',
    '    <mutation>-18.78</mutation>                                         ',
    '    <endBalance>8.12</endBalance>                                       ',
    '  </record>                                                             ',
    '  <record reference="170148">                                           ',
    '    <accountNumber>NL43AEGO0773393871</accountNumber>                   ',
    '    <description>Flowers for Jan Theuß</description>                    ',
    '    <startBalance>16.52</startBalance>                                  ',
    '    <mutation>+43.09</mutation>                                         ',
    '    <endBalance>59.61</endBalance>                                      ',
    '  </record>                                                             ',
    '</records>                                                              '
  ].join('\n');

  let contentType = 'text/xml';
  let data = new Blob([XML], { type: contentType });
  let arrayOfBlob = new Array<Blob>();
  arrayOfBlob.push(data);
  let xmlData = new File(arrayOfBlob, "Mock.xml");
  xmlFiles.push(xmlData);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParserComponent ],
      providers: [ParserUtil ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isFileExtXml returns false if file extension is not .xml', () => {
    let fileName= {
      name: 'test.png'
    }
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.isFileExtXml(fileName);
    expect(retVal).toBeFalsy();
  });

  it('Util getHeaderArr returns an array by separating the first element of an input array using the delimiter', () => {    
    
    let expectedOutput = ["a", "b", "c", "d", "e", "f"];
    let input =["a,b,c,d,e,f", "x,y,z"];
    let delimiter = ',';
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.getHeaderArr(input, delimiter);
    expect(retVal).toEqual(expectedOutput);
  });

  it('Util getRecordsArrFrmCsvFile returns an array of arrays by separating the elements of an input array using the delimiter', () => {    
    
    let expectedOutput = [["a", "b", "c", "d", "e", "f"],["x", "y", "z"]];
    let input =["a,b,c,d,e,f", "x,y,z"];
    let delimiter = ',';
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.getRecordsArrFrmCsvFile(input, delimiter);
    expect(retVal).toEqual(expectedOutput);
  });

  it('should call fileReset() on Reset buttonclick', async(() => {
    spyOn(component, 'fileReset').and.callThrough();
  
    let button = fixture.debugElement.nativeElement.querySelector('.btnReset');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fileReset).toHaveBeenCalled();
    });
  }));

  it('should call fileChangeListener on choose file button change event', async(() => {
    spyOn(component, 'fileChangeListener').and.callThrough();
  
    let button = fixture.debugElement.nativeElement.querySelector('.btnChooseFile');
    button.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fileChangeListener).toHaveBeenCalled();
    });
  }));

  it('End balance check negative scenario', () => {
    component.dataRecords = [
      ["Reference","Account Number","Description","Start Balance","Mutation","End Balance"],
      ["164702","NL46ABNA0625805417","Flowers for Rik Dekker","81.89","-5.99","87.88"],
      ["156754","NL46ABNA0625804417"," Dekker","81.89","+13.99","95.88"]
    ];
    component.fileProcess();
    expect(component.failureProcess).toBe(true);
  });

  it('Process successful positive scenario', () => {
    component.dataRecords = [
      ["Reference","Account Number","Description","Start Balance","Mutation","End Balance"],
      ["164702","NL46ABNA0625805417","Flowers for Rik Dekker","2","3","5"],
      ["156754","NL46ABNA0625804417"," Dekker","81.89","+13.99","95.88"]
    ];
    component.fileProcess();
    expect(component.successProcess).toBe(true);
  });

  it('fileProcess unique reference number', () => {
    component.dataRecords = [
      ["Reference","Account Number","Description","Start Balance","Mutation","End Balance"],
      ["164702","NL46ABNA0625805417","Flowers for Rik Dekker","81.89","-5.99","87.88"],
      ["164702","NL46ABNA0625804417"," Dekker","81.89","+13.99","95.88"]
    ];
    spyOn(component, 'downloadRpt');
    component.fileProcess();
    expect(component.downloadRpt).toHaveBeenCalled();
    expect(component.failureProcess).toBe(true);
  });

  it('filechangelistener when there is a wrong file format', () => {
    const event = {
      target: {
        files: {
          0: {
            name: "records.png"
          }
        }
      }
    }
    component.fileChangeListener(event);
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retValCsv = parserUtil.isFileExtCsv(event.target.files[0]);
    let retValXml = parserUtil.isFileExtXml(event.target.files[0]);
    expect(retValCsv).toBe(false);
    expect(retValXml).toBe(false);
    expect(component.supportedFileFormat).toBe(false);
  });

});
