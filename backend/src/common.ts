import crypto from 'crypto';

export function randomString(length: number) {
  const id = crypto.randomBytes(length).toString('hex');
  return id;
}