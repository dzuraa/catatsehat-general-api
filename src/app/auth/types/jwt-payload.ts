export type JwtPayload = {
  email: string;
  id: string;
  name: string;
  phone: string;
  type: 'SUPER_ADMIN' | 'KADER';
  as: 'ADMIN' | 'USER';
};
