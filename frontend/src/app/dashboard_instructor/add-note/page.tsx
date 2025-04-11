import type { Metadata } from "next";
import { SendNotificationForm } from "../../../components/dashboard_instructor/SendNotificationForm";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Send Notifications",
  description: "Send notifications to students",
};

export default function SendNotificationPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg shadow-md border border-[#D0E8FF]">
        <h1 className="mb-4 text-3xl font-bold text-[#004E8C]">
          Send Notification
        </h1>
        <p className="mb-6 text-gray-600">
          Use this form to send a notification to a specific student or an
          entire track.
        </p>
        <SendNotificationForm />
      </div>
    </div>
  );
}
