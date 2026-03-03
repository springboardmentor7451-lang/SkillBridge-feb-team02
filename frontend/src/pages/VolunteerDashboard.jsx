import useAuth from "../context/useAuth";

const VolunteerDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== "volunteer") {
    return (
      <>
        <h1>Not Authorized</h1>
      </>
    );
  }
  return <div>VolunteerDashboard</div>;
};

export default VolunteerDashboard;
