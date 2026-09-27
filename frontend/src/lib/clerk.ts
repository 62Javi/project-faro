export type Role = 'dueño' | 'mozo' | 'cocina' | 'cliente';

export interface UserSession {
  userId: string;
  name: string;
  role: Role;
  restaurantId: string;
}

export const defaultDemoUser: UserSession = {
  userId: 'user_faro_owner',
  name: 'Esteban (Propietario)',
  role: 'dueño',
  restaurantId: 'rest_faro_demo',
};
