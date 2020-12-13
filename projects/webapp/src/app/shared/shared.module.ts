import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import {
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentMediaModule,
  CovalentMessageModule,
  CovalentNotificationsModule,
  CovalentPagingModule,
  CovalentSearchModule
} from '@covalent/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/fontawesome-free-brands';
import { faTag, faTags } from '@fortawesome/fontawesome-pro-regular';
import { library } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Angulartics2Module } from 'angulartics2';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgPipesModule } from 'ngx-pipes';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { CreateMemberDialogComponent } from './create-member-dialog/create-member-dialog.component';
import { GroupCreateDialogComponent } from './group-create/group-create.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
//import { ClickOutsideDirective } from './directives/click-outside.directive';

const MATERIAL_MODULES: any[] = [
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatMenuModule,
  MatTableModule,
  MatListModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatGridListModule,
  MatDividerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule,
  MatExpansionModule
];

const COVALENT_MODULES: any[] = [
  CovalentCommonModule,
  CovalentMessageModule,
  CovalentNotificationsModule,
  CovalentExpansionPanelModule,
  CovalentLoadingModule,
  CovalentLayoutModule,
  CovalentDataTableModule,
  CovalentMediaModule,
  CovalentSearchModule,
  CovalentDataTableModule,
  CovalentPagingModule,
  CovalentDialogsModule
];

// Add an icon to the library for convenient access in other components
library.add(faFacebookF, faGoogle, faTag, faTags);

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MATERIAL_MODULES,
    TranslateModule,
    FlexLayoutModule,
    CovalentLoadingModule,
    CovalentMessageModule,
    RouterModule,
    NgxPermissionsModule
  ],
  declarations: [
    ToolbarComponent,
    UserMenuComponent,
    TransactionsListComponent,
    GroupCreateDialogComponent,
    CreateMemberDialogComponent,
    CategoryDialogComponent
    //ClickOutsideDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULES,
    FlexLayoutModule,
    COVALENT_MODULES,
    ToolbarComponent,
    UserMenuComponent,
    TransactionsListComponent,
    NgPipesModule,
    FontAwesomeModule,
    TranslateModule,
    Angulartics2Module,
    NgxPermissionsModule,
    NgxChartsModule,
    RouterModule
  ],
  entryComponents: [
    GroupCreateDialogComponent,
    CreateMemberDialogComponent,
    CategoryDialogComponent
  ]
})
export class SharedModule {}
