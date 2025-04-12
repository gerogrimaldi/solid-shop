export const jwtConstants = {
    accessSecret: process.env.JWT_SECRET || 'supersecret',
    refreshSecret: process.env.JWT_SECRET2 || 'supersecret2',
    accessExpiresIn: '1h',
    refreshExpiresIn: '3h',
    accessExpiresInMs: 30 * 60 * 1000,   // 30 minutos en ms
    refreshExpiresInMs: 3 * 60 * 60 * 1000, // 3 horas en ms
  };