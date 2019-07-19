import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FireConnectionService } from '../shared/fire-connection.service';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
//import { async } from '@angular/core/testing';
//import { deflateRawSync } from 'zlib';
//import { delay } from 'q';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  defaultDataTypes= [
    {value: 'string', viewValue: 'String'},
    {value: 'number', viewValue: 'Number'},
    {value: 'boolean', viewValue: 'Check Box'},
    {value: 'map', viewValue: 'Map'},
    {value: 'array', viewValue: 'Array'},
    {value: 'datatime', viewValue: 'Data Time'},
    {value: 'geopoint', viewValue: 'Geo Point'},
    {value: 'database', viewValue: 'Data Base'},
    {value: 'optionselection', viewValue: 'Option Selection'},
  ];
  dataType='';
  editField='';
  docId='';
  colId='';
  collectionID='';
  collection=[];
  dataFields=[];
  collectionData=[];
  allData=[];
  dataTypes={};
  constructor(private firestore:AngularFirestore,
              private route: ActivatedRoute,
              private dataS:DataService,
              private fire:FireConnectionService,
              private router: Router) {
    let id=this.route.snapshot.paramMap.get('docId');
    console.log(id);
    this.docId=id;
    let cityRef = this.firestore.collection('appData').doc(this.docId);
    let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          console.log(doc.data().fields)
          this.collection.push(doc.data().fields);
          this.colId=doc.data().path;
          this.dataTypes=doc.data().datatypes;
          console.log('fire lst1');

          let citiesRef = this.firestore.collection(doc.data().path);
          let allCities = citiesRef.get()
          .subscribe(snapshot => { 
            snapshot.forEach(doc => {
              this.collectionData.push(doc);
              this.allData.push([doc.id,doc.data()]);
              console.log(doc.id, '=>', doc.data());
              //console.log(this.collectionData[0].data().field3);
            })
          }
        ,err => {
            console.log('Error getting documents', err);
        });

        }
      }
      ,err => {
        console.log('Error getting document', err);
      });
      
    }


    /*
    this.collection= this.fire.getModel(this.docId);
    this.setValues();
    this.collectionData=this.fire.getData(this.collectionData);*/
    
    


    /*let cityRef = this.firestore.collection('appData').doc(this.docId);
    let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          this.collection.push(doc);
          this.dataFields=doc.data().fields;
          this.collectionID=doc.data().path;
          console.log(doc.data().path);
        }
      })
      err => {
        console.log('Error getting document', err);
      };

      let citiesRef = this.firestore.collection(this.collectionID);
      let allCities = citiesRef.get()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          this.collectionData.push(doc);
          console.log(doc.id, '=>', doc.data());
        });
      })
    err => {
        console.log('Error getting documents', err);
    };*/
    
  
  /*async setValues(){
    await delay(8000);
    let col=await this.collection;
    this.dataFields= col[0].data().fields;
    this.collectionID= col[0].data().path;
  }
  async setData(){
    await delay(7000);
    let data=await this.collectionData;
    console.log(data);
    this.allData=data;
  }

  getCollectionData(docId) { 
    return this.firestore.collection(docId).snapshotChanges();
  }*/
