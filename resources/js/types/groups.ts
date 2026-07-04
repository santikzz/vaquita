export interface MemberData {
    uuid: string;
    display_name: string;
    avatar?: string | null;
    payment_alias?: string | null;
    is_guest: boolean;
    is_active: boolean;
    is_me: boolean;
    role: 'owner' | 'member';
}

export interface GroupData {
    uuid: string;
    name: string;
    currency: string;
    invite_code: string;
    is_owner: boolean;
}

export interface GroupListItem {
    uuid: string;
    name: string;
    currency: string;
    is_owner: boolean;
    open_events_count: number;
    members: MemberData[];
}

export interface EventListItem {
    uuid: string;
    name: string;
    event_date: string;
    status: 'open' | 'settled';
    participants_count: number;
    total_minor: number;
}

export interface EventData {
    uuid: string;
    name: string;
    event_date: string;
    status: 'open' | 'settled';
    can_manage: boolean;
}

export interface ExpenseShareData {
    member_uuid: string;
    amount_minor: number;
    share_units: number | null;
}

export interface ExpenseData {
    uuid: string;
    description: string;
    amount_minor: number;
    split_method: 'equal' | 'amounts' | 'shares';
    spent_at: string;
    payer: { uuid: string; display_name: string };
    shares: ExpenseShareData[];
}

export interface SettlementData {
    uuid: string;
    amount_minor: number;
    note: string | null;
    settled_at: string;
    from: { uuid: string; display_name: string };
    to: { uuid: string; display_name: string };
}

export interface BalanceData {
    member_uuid: string;
    amount_minor: number;
}

export interface TransferData {
    from_member_uuid: string;
    to_member_uuid: string;
    amount_minor: number;
}
