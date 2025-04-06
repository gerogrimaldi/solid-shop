export const jwtConstants = {
    accessSecret: process.env.JWT_SECRET || 'supersecret',
    refreshSecret: process.env.JWT_SECRET2 || 'supersecret2',
    accessExpiresIn: '30m',
    refreshExpiresIn: '3h',
  };