/*onClick(cell){
  console.log(cell);
}*/

  ngOnInit() {
    
  
    //this.dataFields=this.collection[0];
    //this.dataS.currentData.subscribe(data=>this.dataN=data);
    
    //console.log(!(this.dataN.length==0));
    /*if(!(this.dataN.length==0)){
      console.log('a');
      this.dataX=this.dataN;
    }*/
  }
  dataf(){
    console.log(this.dataFields);
  }


  changeValue(event,row,col){
    this.editField = event.target.textContent;
    if (this.editField != undefined){
      if (this.dataTypes[col]=="number"){
      }
    }
  }

  checkNumber(val){
    let newregex=/^[-+]?[0-9]*\.?[0-9]+$/;
    if(newregex.test(val)){
      return true;
    }else{
      return false;
    }
  }
  updateValueG(event,row,col,p){
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    let point={};
    let id;
    if(p=='lon'){
      point['longitude']=+event.target.value;
      point['latitude']=row[1][col]['latitude'];
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      //console.log(this.collectionData[id].data());
      row[1][col]['longitude']=+event.target.value;
    }else{
      point['latitude']=+event.target.value;
      point['longitude']=row[1][col]['longitude'];
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      row[1][col]['latitude']=+event.target.value;
    }

    data[col]=point;
    cityRef.update(data);

  }

  updateValue(event,row,col){
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    if (this.dataTypes[col]=="boolean"){
      console.log(event.target.textContent);
      return
    }
    if (this.dataTypes[col]=="number"){
      console.log(+event.target.value);
      data[col]=+event.target.value;
      cityRef.update(data);
      return
    }
    if (this.dataTypes[col]=="geopoint"){
      console.log(+event.target.value);
      return
    }
    console.log(row[0]);
    console.log(col);
    console.log(event.target.textContent);
    data[col]=event.target.textContent;
    cityRef.update(data);
  }

  add(){
    let newAddDoc='';
    let fields=this.collection[0];
    var dt = {};
    for (let entry of fields) {
      switch(this.dataTypes[entry]) { 
        case "string": { 
          dt[entry] = "";
          console.log("string"); 
          break; 
        } 
        case "number": { 
          dt[entry] = 0;
          console.log("number"); 
          break; 
        } 
        case "boolean": {
          dt[entry] = false;
          console.log("boolean"); 
          break;    
        } 
        case "map": { 
          dt[entry] = {};
          console.log("map"); 
          break; 
        }  
        case "array": {
          dt[entry] = []; 
          console.log("array"); 
          break;              
        } 
        case "datetime": { 
          dt[entry] = "";
          console.log("datetime"); 
          break;              
        } 
        case "geopoint": {
          let gp={};
          gp['longitude']=0;
          gp['latitude']=0;
          dt[entry] = gp;
          console.log("geopoint"); 
          break;              
        } 
        case "database": { 
          dt[entry] = "";
          console.log("database"); 
          break;              
        } 
        case "optionselection": { 
          dt[entry] = "";
          console.log("optionselection"); 
          break;              
        } 
        default:{
          dt[entry] = "";
          console.log("error[default]");
          break;
        }
      }
    }
    let addDoc = this.firestore.collection(this.colId).add(
      dt
    ).then(ref => {
      console.log('Added document with ID: ', ref.id);
      newAddDoc=ref.id;
      //this.collectionData.push(addDoc);
      let cityRef = this.firestore.collection(this.colId).doc(newAddDoc);
      let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          this.collectionData.push(doc);
          this.allData.push([doc.id,doc.data()])
        }
      })
      err => {
        console.log('Error getting document', err);
      };
    });

    
    
    //console.log(this.collectionData);
  }

  remove(rowID){
    console.log(rowID);
    for (let entry of this.collectionData){
      if(entry.id==rowID){
        let id =this.collectionData.indexOf(entry);
        this.firestore.collection(this.colId).doc(rowID).delete();
        this.collectionData.splice(id, 1);
        this.allData.splice(id,1);
        break;
      }
    }
  }

  getValue(row,col){  
    return row.data()[col];
  }

  onHome(){
    return this.router.navigate(['']);
  }

  updateCheckBox(row,col){
    console.log(!row[1][col]);
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    console.log(row[0]);
    console.log(col);
    data[col]=!row[1][col];
    cityRef.update(data);

  }

  updateDataType(event,col){
    console.log(event.target.textContent);
    console.log(this.dataTypes[col]);
    let cityRef = this.firestore.collection('appData').doc(this.docId);
    let data={};
    data['datatypes']=this.dataTypes;
    cityRef.update(data);
  }
}
