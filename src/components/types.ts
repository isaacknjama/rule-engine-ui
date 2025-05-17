export interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export interface Chama {
  id: string;
  name: string;
  members: Member[];
  walletId: string;
  description: string;
  templates?: ChamaTemplate[];
}

export interface Rule {
  id: string;
  name: string;
  actionType: 'notification' | 'reminder' | 'payment';
  triggerPeriod: 'daily' | 'weekly' | 'monthly' | string;
  members: string[];
  conditions: string;
}

export interface ChamaTemplate {
  id: string;
  name: string;
  description: string;
  rules: Rule[];
}
