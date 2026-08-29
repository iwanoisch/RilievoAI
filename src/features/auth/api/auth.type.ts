import {User} from "../slice/auth.type.ts";
import {Company} from "../../../types/shared.type.ts";

export interface LoginResponse {
    user: User;
    token: string;
}

export interface Token {
    token: string
}

export interface InvitationResponse {
    collab: Collab;
    token: string;
}

export interface Collab {
    id: number;
    role: string;
    invited_at: string;
    accepted_at: string | null;
    declined_at: string | null;
    company_id: number;
    project_id: number;
    project_stage_id: number;
    nodes: {
        company: string;
        project: string;
        project_stage: string;
    };
    relations: Relations;
}

interface Relations {
    company: Company;
    project: object;
    project_stage: ProjectStage;
    creator: User;
}

export interface ProjectStage {
    id: number;
    key: string;
    name: string;
    notes: string;
    starts_at: string;
    ends_at: string;
    project_id: number;
    parent_id: number | null;
    status: string;
    status_text: string;
    user_ctx: UserContext;
    nodes: Nodes;
    relations: [];
}

export interface UserContext {
    is_licensed?: boolean;
    is_admin?: boolean;
    can_edit?: boolean;
}

interface Nodes {
    [key: string]: string | null;
}
