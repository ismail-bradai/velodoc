   // calc hash of password
  import bcrypt from 'bcrypt';
  const hash_pwd = bcrypt.hashSync('helloworld', 10);
  console.log('Hashed password:', hash_pwd);

export const users = [
  {
    id: 1,
    username: 'ADMIN',
    password: hash_pwd,
    name: 'SUPER ADMIN',
    email: 'admin@velodoc.ai',
    role: 'admin'
  },
  {
    id: 2,
    username: 'RCM',
    password: hash_pwd,
    name: 'RCM REP',
    email: 'rcm@velodoc.ai',
    role: 'rcm'
  },
  {
    id: 3,
    username: 'DOCTOR',
    password: hash_pwd,
    name: 'Dr. Nadia',
    email: 'dr@velodoc.ai',
    role: 'doctor'
  }
];

export const findUserByUsernameOrEmail = (username: string) =>
  users.find((u) => u.username === username || u.email === username);

export const findUserById = (id: any) =>
  users.find((u) => u.id === id);
