import type { Metadata } from "next";
import { SendNotificationForm } from "../../../components/dashboard_instructor/SendNotificationForm";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Send Notifications",
  description: "Send notifications to students",
};

export default function SendNotificationPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-[#f0f7ff]'>
      <div className='container px-4 py-8'>
        <div className='flex flex-col md:flex-row justify-between items-start gap-8'>
          {/* Left sidebar with info */}
          <div className='w-full md:w-1/3 lg:w-1/4'>
            <div className='sticky top-8'>
              <h1 className='text-3xl font-bold text-[#007acc] mb-3'>
                Notifications
              </h1>
              <div className='h-1 w-20 bg-[#007acc] mb-6'></div>

              <div className='bg-white rounded-xl shadow-md p-6 border-l-4 border-[#007acc] mb-6'>
                <h2 className='text-xl font-semibold text-[#007abc] mb-3'>
                  Send Messages
                </h2>
                <p className='text-gray-600 mb-4'>
                  Use this form to communicate with your students. You can send
                  notifications to:
                </p>
                <ul className='space-y-2 text-gray-600'>
                  <li className='flex items-center gap-2'>
                    <span className='h-2 w-2 rounded-full bg-[#007acc]'></span>
                    Individual students
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='h-2 w-2 rounded-full bg-[#007acc]'></span>
                    Entire tracks or groups
                  </li>
                </ul>
              </div>

              <div className='bg-[#c7e5ff]/30 rounded-xl p-6'>
                <h3 className='text-lg font-medium text-[#007abc] mb-2'>
                  Tips
                </h3>
                <ul className='space-y-3 text-sm text-gray-600'>
                  <li className='flex items-start gap-2'>
                    <span className='text-[#007acc] font-bold'>•</span>
                    <span>
                      Select a predefined message or write a custom one to save
                      time.
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-[#007acc] font-bold'>•</span>
                    <span>
                      Choose the recipient carefully: an individual student or
                      an entire track.
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-[#007acc] font-bold'>•</span>
                    <span>
                      Ensure your message is clear, as it will be sent via email
                      and dashboard.
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-[#007acc] font-bold'>•</span>
                    <span>
                      Add new predefined messages for quick access in the
                      future.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className='w-full md:w-2/3 lg:w-3/4'>
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='bg-[#007acc] px-8 py-5'>
                <h2 className='text-2xl font-bold text-white'>
                  Create Notification
                </h2>
                <p className='text-[#c7e5ff] mt-1'>
                  Reach out to your students
                </p>
              </div>

              <div className='p-8'>
                <SendNotificationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
