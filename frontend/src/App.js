import React, { useContext } from "react";
import { DataContext } from "./context/DataProvider";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  // const { fetched } = useContext(DataContext);

  // if (!fetched) return <h1>Loading...</h1>;

  return <Dashboard />;
}
