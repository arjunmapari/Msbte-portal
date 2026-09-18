import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const FB = {
  apiKey: "AIzaSyAaK9_I9C9QnRuO4aremUZRO2PK0pZzy7M",
  authDomain: "msbte-portal.firebaseapp.com",
  projectId: "msbte-portal",
  storageBucket: "msbte-portal.firebasestorage.app",
  messagingSenderId: "323814955101",
  appId: "1:323814955101:web:cc822a96619e7c281695b4",
  measurementId: "G-JWNP2KL7JX",
};

const app = getApps().length === 0 ? initializeApp(FB) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);

/* ── Papers ── */
export const fbLoad = async () => {
  const snap = await getDocs(query(collection(db, 'papers'), orderBy('ts', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const fbAdd = async (data) => {
  const r = await addDoc(collection(db, 'papers'), { ...data, ts: Date.now() });
  return { id: r.id, ...data, ts: Date.now() };
};
export const fbDel = async (id) => {
  await deleteDoc(doc(db, 'papers', id));
};

/* ── Manual subjects ── */
export const fbLoadManual = async (br, s) => {
  const snap = await getDocs(query(collection(db, 'manualSubjects'), where('branch', '==', br), where('sem', '==', s)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const fbAddManual = async (data) => {
  const r = await addDoc(collection(db, 'manualSubjects'), { ...data, ts: Date.now() });
  return { id: r.id, ...data };
};
export const fbUpdateManual = async (id, data) => {
  await updateDoc(doc(db, 'manualSubjects', id), data);
};
export const fbDelManual = async (id) => {
  await deleteDoc(doc(db, 'manualSubjects', id));
};

/* ── Manual PDFs ── */
export const fbLoadMPdf = async (br, s) => {
  const snap = await getDocs(query(collection(db, 'manualPdfs'), where('branch', '==', br), where('sem', '==', s)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const fbAddMPdf = async (data) => {
  const r = await addDoc(collection(db, 'manualPdfs'), { ...data, ts: Date.now() });
  return { id: r.id, ...data };
};
export const fbUpdateMPdf = async (id, data) => {
  await updateDoc(doc(db, 'manualPdfs', id), data);
};
export const fbDelMPdf = async (id) => {
  await deleteDoc(doc(db, 'manualPdfs', id));
};

/* ── Syllabus ── */
export const fbLoadSyl = async (br, s) => {
  const snap = await getDocs(query(collection(db, 'syllabus'), where('branch', '==', br), where('sem', '==', s)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.subjectCode || '').localeCompare(b.subjectCode || ''));
};
export const fbAddSyl = async (data) => {
  const r = await addDoc(collection(db, 'syllabus'), { ...data, ts: Date.now() });
  return { id: r.id, ...data, ts: Date.now() };
};
export const fbDelSyl = async (id) => {
  await deleteDoc(doc(db, 'syllabus', id));
};
export const fbUpdateSyl = async (id, data) => {
  await updateDoc(doc(db, 'syllabus', id), data);
};
