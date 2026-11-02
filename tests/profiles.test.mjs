import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backend, api, seed, user } from './helpers/convex.mjs';

test('first sign-in creates one incomplete profile; repeat sign-in does not overwrite it', async () => {
  const t = backend();
  const args = user('student@example.com');
  await t.mutation(api.user.createuser, args);
  await t.mutation(api.user.createuser, { ...args, userName: 'Changed' });
  const users = await t.run(ctx => ctx.db.query('users').collect());
  assert.equal(users.length, 1);
  assert.equal(users[0].userName, args.userName);
  assert.equal(users[0].isProfileComplete, false);
  assert.equal(typeof users[0].joinedAt, 'number');
});

test('profile lookup returns the requested user or null', async () => {
  const t = backend();
  await seed(t, 'users', [user('one@example.com'), user('two@example.com')]);
  assert.equal((await t.query(api.userProfiles.getUserProfile, { email: 'two@example.com' })).email, 'two@example.com');
  assert.equal(await t.query(api.userProfiles.getUserProfile, { email: 'missing@example.com' }), null);
});

test('profile completion requires name, department, and batch', async () => {
  const t = backend();
  const email = 'student@example.com';
  await seed(t, 'users', [user(email)]);
  await t.mutation(api.userProfiles.updateUserProfile, { email, name: 'Student', department: 'CSE' });
  assert.equal((await t.query(api.userProfiles.getUserProfile, { email })).isProfileComplete, false);
  await t.mutation(api.userProfiles.updateUserProfile, {
    email, name: 'Student', department: 'CSE', batch: '2027', expertise: ['Python'], bio: 'AI enthusiast',
  });
  const profile = await t.query(api.userProfiles.getUserProfile, { email });
  assert.equal(profile.isProfileComplete, true);
  assert.deepEqual(profile.expertise, ['Python']);
  assert.equal(profile.bio, 'AI enthusiast');
});

test('updating a nonexistent profile fails without inserting a user', async () => {
  const t = backend();
  await assert.rejects(t.mutation(api.userProfiles.updateUserProfile, { email: 'missing@example.com', name: 'Missing' }), /User not found/);
  assert.deepEqual(await t.run(ctx => ctx.db.query('users').collect()), []);
});

test('community includes only complete profiles; department and batch filters compose with completion', async () => {
  const t = backend();
  await seed(t, 'users', [
    user('cse@example.com', { department: 'CSE', batch: '2027', isProfileComplete: true }),
    user('ece@example.com', { department: 'ECE', batch: '2028', isProfileComplete: true }),
    user('hidden@example.com', { department: 'CSE', batch: '2027', isProfileComplete: false }),
  ]);
  assert.equal((await t.query(api.userProfiles.getAllUsers, {})).length, 2);
  assert.deepEqual((await t.query(api.userProfiles.getUsersByDepartment, { department: 'CSE' })).map(u => u.email), ['cse@example.com']);
  assert.deepEqual((await t.query(api.userProfiles.getUsersByBatch, { batch: '2028' })).map(u => u.email), ['ece@example.com']);
});

test('expertise discovery is case-insensitive, supports substrings, and excludes incomplete profiles', async () => {
  const t = backend();
  await seed(t, 'users', [
    user('match@example.com', { expertise: ['PyTorch'], isProfileComplete: true }),
    user('other@example.com', { expertise: ['SQL'], isProfileComplete: true }),
    user('empty@example.com', { isProfileComplete: true }),
    user('hidden@example.com', { expertise: ['PyTorch'], isProfileComplete: false }),
  ]);
  const users = await t.query(api.userProfiles.searchUsersByExpertise, { expertise: 'TORCH' });
  assert.deepEqual(users.map(u => u.email), ['match@example.com']);
});

test('recommendations exclude self and incomplete users and rank by shared skills', async () => {
  const t = backend();
  await seed(t, 'users', [
    user('me@example.com', { expertise: ['Python', 'SQL'], isProfileComplete: true }),
    user('one@example.com', { expertise: ['python'], isProfileComplete: true }),
    user('two@example.com', { expertise: ['PYTHON', 'sql'], isProfileComplete: true }),
    user('none@example.com', { expertise: ['Java'], isProfileComplete: true }),
    user('hidden@example.com', { expertise: ['Python', 'SQL'], isProfileComplete: false }),
  ]);
  const users = await t.query(api.userProfiles.getRecommendedUsers, { userEmail: 'me@example.com' });
  assert.deepEqual(users.map(u => u.email), ['two@example.com', 'one@example.com']);
});

test('recommendations handle missing users and absent or empty skill lists', async () => {
  const t = backend();
  await seed(t, 'users', [user('no-skills@example.com'), user('empty@example.com', { expertise: [] })]);
  for (const userEmail of ['missing@example.com', 'no-skills@example.com', 'empty@example.com']) {
    assert.deepEqual(await t.query(api.userProfiles.getRecommendedUsers, { userEmail }), []);
  }
});
