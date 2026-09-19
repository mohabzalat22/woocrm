import { Role } from "./roles";

export enum Permission {
  // Inbox
  INBOX_VIEW_OWN = "inbox:view_own",
  INBOX_VIEW_ALL = "inbox:view_all",
  INBOX_SEND_MESSAGE = "inbox:send_message",
  INBOX_ASSIGN = "inbox:assign",
  INBOX_REASSIGN = "inbox:reassign",
  INBOX_TAG = "inbox:tag",
  INBOX_DELETE = "inbox:delete",
  INBOX_ADD_NOTE = "inbox:add_note",

  // Contacts
  CONTACT_VIEW = "contact:view",
  CONTACT_EDIT = "contact:edit",
  CONTACT_DELETE = "contact:delete",
  CONTACT_IMPORT = "contact:import",
  CONTACT_EXPORT = "contact:export",
  CONTACT_MERGE = "contact:merge",

  // Deals
  DEAL_VIEW_OWN = "deal:view_own",
  DEAL_VIEW_ALL = "deal:view_all",
  DEAL_EDIT = "deal:edit",
  DEAL_CHANGE_STAGE = "deal:change_stage",
  DEAL_DELETE = "deal:delete",
  DEAL_ASSIGN = "deal:assign",

  // Automation
  AUTOMATION_VIEW = "automation:view",
  AUTOMATION_MANAGE = "automation:manage",

  // Reports
  REPORTS_VIEW_OWN = "reports:view_own",
  REPORTS_VIEW_TEAM = "reports:view_team",
  REPORTS_EXPORT = "reports:export",

  // Team
  TEAM_VIEW = "team:view",
  TEAM_MANAGE = "team:manage", // invite/remove/edit roles
  TEAM_VIEW_AUDIT_LOG = "team:view_audit_log",

  // Workspace administration
  WORKSPACE_MANAGE = "workspace:manage",

  // Settings
  SETTINGS_VIEW = "settings:view",
  SETTINGS_EDIT = "settings:edit",
  SETTINGS_MANAGE_TEMPLATES = "settings:manage_templates",

  // Billing
  BILLING_MANAGE = "billing:manage",
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // full access

  [Role.MANAGER]: [
    Permission.INBOX_VIEW_OWN,
    Permission.INBOX_VIEW_ALL,
    Permission.INBOX_SEND_MESSAGE,
    Permission.INBOX_ASSIGN,
    Permission.INBOX_REASSIGN,
    Permission.INBOX_TAG,
    Permission.INBOX_ADD_NOTE,
    Permission.CONTACT_VIEW,
    Permission.CONTACT_EDIT,
    Permission.CONTACT_DELETE,
    Permission.CONTACT_IMPORT,
    Permission.CONTACT_EXPORT,
    Permission.CONTACT_MERGE,
    Permission.DEAL_VIEW_OWN,
    Permission.DEAL_VIEW_ALL,
    Permission.DEAL_EDIT,
    Permission.DEAL_CHANGE_STAGE,
    Permission.DEAL_DELETE,
    Permission.DEAL_ASSIGN,
    Permission.AUTOMATION_VIEW,
    Permission.AUTOMATION_MANAGE,
    Permission.REPORTS_VIEW_OWN,
    Permission.REPORTS_VIEW_TEAM,
    Permission.REPORTS_EXPORT,
    Permission.TEAM_VIEW,
    Permission.TEAM_VIEW_AUDIT_LOG,
    Permission.SETTINGS_MANAGE_TEMPLATES,
  ],

  [Role.AGENT]: [
    Permission.INBOX_VIEW_OWN,
    Permission.INBOX_SEND_MESSAGE,
    Permission.INBOX_TAG,
    Permission.INBOX_ADD_NOTE,
    Permission.CONTACT_VIEW,
    Permission.CONTACT_EDIT,
    Permission.DEAL_VIEW_OWN,
    Permission.DEAL_EDIT,
    Permission.DEAL_CHANGE_STAGE,
    Permission.REPORTS_VIEW_OWN,
  ],
};
