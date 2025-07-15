export type User = {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};

export const mockUsers: User[] = [
  {
    id: 1,
    fullName: "Andi Budianto",
    email: "andi.b@example.com",
    role: "admin",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    fullName: "Citra Lestari",
    email: "citra.l@example.com",
    role: "user",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: 3,
    fullName: "Doni Firmansyah",
    email: "doni.f@example.com",
    role: "user",
    createdAt: "2024-03-05T09:00:00Z",
  },
  {
    id: 4,
    fullName: "Eka Wijaya",
    email: "eka.w@example.com",
    role: "user",
    createdAt: "2024-04-10T08:15:00Z",
  },
  {
    id: 5,
    fullName: "Fitriani Sari",
    email: "fitriani.s@example.com",
    role: "user",
    createdAt: "2024-05-22T11:20:00Z",
  },
  {
    id: 6,
    fullName: "Guntur Perkasa",
    email: "guntur.p@example.com",
    role: "admin",
    createdAt: "2024-06-30T16:45:00Z",
  },
  {
    id: 7,
    fullName: "Hesti Puspita",
    email: "hesti.p@example.com",
    role: "user",
    createdAt: "2024-08-01T09:15:00Z",
  },
  {
    id: 8,
    fullName: "Indra Gunawan",
    email: "indra.g@example.com",
    role: "user",
    createdAt: "2024-10-19T13:00:00Z",
  },
  {
    id: 9,
    fullName: "Joko Susilo",
    email: "joko.s@example.com",
    role: "user",
    createdAt: "2024-12-25T20:00:00Z",
  },
  {
    id: 10,
    fullName: "Kartika Dewi",
    email: "kartika.d@example.com",
    role: "user",
    createdAt: "2025-01-20T10:30:00Z",
  },
  {
    id: 11,
    fullName: "Lia Ramadhani",
    email: "lia.r@example.com",
    role: "user",
    createdAt: "2025-03-11T14:00:00Z",
  },
  {
    id: 12,
    fullName: "Mega Utami",
    email: "mega.u@example.com",
    role: "user",
    createdAt: "2025-05-02T18:10:00Z",
  },
  {
    id: 13,
    fullName: "Naufal Hidayat",
    email: "naufal.h@example.com",
    role: "user",
    createdAt: "2025-07-07T07:05:00Z",
  },
];

