import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParserComponent } from './parser.component';
import { ParserUtil } from './parser.util';
import { ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
//import { By } from 'protractor';

describe('ParserComponent', () => {
  let component: ParserComponent;
  let fixture: ComponentFixture<ParserComponent>;

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

  it('isFileExtCsv returns true if file extension is .csv', () => {
    let fileName= {
      name: 'test.csv'
    }
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.isFileExtCsv(fileName);
    expect(retVal).toBeTruthy();
  });

  it('isFileExtCsv returns false if file extension is not .csv', () => {
    let fileName= {
      name: 'test.png'
    }
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.isFileExtCsv(fileName);
    expect(retVal).toBeFalsy();
  });

  it('isFileExtXml returns true if file extension is .xml', () => {
    let fileName= {
      name: 'test.xml'
    }
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.isFileExtXml(fileName);
    expect(retVal).toBeTruthy();
  });

  it('isFileExtXml returns false if file extension is not .xml', () => {
    let fileName= {
      name: 'test.png'
    }
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.isFileExtXml(fileName);
    expect(retVal).toBeFalsy();
  });

  it('getHeaderArr returns an array by separating the first element of an input array using the delimiter', () => {    
    
    let expectedOutput = ["a", "b", "c", "d", "e", "f"];
    let input =["a,b,c,d,e,f", "x,y,z"];
    let delimiter = ',';
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.getHeaderArr(input, delimiter);
    expect(retVal).toEqual(expectedOutput);
  });

  it('getRecordsArrFrmCsvFile returns an array of arrays by separating the elements of an input array using the delimiter', () => {    
    
    let expectedOutput = [["a", "b", "c", "d", "e", "f"],["x", "y", "z"]];
    let input =["a,b,c,d,e,f", "x,y,z"];
    let delimiter = ',';
    const parserUtil = fixture.debugElement.injector.get(ParserUtil);
    let retVal = parserUtil.getRecordsArrFrmCsvFile(input, delimiter);
    expect(retVal).toEqual(expectedOutput);
  });

  // it('parseCsv() is only called when file extensin is .csv', () => {
  //   const btnChooseFile = fixture.debugElement.query(By.css('.btnChooseFile')).nativeElement;
  //   //btnChooseFile.value = btnChooseFile.options[0].value;
  //   btnChooseFile.dispatchEvent(new Event('change'));
  //   fixture.detectChanges();

  //   let fileName= {
  //     name: 'test.png'
  //   }
  //   const parserUtil = fixture.debugElement.injector.get(ParserUtil);
  //   if(parserUtil.isFileExtCsv(fileName)){
  //     expect(component.parseCsv()).toHaveBeenCalled();
  //   }
  //   else{
  //     expect(component.parseCsv()).not.toHaveBeenCalled();
  //   }
   
    
  // });

  it('should not display process button, success and failure alert on screen launch', () => { 
    //let windchart = fixture.debugElement.query(By.css('#processRec')).nativeElement;
    component.ngOnInit();  
    expect(document.getElementById('processRec').style.display).toEqual('none');
    expect(document.getElementById('successAlert').style.display).toEqual('none');
    expect(document.getElementById('failureAlert').style.display).toEqual('none');
  });

  it('should call fileReset() on Reset buttonclick', async(() => {
    spyOn(component, 'fileReset');
  
    let button = fixture.debugElement.nativeElement.querySelector('.btnReset');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fileReset).toHaveBeenCalled();
    });
  }));

  it('should reset properties on Reset buttonclick', async(() => {
    spyOn(component, 'fileReset');
  
    let button = fixture.debugElement.nativeElement.querySelector('.btnReset');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(document.getElementById('processRec').style.display).toEqual('none');
      expect(document.getElementById('successAlert').style.display).toEqual('none');
      expect(document.getElementById('failureAlert').style.display).toEqual('none');
    });
  }));
  
});
