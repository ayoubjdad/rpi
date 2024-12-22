import React, { useContext } from "react";
import Dashboard from "./pages/dashboard/dashboard/Dashboard";
import { DataContext } from "./context/DataProvider";

export default function App() {
  const { fetched } = useContext(DataContext);

  if (!fetched) return <h1>Loading...</h1>;

  return <Dashboard />;
}
