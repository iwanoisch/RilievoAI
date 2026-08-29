# Project Tree — src/

```
src/
├── App.css
├── AppExampleInit.tsx
├── AppRouting.tsx
├── Main.tsx
├── assets/
│   └── react.svg
├── common/
│   ├── Project-form-drawer/
│   │   ├── ProjectFormDrawer.tsx
│   │   └── ProjectFormDrawer.type.ts
│   ├── activity-stats-panel/
│   │   ├── ActivityStatsPanel.tsx
│   │   └── activityStatsPanel.type.ts
│   ├── alert/
│   │   ├── Alert.tsx
│   │   ├── Alert.type.ts
│   │   ├── AlertContext.ts
│   │   ├── AlertProvider.tsx
│   │   ├── readme.md
│   │   └── useAlert.ts
│   ├── audio-recorder/
│   │   ├── AudioRecorder.tsx
│   │   └── audioRecorder.type.ts
│   ├── avatar/
│   │   └── Avatar.tsx
│   ├── breadcrumbs/
│   │   ├── Breadcrumbs.tsx
│   │   └── Breadcrumbs.type.ts
│   ├── company-table/
│   │   ├── CompanyTable.tsx
│   │   └── CompanyTable.type.ts
│   ├── critical-activities-list/
│   │   ├── CriticalActivitiesList.tsx
│   │   └── criticalActivitiesList.type.ts
│   ├── drawer/
│   │   ├── Drawer.tsx
│   │   └── Drawer.type.ts
│   ├── file-uploader/
│   │   ├── FileUploader.tsx
│   │   ├── FileUploader.type.ts
│   │   └── readme.md
│   ├── filter/
│   │   └── Filter.tsx
│   ├── grid-list/
│   │   ├── GridList.tsx
│   │   └── GridList.type.ts
│   ├── image-select/
│   │   ├── ImageSelect.tsx
│   │   └── ImageSelect.type.ts
│   ├── language-selector/
│   │   ├── LanguageContext.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── LanguageSelector.type.ts
│   │   ├── language.types.ts
│   │   └── useLanguage.ts
│   ├── loader-dots/
│   │   └── LoaderDots.tsx
│   ├── logo-selection/
│   │   └── LogoSelection.tsx
│   ├── main-menu-bar/
│   │   └── MainMenuBar.tsx
│   ├── modal/
│   │   ├── Modal.tsx
│   │   ├── ModalBody.tsx
│   │   ├── ModalFooter.tsx
│   │   ├── ModalHeader.tsx
│   │   └── index.ts
│   ├── modal-activity-detail/
│   │   ├── ModalActivityDetail.tsx
│   │   └── ModalActivityDetail.type.ts
│   ├── modal-company-select/
│   │   ├── CompanyEditModal.tsx
│   │   ├── EditHeadquarterDrawer.tsx
│   │   ├── ModalCompanySelect.tsx
│   │   └── ModalCompanySelect.type.ts
│   ├── modal-customer-select/
│   │   ├── ModalCustomerSelect.tsx
│   │   ├── ModalCustomerSelect.type.ts
│   │   └── customer-table/
│   │       └── CustomerTable.tsx
│   ├── modal-dialog/
│   │   ├── ModalDialog.tsx
│   │   ├── ModalDialog.type.ts
│   │   ├── ModalDialogContext.ts
│   │   ├── ModalDialogProvider.tsx
│   │   └── useModalDialog.ts
│   ├── modal-new-activity/
│   │   ├── ModalNewActivity.tsx
│   │   └── ModalNewActivity.type.ts
│   ├── modal-project-detail/
│   │   ├── ModalProjectDetail.tsx
│   │   └── ModalProjectDetail.type.ts
│   ├── modal-report-detail/
│   │   ├── ModalReportDetail.tsx
│   │   └── ModalReportDetail.type.ts
│   ├── modal-signature/
│   │   └── ModalSignature.tsx
│   ├── multiSelect/
│   │   ├── MultiSelect.tsx
│   │   └── MultiSelect.type.ts
│   ├── page-title/
│   │   ├── PageTitle.tsx
│   │   └── pageTitle.type.ts
│   ├── pagination/
│   │   ├── Pagination.tsx
│   │   └── pagination.type.ts
│   ├── panel-title/
│   │   ├── PanelTitle.tsx
│   │   └── panelTitle.type.ts
│   ├── profile-edit-form-drawer/
│   │   ├── ProfileEditFormDrawer.tsx
│   │   ├── ProfileEditModal.tsx
│   │   └── ProfileEditModal.type.ts
│   ├── report-preview/
│   │   ├── PromptCreazioneDocGPT.txt
│   │   └── New/
│   │       ├── Doc.tsx
│   │       ├── DocEmpty.tsx
│   │       ├── DocHeader.tsx
│   │       ├── DocumentConstants.ts
│   │       ├── DocumentSchemas.ts
│   │       ├── DynamicReportPreview.tsx
│   │       ├── DynamicReportPreview.type.ts
│   │       ├── RIEPILOGO_DOCUMENTI.csv
│   │       ├── RIEPILOGO_DOCUMENTI.md
│   │       └── documents/
│   │           ├── autocertificazione-sicurezza/
│   │           │   └── AutocertificazioneSicurezza.tsx
│   │           ├── certificato-ultimazione-lavori/
│   │           │   └── CertificatoUltimazioneLavori.tsx
│   │           ├── certificato-ultimazione-lavori-opere/
│   │           │   └── CertificatoUltimazioneLavoriOpere.tsx
│   │           ├── certificato-ultimazione-lavori-strutturali/
│   │           │   └── CertificatoUltimazioneLavoriStrutturali.tsx
│   │           ├── checklist_sicurezza/
│   │           │   └── ChecklistSicurezza.tsx
│   │           ├── comunicazione-lavoratori-autonomi/
│   │           │   └── ComunicazioneLavoratoriAutonomi.tsx
│   │           ├── comunicazione-ripresa-lavori/
│   │           │   └── ComunicazioneRipresaLavori.tsx
│   │           ├── comunicazioni-obblighi-imprese/
│   │           │   └── ComunicazioneObblighiImpresa.tsx
│   │           ├── consegna-tesserino/
│   │           │   └── ConsegnaTesserino.tsx
│   │           ├── dichiarazione-dpi-avoratore-autonomo/
│   │           │   └── DichiarazioneDpiLavoratoreAutonomo.tsx
│   │           ├── ordine-di-servizio/
│   │           │   └── OrdineDiServizio.tsx
│   │           ├── possesso-requisiti-idoneita/
│   │           │   ├── PossessoRequisitiIdoneita.tsx
│   │           │   └── PossessoRequisitiIdoneita.type.ts
│   │           ├── proposta-integrazione-psc/
│   │           │   └── PropostaIntegrazionePsc.tsx
│   │           ├── proposta-varianti/
│   │           │   └── PropostaVarianti.tsx
│   │           ├── rapporto-attivita-cantiere/
│   │           │   └── RapportoAttivitaCantiere.tsx
│   │           ├── registro-controllo-attrezzature/
│   │           │   └── RegistroControlloAttrezzature.tsx
│   │           ├── richiesta_documentazione_impresa/
│   │           │   └── RichiestaDocumentazioneImpresa.tsx
│   │           ├── segnalazione-inosservanza/
│   │           │   └── SegnalazioneInosservanza.tsx
│   │           ├── sospensione-lavori-pericolo/
│   │           │   └── SospensioneLavoriPericolo.tsx
│   │           ├── trasmissione-psc/
│   │           │   └── TrasmissionePsc.tsx
│   │           ├── trasmissione_pimus/
│   │           │   └── TrasmissionePimus.tsx
│   │           ├── trasmissione_pos/
│   │           │   └── TrasmissionePos.tsx
│   │           ├── verbale-accettazione-acciao/
│   │           │   └── VerbaleAccettazioneAcciaio.tsx
│   │           ├── verbale-accettazione-calcestruzzo/
│   │           │   └── VerbaleAccettazioneCalcestruzzo.tsx
│   │           ├── verbale-collaudo-corso-opera/
│   │           │   └── VerbaleCollaudoCorsoOpera.tsx
│   │           ├── verbale-consistenza/
│   │           │   └── VerbaleConsistenza.tsx
│   │           ├── verbale-danni-forza-maggiore/
│   │           │   └── VerbaleDanniForzaMaggiore.tsx
│   │           ├── verbale-inizio-lavori/
│   │           │   └── VerbaleInizioLavori.tsx
│   │           ├── verbale-rifiuto-materiali/
│   │           │   └── VerbaleRifiutoMateriali.tsx
│   │           ├── verbale-ripresa-lavori/
│   │           │   └── VerbaleRipresaLavori.tsx
│   │           ├── verbale-riservato-committente/
│   │           │   └── VerbaleRiservatoCommittente.tsx
│   │           ├── verbale-riunione-coordinamento/
│   │           │   └── VerbaleRiunioneCoordinamento.tsx
│   │           ├── verbale-riunione-periodica/
│   │           │   └── VerbaleRiunionePeriodica.tsx
│   │           ├── verbale-sopralluogo/
│   │           │   └── VerbaleSopralluogo.tsx
│   │           ├── verbale-sopraluogo-strutturali/
│   │           │   └── VerbaleSopralluiogoStrutturali.tsx
│   │           ├── verbale-sospensione-lavori-direzione/
│   │           │   └── VerbaleSospensioneLavoriDirezione.tsx
│   │           ├── verbale-sospensione-lavori-sicurezza/
│   │           │   └── VerbaleSospensioneLavoriSicurezza.tsx
│   │           ├── verbale-visita-cantiere/
│   │           │   └── VerbaleVisitaCantiere.tsx
│   │           └── verifiche-responsabile-lavori/
│   │               └── VerificheResponsabileLavori.tsx
│   ├── side-bar/
│   │   └── SideBar.tsx
│   ├── signature-pad/
│   │   └── SignaturePad.tsx
│   ├── signature-render/
│   │   └── SignatureRender.tsx
│   ├── simple-calendar/
│   │   ├── CalendarSkeleton.tsx
│   │   ├── SimpleCalendar.tsx
│   │   └── simpleCalendar.type.ts
│   ├── simple-card-action/
│   │   ├── SimpleCardAction.tsx
│   │   └── simpleCardAction.type.ts
│   ├── simple-card-action-skeleton/
│   │   ├── simpleCardActionSkeleton.tsx
│   │   └── simpleCardSkeleton.type.ts
│   ├── simple-meter/
│   │   ├── SimpleMeter.tsx
│   │   └── SimpleMeter.type.tsx
│   ├── simple-select/
│   │   └── SimpleSelect.tsx
│   ├── simple-table/
│   │   ├── SimpleTable.tsx
│   │   └── simpleTable.type.ts
│   ├── spinner/
│   │   ├── Spinner.tsx
│   │   └── spinner.type.ts
│   ├── stat-card/
│   │   ├── StatCard.tsx
│   │   └── statsCard.type.ts
│   ├── sub-menu-bar/
│   │   └── sub-menu-bar.tsx
│   ├── subtitle/
│   │   ├── Subtitle.tsx
│   │   └── Subtitle.type.ts
│   ├── tailwind-table/
│   │   ├── TailwindTable.tsx
│   │   ├── TailwindTable.type.ts
│   │   └── readme.MD
│   └── theme-selector/
│       ├── ThemeContext.tsx
│       ├── ThemeSelector.tsx
│       ├── theme.types.ts
│       └── useTheme.ts
├── components/
│   ├── index.ts
│   ├── draggableButton/
│   │   ├── DraggableButton.tsx
│   │   └── draggableButton.type.ts
│   ├── entitySelector/
│   │   └── EntitySelector.tsx
│   ├── layout/
│   │   ├── Layout.tsx
│   │   └── layout.type.ts
│   ├── panels/
│   │   ├── activityDetailPanel/
│   │   │   └── ActivityDetailPanel.tsx
│   │   ├── activityPanel/
│   │   │   └── ActivityPanel.tsx
│   │   ├── fileManagerPanel/
│   │   │   ├── FileManagerPanel.tsx
│   │   │   ├── fileManagerPanel.type.ts
│   │   │   ├── addDocumentModal/
│   │   │   │   ├── AddDocumentModal.tsx
│   │   │   │   └── AddDocumentModal.type.ts
│   │   │   └── addFileModal/
│   │   │       ├── AddFileModal.tsx
│   │   │       └── AddFileModal.type.ts
│   │   ├── generalPanel/
│   │   │   └── GeneralPanel.tsx
│   │   ├── groupPanel/
│   │   │   ├── GroupPanel.tsx
│   │   │   ├── groupPanel.type.ts
│   │   │   ├── ModalActivityPhase/
│   │   │   │   ├── ModalActivityPhase.tsx
│   │   │   │   └── ModalActivityPhase.type.ts
│   │   │   └── ModalAddPhase/
│   │   │       ├── ModalAddPhase.tsx
│   │   │       └── ModalAddPhase.type.ts
│   │   ├── partnerPanel/
│   │   │   ├── PartnerPanel.tsx
│   │   │   ├── PartnerPanel.type.ts
│   │   │   └── partnerPermissionModal/
│   │   │       ├── PartnerPermissionModal.tsx
│   │   │       └── PartnerPermissionModal.type.ts
│   │   └── reportPanel/
│   │       └── ReportPanel.tsx
│   └── tabs/
│       ├── CalendarTab/
│       │   └── CalendarTab.tsx
│       ├── activityTab/
│       │   ├── ActivityTab.tsx
│       │   └── ActivityTab.type.ts
│       ├── ganttTab/
│       │   ├── GanttTab.tsx
│       │   └── GanttTab.type.ts
│       └── reportTab/
│           ├── ReportTab.tsx
│           ├── retportTab.type.ts
│           ├── modalReport/
│           │   ├── ModalReport.tsx
│           │   └── ModalReport.type.ts
│           └── modalSessions/
│               ├── ModalSessions.tsx
│               └── ModalSessions.type.ts
├── dataMok/
│   ├── ACTIVITIES.ts
│   ├── CompanySite.ts
│   ├── MOCK_GANT.ts
│   ├── MOCK_PROJECTS_RECENTLY_EDITED.ts
│   ├── MOCK_USERS.ts
│   ├── RESPONSIBLE_DATA_MOCKS.ts
│   ├── TAB_ACTIVITY_MOCK.ts
│   └── mockLogo.ts
├── features/
│   ├── rootReducers.ts
│   ├── activities/
│   │   ├── hooks/
│   │   │   └── useActivities.ts
│   │   └── slice/
│   │       ├── activities.type.ts
│   │       └── activitiesSlice.ts
│   ├── auth/
│   │   ├── api/
│   │   │   ├── TODOremove_auth.api.ts
│   │   │   └── auth.type.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── slice/
│   │       ├── auth.type.ts
│   │       └── authSlice.ts
│   ├── company/
│   │   ├── hooks/
│   │   │   └── useCompany.ts
│   │   └── slice/
│   │       └── companySlice.ts
│   ├── data_list/
│   │   ├── hooks/
│   │   │   └── useDataList.ts
│   │   └── slice/
│   │       └── dataListTypeSlice.ts
│   ├── fileManager/
│   │   ├── hooks/
│   │   │   └── useFileManager.ts
│   │   └── slice/
│   │       ├── fileManager.type.ts
│   │       └── fileManagerSlice.ts
│   ├── groupStage/
│   │   ├── hooks/
│   │   │   └── useGroupStage.ts
│   │   └── slice/
│   │       ├── groupStage.type.ts
│   │       └── groupStageSlice.ts
│   ├── init/
│   │   ├── hooks/
│   │   │   └── useInit.ts
│   │   └── slice/
│   │       ├── init.type.ts
│   │       └── initSlice.ts
│   ├── pagination/
│   │   └── hooks/
│   │       └── usePagination.ts
│   ├── project_type/
│   │   ├── hooks/
│   │   │   └── useProjectType.ts
│   │   └── slice/
│   │       └── projectTypeSlice.ts
│   ├── projects/
│   │   ├── api/
│   │   │   └── project.api.ts
│   │   ├── hooks/
│   │   │   └── useProjects.ts
│   │   └── slice/
│   │       ├── projects.type.ts
│   │       └── projectsSlice.ts
│   ├── projectsPartners/
│   │   ├── hook/
│   │   │   └── useProjectsPartner.ts
│   │   └── slice/
│   │       ├── projectsPartner.type.ts
│   │       └── projectsPartnerSlice.ts
│   └── workspace/
│       ├── workspace.util.ts
│       ├── hooks/
│       │   └── useWorkSpace.ts
│       └── slice/
│           ├── workspace.type.ts
│           └── workspaceSlice.ts
├── file/
│   └── province-italia.json
├── hooks/
│   ├── useApiClient.ts
│   ├── useApiClient.type.ts
│   ├── useAutoPopulate.ts
│   ├── useIsDarkMode.ts
│   └── usePdfGenerator.ts
├── pages/
│   ├── activities/
│   │   └── Activities.tsx
│   ├── activity/
│   │   ├── Activity.tsx
│   │   └── Activity.type.tsx
│   ├── calendar/
│   │   └── Calendar.tsx
│   ├── company/
│   │   ├── MyCompany.tsx
│   │   ├── MyCompany.type.ts
│   │   └── CompanyDetailModal/
│   │       ├── CompanyDetailModal.tsx
│   │       └── CompanyDetailModal.type.ts
│   ├── company-partners/
│   │   ├── CompanyPartner.type.ts
│   │   └── CompanyPartners.tsx
│   ├── company-user/
│   │   ├── CompanyUser.tsx
│   │   ├── ModalAddUser.tsx
│   │   └── ModalAddUser.type.ts
│   ├── create-partner/
│   │   ├── CreatePartner.tsx
│   │   └── CreatePartner.type.ts
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── folder/
│   │   └── Folder.tsx
│   ├── home-page/
│   │   └── HomePage.tsx
│   ├── invitation-page/
│   │   ├── InvitationPage.tsx
│   │   └── invitationPage.type.ts
│   ├── login/
│   │   └── Login.tsx
│   ├── not-found/
│   │   └── NotFound.tsx
│   ├── project/
│   │   ├── NewFolderModal.tsx
│   │   ├── Project.tsx
│   │   └── newFolderModal.type.ts
│   ├── project-edit/
│   │   └── ProjectEdit.tsx
│   ├── projects/
│   │   ├── Projects.tsx
│   │   ├── Projects.type.ts
│   │   └── NewProjectModal/
│   │       ├── NewProjectModal.tsx
│   │       └── NewProjectModal.type.ts
│   ├── user-profile/
│   │   └── UserProfile.tsx
│   ├── user-settings/
│   │   └── UserSettings.tsx
│   └── workspaces/
│       ├── Workspace.tsx
│       ├── Workspaces.tsx
│       ├── EditWorkspaceModal/
│       │   └── EditWorkspaceModal.tsx
│       └── NewWorkspaceModal/
│           └── NewWorkspaceModal.tsx
├── sentry.ts
├── store/
│   └── store.ts
├── styles/
│   ├── calendar.css
│   └── theme.css
├── utility/
│   ├── activity-criticality-utils.ts
│   ├── activity-utils.ts
│   ├── alert-utils.ts
│   ├── constants.ts
│   ├── date-utils.ts
│   ├── gantt-utils.ts
│   ├── menu-items-utils.ts
│   ├── meter-utils.ts
│   ├── modal-dialog-util.ts
│   ├── pagination-util.ts
│   ├── project-color-map-utils.ts
│   ├── project-type-filter.ts
│   ├── projectPartnerMapUtils.ts
│   ├── simple-calendar-utils.ts
│   ├── simple-table-list-utils.ts
│   └── string-refactor-utils.ts
└── vite-env.d.ts
```
