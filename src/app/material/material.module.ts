import { MatPaginatorImpl } from './mat-paginator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule, MatStepperModule,MatGridListModule,
    MatPaginatorModule,MatAutocompleteModule,
    MatCardModule,MatDatepickerModule, MatExpansionModule,
    ReactiveFormsModule, MatDividerModule, MatDialogModule, MatSelectModule, MatProgressBarModule,
    MatSnackBarModule, MatToolbarModule, MatMenuModule, MatSidenavModule, MatNativeDateModule
  ], exports : [
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule, MatAutocompleteModule,
    MatInputModule, MatStepperModule,MatGridListModule,
    MatIconModule,
    MatSortModule, MatExpansionModule,
    MatPaginatorModule, MatNativeDateModule,
    MatCardModule,MatDatepickerModule, MatProgressBarModule,
    ReactiveFormsModule,MatDividerModule,MatDialogModule,MatSelectModule,
    MatSnackBarModule, MatToolbarModule, MatMenuModule, MatSidenavModule
  ],
  providers: [
    { provide : MatPaginatorIntl, useClass: MatPaginatorImpl},
    {provide : MAT_DATE_LOCALE, useValue : 'es-ES'}
  ]
})
export class MaterialModule { }
