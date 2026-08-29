# Feature Rimosse dal Boilerplate

Questo documento contiene il riferimento completo delle feature Redux, API, tipi e interfacce rimossi durante la conversione del progetto Cantieri Client in un boilerplate. Usalo come riferimento per ri-implementare le feature in progetti futuri.

---

## Indice

1. [Projects](#1-projects)
2. [Projects Partners](#2-projects-partners)
3. [Project Type](#3-project-type)
4. [Company](#4-company)
5. [Activities](#5-activities)
6. [File Manager](#6-file-manager)
7. [Data List](#7-data-list)
8. [Group Stage](#8-group-stage)
9. [Workspace](#9-workspace)
10. [Pagination](#10-pagination)
11. [Pagine Rimosse](#11-pagine-rimosse)
12. [Componenti Rimossi](#12-componenti-rimossi)

---

## 1. Projects

### Redux Slice: `projectsSlice.ts`
- **State**: `projects: Project[] | null`, `project: Project | null`, `ProjectPagination: IPagination | null`, `tasks: Task[] | null`, `isLoading: boolean`, `error: string | null`
- **Actions**: `projectStart`, `loadProjects`, `loadTasks`, `addProject`, `editProject`, `deleteProject`, `projectSelected`, `projectsError`

### Hook: `useProjects.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getProjects()` | `/project/index` | GET | Lista tutti i progetti |
| `getProjectsWithFilter(filter)` | `/project/index?filter=...` | GET | Progetti con filtro |
| `getProjectsByWorkspace(wsId)` | `/project/index?workspace_id=...` | GET | Progetti per workspace |
| `getProjectById(id)` | `/project/show/{id}` | GET | Dettaglio singolo progetto |
| `createProject(body)` | `/project/store` | POST | Crea nuovo progetto |
| `updateProject(id, body)` | `/project/store/{id}` | POST | Aggiorna progetto |
| `removeProject(id)` | `/project/destroy/{id}` | POST | Elimina progetto |

### Tipi: `projects.type.ts`

```typescript
export interface ProjectsState {
    projects: Project[] | null;
    project: Project | null;
    ProjectPagination: IPagination | null;
    tasks: Task[] | null;
    isLoading: boolean;
    error: string | null;
}

export interface GenericPagination<T> {
    pagination: IPagination;
    data: T[]
}

export interface IPagination {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page_url: string;
    last_page: number;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    data?: [];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Address {
    addr_street: string;
    addr_zip: string;
    addr_city: string;
    addr_province: string;
    addr_country: string;
    addr_notes: string;
    coords_lat?: string;
    coords_lng?: string;
}

export type Status = 'Scaduto' | 'Urgente' | 'In corso' | 'Nuovo' | 'Completato';

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    assignedTo: string;
    projectId: string;
    companyProject: string;
    activityTitle: string;
    startDate: string;
    endDate: string;
    executor: string[] | null | 'pending';
    status: Status;
    projectType?: ProjectType;
    project_type_id: string;
}

export interface ProjectType {
    id: string;
    name: string;
    parent_id: string | null;
}

export interface DataListType {
    value: string;
    label: string;
    area?: string;
    pre?: string;
}

export interface Country { label: string; value: string; }
export interface Province { label: string; value: string; region: string; }
export interface City {
    value: string;
    label: string;
    codiceCatastale: string;
    cap: string[];
    popolazione: number;
    zona: { codice: string; nome: string; }
}

export interface Company extends Address {
    id: string;
    code_vat: string;
    code_tax: string;
    first_name: string;
    last_name: string;
    type: string;
    code_sdi: string;
    code_ateco: string;
    code_ateco_2: string;
    name: string;
    email: string;
    phone: string;
    pec: string;
    picture?: string;
    licensed_from: string;
    licensed_to: string;
    user_ctx: { is_licensed: boolean };
    data?: CompanyData;
    users?: User[];
    sites?: Site[];
    projects?: Project[];
    collab?: Collaboration[];
    creator?: User;
    created_at: string;
    updated_at: string;
}

export interface Project extends Address {
    id: number;
    name: string;
    first_name?: string;
    company_id: number;
    workspace_id: number;
    last_name?: string;
    email?: string;
    pec?: string;
    code_vat?: string;
    code_tax?: string;
    description: string;
    customer_id: string;
    end_customer_id: string;
    project_stage_id: string;
    starts_at: string;
    ends_at: string;
    company: Company;
    project_type_id: string;
    project_subtype_id: string | null;
    status: string;
    status_text: Status;
    collaborators: Company[];
    creator: User;
    created_at: string;
    updated_at: string;
    info?: { cig?: string; cup?: string };
    user_ctx: {
        is_admin: boolean;
        can_edit: boolean;
        can_invite: boolean;
        is_collaborator: boolean;
        active_collab?: PartnerResponse;
    };
    relations: {
        first_name: string;
        last_name: string;
        email: string;
        pec: string;
        code_vat: string;
        code_tax: string;
        name: string;
        company: Company;
        customer: Company;
        project_type: { key: string };
        project_subtype: object;
        stages: object;
        collaborators: object;
        creator: object;
        attachments: object;
        end_customer: Company;
        workspace: IWorkspace;
    }
}

export interface User extends Partial<Address> {
    id: number;
    role: string;
    first_name: string;
    last_name: string;
    code_tax: string;
    email: string;
    phone: string;
    email_verified_at: string | null;
    data: UserData;
    picture?: string;
    company?: Partial<Company>;
    creator?: Partial<User>;
    can_manage?: boolean;
    created_at: string;
    updated_at: string;
}

export type NewProject = Omit<Project, 'id'>;
export type ProjectApiResponse = GenericPagination<Project>;
export type CompanyApiResponse = GenericPagination<Company>;
export type SiteCompanyApiResponse = GenericPagination<Operational>;
export type UsersCompanyApiResponse = GenericPagination<User>;
export type FileManageApiResponse = GenericPagination<IFile>;
export type TypeApiRespose = GenericPagination<ProjectType>;
export type DataListApiRespose = GenericPagination<DataListType>;
export type GroupStageApiResponse = GenericPagination<ProjectStageGroupResource>;
```

---

## 2. Projects Partners

### Redux Slice: `projectsPartnerSlice.ts`
- **State**: `partners: Partner[] | null`, `ProjectPartnerPagination: IPagination | null`, `isLoading: boolean`, `error: string | null`
- **Actions**: `projectsPartnerStart`, `loadProjectsPartner`, `projectsPartnerError`

### Hook: `useProjectsPartner.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getProjectsPartner(projectId)` | `/project/collab/index?project_id=...` | GET | Lista partner progetto |
| `inviteToCollaborate(body)` | `/project/collab/store` | POST | Invita a collaborare |
| `sendInvitaMail(collabId)` | `/project/collab/invite/{id}` | POST | Invia email invito |
| `acceptInviteMail(collabId)` | `/project/collab/accept/{id}` | POST | Accetta invito |

### Tipi: `projectsPartner.type.ts`
```typescript
export interface Partner {
    id: string;
    role: string;
    invited_at: string;
    accepted_at: string | null;
    declined_at: string | null;
    can_edit: boolean;
    can_invite: boolean;
    company_id: string;
    project_id: string;
    project_stage_id: string;
    relations: { company: Company; project: Project; project_stage: object; creator: Creator };
}

export interface PartnerResponse {
    id: string;
    role: string;
    can_edit: boolean;
    can_invite: boolean;
}

export interface CollabResponse {
    collab: Partner;
    token: string;
}
```

---

## 3. Project Type

### Redux Slice: `projectTypeSlice.ts`
- **State**: `type: ProjectType[] | null`, `isLoading: boolean`, `error: string | null`
- **Actions**: `typeStart`, `loadTypes`, `typesError`

### Hook: `useProjectType.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getProjectTypes()` | `/project/type/index` | GET | Lista tipi progetto |
| `getTypeDetail(id)` | `/project/type/show/{id}` | GET | Dettaglio tipo progetto |

---

## 4. Company

### Redux Slice: `companySlice.ts`
- **State**: `companies: Company[] | null`, `company: Company | null`, `sites: Operational[]`, `users: User[]`, pagination x3, `isLoading`, `error`
- **Actions**: `companiesStart`, `loadCompanies`, `loadSiteCompanies`, `loadUsersCompany`, `addCompany`, `addSiteCompany`, `addUserCompany`, `companySelected`, `companiesError`, `editSiteCompany`, `editCompany`

### Hook: `useCompany.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getCompanies(filter?)` | `/company/index` | GET | Lista aziende |
| `getCompanyById(id)` | `/company/show/{id}?relations=...` | GET | Dettaglio azienda |
| `getSiteCompanies(id)` | `/company/site/index?company_id=...` | GET | Sedi azienda |
| `getUsersCompany(id)` | `/company/user/index?company_id=...` | GET | Utenti azienda |
| `getUsersWithFilter(id, filter)` | `/company/user/index?company_id=...&name=...` | GET | Utenti con filtro |
| `createCompany(body)` | `/company/store` | POST | Crea azienda |
| `createSiteCompany(body)` | `/company/site/store` | POST | Crea sede |
| `createUserCompany(body)` | `/company/user/store` | POST | Crea utente azienda |
| `updateCompany(id, body)` | `/company/store/{id}` | POST | Aggiorna azienda |
| `updateSiteCompany(id, body)` | `/company/site/store/{id}` | POST | Aggiorna sede |

---

## 5. Activities

### Redux Slice: `activitiesSlice.ts`
- **State**: `activities`, `activity`, `activitiesPagination`, `isLoadingActivities`, `error`, `reports`, `report`, `selectedReportSessions`, `reportsPagination`
- **Actions**: `activitiesStart`, `loadActivities`, `loadReports`, `loadReportSession`, `activitiesError`, `addActivity`, `editActivity`, `selectedActivity`, `selectedReport`, `reportsError`, `addReport`, `editReport`

### Hook: `useActivities.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getActivities()` | `/project/stage/index` | GET | Lista attivita |
| `getActivitiesWithFilter(filter)` | `/project/stage/index?...` | GET | Attivita con filtro |
| `getActivityById(id)` | `/project/stage/show/{id}` | GET | Dettaglio attivita |
| `updateActivity(id, body)` | `/project/stage/store/{id}` | POST | Aggiorna attivita |
| `createActivity(body)` | `/project/stage/store` | POST | Crea attivita |
| `getReport(projectId?)` | `/project/task/report/index` | GET | Lista rapportini |
| `getReportFiltered(companyId)` | `/project/task/report/index?company_id=...&has_session=true` | GET | Rapportini filtrati |
| `getReportById(id)` | `/project/task/report/show/{id}` | GET | Dettaglio rapportino |
| `createReport(body)` | `/project/task/report/store` | POST | Crea rapportino |
| `updateReport(id, body)` | `/project/task/report/store/{id}` | POST | Aggiorna rapportino |
| `manageSession(reportId, action)` | `/project/task/report/{id}/session/{action}` | POST | Gestisci sessione (open/close) |

### Tipi: `activities.type.ts`
```typescript
export interface IActivity {
    id: string;
    key: string;
    name: string;
    notes: string;
    starts_at: string;
    ends_at: string;
    project_id: string;
    project_stage_group_id: string;
    status: string;
    status_text: string;
    user_ctx: { is_admin?: boolean; can_edit?: boolean; is_licensed?: boolean };
    relations: {
        project: Project;
        attachments: object;
        collaborators: object;
    };
    nodes: { project: string; parent: string | null };
    created_at: string;
    updated_at: string;
}

export interface IReportApi {
    id: string;
    description: string;
    starts_at: string;
    ends_at: string;
    company_id: string;
    project_id: string;
    project_stage_id: string;
    relations: {
        project: Project;
        project_stage: object;
        company: Company;
        creator: object;
    };
    sessions: SessionReport;
}

export interface SessionReport {
    status: string;
    total_duration: number;
    slots: Slot[];
}

export interface Slot {
    started_at: string;
    ended_at: string | null;
    duration: number;
}
```

---

## 6. File Manager

### Redux Slice: `fileManagerSlice.ts`
- **State**: `files`, `file`, `userFiles`, `companyFiles`, `pagination`, `isLoading`, `spaceUsed`, `error`
- **Actions**: `fileManagerStart`, `loadFile`, `loadOne`, `loadSpaceUsed`, `fileManagerError`, `loadCompanyFiles`, `loadUserFiles`

### Hook: `useFileManager.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getFiles(entityId, key, page?)` | `/attachment/index?attachable_id=...&key=...` | GET | Lista file |
| `getDownloadUrl(id)` | `/attachment/download/{id}` | GET | URL download |
| `getKeyAndUrl(entityId, key, name, mime)` | `/attachment/upload?attachable_id=...` | GET | Presigned URL per upload |
| `uploadToAws(presignedUrl, file, mime)` | `{presignedUrl}` | PUT (fetch) | Upload su S3 |
| `uploadFile(entityId, key, file)` | Composizione di getKeyAndUrl + uploadToAws | - | Upload completo |
| `getSpaceUsed()` | `/attachment/storage` | GET | Spazio utilizzato |
| `deleteFile(id)` | `/attachment/destroy/{id}` | POST | Elimina file |
| `getCompanyFiles(entityId, key)` | `/attachment/index?attachable_id=...&key=...` | GET | File azienda |
| `getUserFiles(entityId, key)` | `/attachment/index?attachable_id=...&key=...` | GET | File utente |

### Tipi: `fileManager.type.ts`
```typescript
export interface FileResource {
    id: string;
    key: string;
    name: string;
    mime: string;
    size: number;
    created_at: string;
    updated_at: string;
    nodes: { attachable: string; creator: string };
}
```

---

## 7. Data List

### Redux Slice: `dataListTypeSlice.ts`
- **State**: `list`, `countries`, `provinces`, `cities`, `company_types`, `isLoading`, `error`
- **Actions**: `dataListStart`, `dataListTypes`, `dataListCoutries`, `dataListProvinces`, `dataListCities`, `dataListCompanyTypes`, `dataListError`

### Hook: `useDataList.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getDataListTypes(name)` | `/data/list/{name}` | GET | Lista dati per nome |
| `getCountries()` | `/data/list/addr_countries` | GET | Lista paesi |
| `getProvinces()` | `/data/list/addr_provinces` | GET | Lista province |
| `getCities()` | `/data/list/addr_cities` | GET | Lista citta |
| `getCompanyTypes()` | `/data/list/company_types` | GET | Tipi azienda |

---

## 8. Group Stage

### Redux Slice: `groupStageSlice.ts`
- **State**: `groups`, `group`, `groupsPagination`, `isLoading`, `error`
- **Actions**: `groupStageStart`, `loadGroupStage`, `addGroupStage`, `editGroupStage`, `deleteGroupStage`, `groupSelected`, `groupStageError`

### Hook: `useGroupStage.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getGroups()` | `/project/stage_group/index` | GET | Lista gruppi fasi |
| `getGroupById(id)` | `/project/stage_group/show/{id}` | GET | Dettaglio gruppo |
| `saveGroup(body)` | `/project/stage_group/store` | POST | Crea/salva gruppo |
| `editGroup(id, body)` | `/project/stage_group/store/{id}` | POST | Modifica gruppo |

### Tipi: `groupStage.type.ts`
```typescript
export interface EditGroupStageResource {
    id: string;
    changes: Partial<ProjectStageGroupResource>;
}

export interface groupStageState {
    groups: ProjectStageGroupResource[] | null;
    group: ProjectStageGroupResource | null;
    groupsPagination: IPagination | null;
    isLoading: boolean;
    error: string | null;
}
```

**Nota**: `ProjectStageGroupResource` era definito in `src/components/panels/groupPanel/groupPanel.type.ts`:
```typescript
export interface ProjectStageGroupResource {
    id: string;
    name: string;
    key: string;
    notes: string;
    status: string;
    status_text: string;
    project_id: string;
    parent_id: string | null;
    starts_at: string;
    ends_at: string;
    user_ctx: { is_admin?: boolean; can_edit?: boolean };
    nodes: { project: string; parent: string | null };
    relations: { project: Project; stages: IActivity[] };
}
```

---

## 9. Workspace

### Redux Slice: `workspaceSlice.ts`
- **State**: `workspaces`, `workspace`, `WorkspacePagination`, `isLoading`, `error`
- **Actions**: `setWorkspaces`, `addWorkspace`, `editWorkspace`, `deleteWorkspace`, `workspaceSelected`

### Hook: `useWorkSpace.ts`
| Funzione | Endpoint | Metodo | Descrizione |
|----------|----------|--------|-------------|
| `getWorkspaces(filters?)` | `/workspace/index` | GET | Lista workspace |
| `getWorkspaceById(id)` | `/workspace/show/{id}` | GET | Dettaglio workspace |
| `createWorkspace(body)` | `/workspace/store` | POST | Crea workspace |
| `updateWorkspace(id, body)` | `/workspace/store/{id}` | POST | Aggiorna workspace |
| `removeWorkspace(id)` | `/workspace/destroy/{id}` | POST | Elimina workspace |

### Tipi: `workspace.type.ts`
```typescript
export interface IWorkspace {
    id: string;
    name: string;
    description: string;
    company_id: string;
    end_customer_id: string;
    project_type_id: string;
    relations: {
        company: Company;
        end_customer: Company;
        project_type: ProjectType;
        projects: Project[];
    };
    created_at: string;
    updated_at: string;
}

export interface WorkspaceState {
    workspaces: IWorkspace[] | null;
    workspace: IWorkspace | null;
    WorkspacePagination: IPagination | null;
    isLoading: boolean;
    error: string | null;
}

export interface WorkSpaceFilters {
    name?: string;
    status?: string;
}
```

---

## 10. Pagination

### Hook: `usePagination.ts`
```typescript
export const usePagination = () => {
    const { get } = useApiClient();

    const getPagination = async (url: string) => {
        // Splitta l'URL per estrarre il path dopo 'api'
        // Usa GET per fetch della pagina successiva
        const response = await get(path);
        return { data: response };
    };

    return { getPagination };
};
```

---

## 11. Pagine Rimosse

| Pagina | Path | Descrizione |
|--------|------|-------------|
| `Activities` | `/activities` | Lista attivita |
| `Activity` | componente di dettaglio | Dettaglio attivita |
| `Calendar` | `/calendar` | Vista calendario |
| `Projects` | `/projects` | Lista progetti |
| `Project` | `/workspace/:wsId/project/:pId` | Dettaglio progetto |
| `ProjectEdit` | `/workspace/:wsId/project/:pId/edit` | Modifica progetto |
| `Folder` | `/workspace/:wsId/project/:pId/stage/:gId` | Cartella/Fase |
| `Workspaces` | `/workspaces` | Lista workspace |
| `Workspace` | `/workspace/:wsId` | Dettaglio workspace |
| `CompanyPartners` | `/companies` | Nominativi/Partner |
| `CreatePartner` | `/companies/partner/new` | Crea partner |
| `InvitationPage` | `/invitation`, `/collab/:collabId` | Pagina invito |
| `MyCompany` | `/myCompany` | La mia azienda |
| `CompanyUser` | `/myCompany/users` | Utenti azienda |

---

## 12. Componenti Rimossi

### `src/components/panels/`
- `activityDetailPanel/` - Pannello dettaglio attivita
- `activityPanel/` - Pannello attivita
- `fileManagerPanel/` - Gestore file
- `generalPanel/` - Pannello generale progetto
- `groupPanel/` - Pannello gruppi/fasi
- `partnerPanel/` - Pannello partner
- `reportPanel/` - Pannello rapportini

### `src/components/tabs/`
- `CalendarTab/` - Tab calendario
- `activityTab/` - Tab attivita
- `reportTab/` - Tab rapportini
- `ganttTab/` - Tab Gantt

### `src/components/entitySelector/`
- `EntitySelector.tsx` - Selettore anagrafica (usato da superadmin)

### `src/components/draggableButton/`
- `DraggableButton.tsx` - FAB draggabile (usato da superadmin)
