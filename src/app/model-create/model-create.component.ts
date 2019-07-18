import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FieldComponent } from './field/field.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css']
})
export class ModelCreateComponent implements OnInit {
  modelName='';
  result;
  field='';
  dataType='';
  fields=[];
  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private firestore: AngularFirestore,
              private router: Router) { 
    let modelName=this.route.snapshot.paramMap.get('modelName');
    this.modelName=modelName;
    console.log(this.modelName);
    
    let cityRef = this.firestore.collection('appData').doc(modelName);
    cityRef.get()
    .subscribe(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        this.fields=doc.data().fields;
      }
    })
    err => {
      console.log('Error getting document', err);
    };

  }

  ngOnInit() {
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(FieldComponent, {
      width: '350px',
      data: {field: this.field, dataType: this.dataType}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      if(!(result==null)){
        console.log(result.field);
        console.log(result.dataType);
        this.fields.push(result.field);

        let cityRef = this.firestore.collection('appData').doc(this.modelName);

        cityRef.update({fields: this.fields});
      }
    });
  }

  onViewData(){
    return this.router.navigate(['/model/data',this.modelName]);
  }

  onBack(){
    return this.router.navigate(['']);
  }

}
