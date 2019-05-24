# CSV XML data parser

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Steps to run the application
Clone the repository. In the root folder run `npm install` to download all the required modules

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## How to use the application
1. Select a CSV/XML file using choose file button.
2. Once the CSV/XML file is loaded successfully, the data file will be displayed in a tabular column.
3. Click on Process button to process the records.
4. If the records get successfully processed, you get success alert.
5. If the records gets failed (a record is considered as 'failed' if end balance is not calculated properly or if the transaction reference is not unique), you get failure alert along with a CSV file which contains the     failed records.

## Required file format
.csv format:
Reference,AccountNumber,Description,Start Balance,Mutation,End Balance
194261,NL91RABO0315273637,Clothes from Jan Bakker,21.6,-41.83,-20.23
112806,NL27SNSB0917829871,Clothes for Willem Dekker,91.23,+15.57,106.8
183049,NL69ABNA0433647324,Clothes for Jan King,86.66,+44.5,131.16
183356,NL74ABNA0248990274,Subscription for Peter de Vries,92.98,-46.65,46.33
112806,NL69ABNA0433647324,Clothes for Richard de Vries,90.83,-10.91,79.92
112806,NL93ABNA0585619023,Tickets from Richard Bakker,102.12,+45.87,147.99
139524,NL43AEGO0773393871,Flowers from Jan Bakker,99.44,+41.23,140.67
179430,NL93ABNA0585619023,Clothes for Vincent Bakker,23.96,-27.43,-3.47
141223,NL93ABNA0585619023,Clothes from Erik Bakker,94.25,+41.6,135.85
195446,NL74ABNA0248990274,Flowers for Willem Dekker,26.32,+48.98,75.3

.xml format:
<records>
  <record reference="130498">
    <accountNumber>NL69ABNA0433647324</accountNumber>
    <description>Tickets for Peter Theuß</description>
    <startBalance>26.9</startBalance>
    <mutation>-18.78</mutation>
    <endBalance>8.12</endBalance>
  </record>
</records>
