import useAuth from "../context/useAuth";

const NgoDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== "ngo") {
    return (
      <>
        <h1>Not Authorized</h1>
      </>
    );
  }

  return <div>NgoDashboard</div>;
};

export default NgoDashboard;
