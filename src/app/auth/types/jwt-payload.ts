export type JwtPayload = {
  email: string;
  id: string;
  name: string;
  phone: string;
  healthPostId: string;
  type: 'SUPER_ADMIN' | 'KADER';
  as: 'ADMIN' | 'USER';
};
