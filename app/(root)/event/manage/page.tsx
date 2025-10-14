import React, { Suspense } from "react";
import ManageEvent from "./ManageEvent";

const ManageEventPage = () => {
  return (
    <Suspense fallback={<div className="w-full min-h-screen">Loading...</div>}>
      <ManageEvent />
    </Suspense>
  );
};

export default ManageEventPage;
