'use client';

import DashboardLayout from "@/components/superAdmin/DashboardLayout";
import MembersPageMain from "@/components/superAdmin/members/MembersPageMain";

const AdminMembersPage = () => {
  return (
    <DashboardLayout>
      <MembersPageMain />
    </DashboardLayout>
  );
};

export default AdminMembersPage;
