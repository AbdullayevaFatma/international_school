import Card from "@/components/Card";
import FinanceChart from "@/components/FinanceChart";
import Announcements from "@/components/Announcements";
import CountChartContainer from "@/components/CountChartContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import { EventCalendarContainer } from "@/components/EventCalendarContainer";

const AdminPage = ({ searchParams }) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <Card type="student" />
          <Card type="teacher" />
          <Card type="parent" />
          <Card type="admin" />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-112.5">
            <CountChartContainer />
          </div>
          <div className="w-full lg:w-2/3 h-112.5">
            <AttendanceChartContainer />
          </div>
        </div>
        <div className="w-full h-125">
          <FinanceChart />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
