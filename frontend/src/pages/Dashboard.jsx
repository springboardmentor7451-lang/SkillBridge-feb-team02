import VolunteerDashboard from "../components/VolunteerDashboard";
import NgoDashboard from "../components/NgoDashboard";

// Change this to test roles
const role = "volunteer"; 
//const role = "ngo";

const Dashboard = () => {
  return (
    <>
      {role === "volunteer" && <VolunteerDashboard />}
      {role === "ngo" && <NgoDashboard />}
    </>
  );
};

export default Dashboard;