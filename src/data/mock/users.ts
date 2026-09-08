import type { Role, User } from "@/types";

export const INITIAL_USERS: User[] = [
  { id: "u1", name: "Abebe Kebede", email: "abebe.kebede@mor.gov.et", role: "course_owner", department: "Course Development" },
  { id: "u2", name: "Tigist Alemu", email: "tigist.alemu@mor.gov.et", role: "content_approver", department: "Content Quality Assurance" },
  { id: "u3", name: "Hailemariam Dessalegn", email: "hailemariam.dessalegn@mor.gov.et", role: "training_admin", department: "MoR Learning Academy" },
  { id: "u4", name: "Daniel Bekele", email: "daniel.bekele@mor.gov.et", role: "trainer", department: "Tax Training" },
  { id: "u5", name: "Sara Tesfaye", email: "sara.tesfaye@tax.gov.et", role: "learner", department: "Taxpayer Services" },
  { id: "u6", name: "Yonas Girma", email: "yonas.girma@mor.gov.et", role: "system_admin", department: "ICT & Systems" },
  { id: "u7", name: "Meron Tadesse", email: "meron.tadesse@mor.gov.et", role: "trainer", department: "Customs Training" },
  { id: "u8", name: "Dawit Haile", email: "dawit.haile@tax.gov.et", role: "learner", department: "Taxpayer Services" },
  { id: "u9", name: "Liya Molla", email: "liya.molla@tax.gov.et", role: "learner", department: "Taxpayer Services" },
  { id: "u10", name: "Samuel Getachew", email: "samuel.getachew@trade.gov.et", role: "learner", department: "Customs Clearance" },
  { id: "u11", name: "Bethlehem Assefa", email: "bethlehem.assefa@mor.gov.et", role: "learner", department: "Excise Directorate" },
  { id: "u12", name: "Nahom Abate", email: "nahom.abate@trade.gov.et", role: "learner", department: "Customs Clearance" },
  { id: "u13", name: "Hana Alemu", email: "hana.alemu@tax.gov.et", role: "learner", department: "Taxpayer Services" },
  { id: "u14", name: "Feven Tekle", email: "feven.tekle@mor.gov.et", role: "learner", department: "Compliance" },
];

export const DEMO_USER_BY_ROLE: Record<Role, string> = {
  course_owner: "u1",
  content_approver: "u2",
  training_admin: "u3",
  trainer: "u4",
  learner: "u5",
  system_admin: "u6",
};

export function getUser(users: User[], id: string): User | undefined {
  return users.find((user) => user.id === id);
}

export function userName(users: User[], id: string): string {
  return getUser(users, id)?.name ?? "Unknown";
}