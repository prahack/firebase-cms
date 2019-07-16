import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FireConnectionService } from '../shared/fire-connection.service';
import { AngularFirestore } from '@angular/fire/firestore'
//import { async } from '@angular/core/testing';
//import { deflateRawSync } from 'zlib';
//import { delay } from 'q';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  editField='';
  docId='';
  colId='';
  collectionID='';
  collection=[];
  dataFields=[];
  collectionData=[];
  allData=[];
  constructor(private firestore:AngularFirestore,
              private route: ActivatedRoute,
              private dataS:DataService,
              private fire:FireConnectionService) {
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
          console.log('fire lst1');

          let citiesRef = this.firestore.collection(doc.data().path);
          let allCities = citiesRef.get()
          .subscribe(snapshot => { 
            snapshot.forEach(doc => {
              this.collectionData.push(doc);
              console.log(doc.id, '=>', doc.data());
              console.log(this.collectionData[0].data().field3);
            })
          })
        err => {
            console.log('Error getting documents', err);
        };

        }
      })
      err => {
        console.log('Error getting document', err);
      };
      
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

  changeValue(event){
    this.editField = event.target.textContent;
    if (this.editField != undefined){
      //console.log(event.target.textContent);
    }
  }

  updateValue(event,rowID,col){
    console.log(rowID);
    console.log(col);
    console.log(event.target.textContent);
    let cityRef = this.firestore.collection(this.colId).doc(rowID);
    let data={};
    data[col]=event.target.textContent;
    cityRef.update(data);
  }

  add(){
    let newAddDoc='';
    let fields=this.collection[0];
    var dt = {};
    for (let entry of fields) {
      dt[entry] = "";
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
      }
    }
  }

  getValue(row,col){
    return row.data()[col];
  }
}
