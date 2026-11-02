import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backend, api, seed } from './helpers/convex.mjs';

const pdf = (fileId, createdBy = 'one@example.com') => ({
  fileId, createdBy, fileName: `${fileId}.pdf`, storageId: 'storage-placeholder', fileUrl: `https://example.com/${fileId}.pdf`,
});
const pyq = (fileId, semester, subject) => ({
  ...pdf(fileId), semester, subject, uploadedBy: 'student@example.com',
});
function pyqArgs(fileId, semester, subject) {
  const { createdBy, ...args } = pyq(fileId, semester, subject);
  return args;
}

test('PDF metadata persists and user listing filters files by creator', async () => {
  const t = backend();
  await t.mutation(api.fileStorage.AddFileEntryToDb, pdf('one'));
  await t.mutation(api.fileStorage.AddFileEntryToDb, pdf('two', 'two@example.com'));
  const files = await t.query(api.fileStorage.GetUserFiles, { userEmail: 'one@example.com' });
  assert.deepEqual(files.map(f => f.fileId), ['one']);
  assert.equal(files[0].fileName, 'one.pdf');
  assert.equal(files[0].fileUrl, 'https://example.com/one.pdf');
  assert.deepEqual(await t.query(api.fileStorage.GetUserFiles, { userEmail: 'missing@example.com' }), []);
});

test('PDF lookup does not fall back to another file when the requested ID is absent', async () => {
  const t = backend();
  await seed(t, 'pdfFiles', [pdf('one'), pdf('two')]);
  assert.equal((await t.query(api.fileStorage.getFileRecord, { fileId: 'two' })).fileName, 'two.pdf');
  assert.equal(await t.query(api.fileStorage.getFileRecord, { fileId: 'missing' }), null);
});

test('file storage returns a URL for a stored blob and can allocate an upload URL', async () => {
  const t = backend();
  const storageId = await t.run(ctx => ctx.storage.store(new Blob(['PDF fixture'], { type: 'application/pdf' })));
  const url = await t.mutation(api.fileStorage.getFileUrl, { storageId });
  assert.equal(typeof url, 'string');
  assert.ok(URL.canParse(url));
  const uploadUrl = await t.mutation(api.fileStorage.generateUploadUrl, {});
  assert.ok(URL.canParse(uploadUrl));
});

test('notes save then update without duplicate records or changes to other files', async () => {
  const t = backend();
  const args = { fileId: 'one', createdBy: 'one@example.com', notes: '<p>First</p>' };
  await t.mutation(api.notes.AddNotes, args);
  await t.mutation(api.notes.AddNotes, { ...args, fileId: 'two', notes: '<p>Other</p>' });
  await t.mutation(api.notes.AddNotes, { ...args, notes: '<h2>Updated</h2><ul><li>Point</li></ul>' });
  assert.equal(await t.query(api.notes.GetNotes, { fileId: 'one' }), '<h2>Updated</h2><ul><li>Point</li></ul>');
  assert.equal(await t.query(api.notes.GetNotes, { fileId: 'two' }), '<p>Other</p>');
  assert.equal((await t.run(ctx => ctx.db.query('notes').collect())).length, 2);
});

test('missing notes return null and intentionally empty notes can be saved', async () => {
  const t = backend();
  assert.equal(await t.query(api.notes.GetNotes, { fileId: 'missing' }), null);
  await t.mutation(api.notes.AddNotes, { fileId: 'empty', createdBy: 'one@example.com', notes: '' });
  assert.equal(await t.query(api.notes.GetNotes, { fileId: 'empty' }), '');
});

test('PYQ upload preserves classification and records an upload timestamp', async () => {
  const t = backend();
  const before = Date.now();
  const id = await t.mutation(api.pyqStorage.AddPyqFileEntryToDb, pyqArgs('sql', 'Semester 3', 'DBMS'));
  const record = await t.run(ctx => ctx.db.get(id));
  assert.equal(record.fileId, 'sql');
  assert.equal(record.semester, 'Semester 3');
  assert.equal(record.subject, 'DBMS');
  assert.equal(record.uploadedBy, 'student@example.com');
  assert.ok(record.uploadedAt >= before && record.uploadedAt <= Date.now());
});

test('PYQ filters support semester, subject, both, and no matches', async () => {
  const t = backend();
  for (const args of [pyqArgs('a', '3', 'DBMS'), pyqArgs('b', '3', 'OS'), pyqArgs('c', '4', 'DBMS')]) {
    await t.mutation(api.pyqStorage.AddPyqFileEntryToDb, args);
  }
  for (const [filter, expected] of [
    [{}, ['a', 'b', 'c']], [{ semester: '3' }, ['a', 'b']],
    [{ subject: 'DBMS' }, ['a', 'c']], [{ semester: '3', subject: 'DBMS' }, ['a']],
    [{ semester: '9' }, []],
  ]) {
    const records = await t.query(api.pyqStorage.GetPyqFilesByFilter, filter);
    assert.deepEqual(records.map(r => r.fileId).sort(), expected);
  }
});

test('PYQ lists newest uploads first and exposes sorted unique filter options', async () => {
  const t = backend();
  for (const args of [pyqArgs('a', '4', 'OS'), pyqArgs('b', '3', 'DBMS'), pyqArgs('c', '3', 'DBMS')]) {
    await t.mutation(api.pyqStorage.AddPyqFileEntryToDb, args);
  }
  assert.deepEqual((await t.query(api.pyqStorage.GetAllPyqFiles, {})).map(r => r.fileId), ['c', 'b', 'a']);
  assert.deepEqual(await t.query(api.pyqStorage.GetUniqueSemesters, {}), ['3', '4']);
  assert.deepEqual(await t.query(api.pyqStorage.GetUniqueSubjects, {}), ['DBMS', 'OS']);
  assert.deepEqual(await t.query(api.pyqStorage.GetUniqueSubjects, { semester: '3' }), ['DBMS']);
});

test('malformed backend arguments are rejected before writing data', async () => {
  const t = backend();
  await assert.rejects(t.mutation(api.pyqStorage.AddPyqFileEntryToDb, { ...pyqArgs('invalid', '3', 'DBMS'), semester: 3 }));
  await assert.rejects(t.mutation(api.notes.AddNotes, { fileId: 'one', notes: 'Missing creator' }));
  assert.deepEqual(await t.run(ctx => ctx.db.query('pyqFiles').collect()), []);
  assert.deepEqual(await t.run(ctx => ctx.db.query('notes').collect()), []);
});
