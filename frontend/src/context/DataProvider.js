import React, { createContext, useMemo } from "react";
import { useQuery } from "react-query";
import { serverUrl } from "../config/config";
import axios from "axios";

export const DataContext = createContext();

const options = {
  retry: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

const getClients = async () => {
  const response = await axios.get(`${serverUrl}/clients`);
  return response.data;
};
const getInvoices = async () => {
  const response = await axios.get(`${serverUrl}/invoices`);
  return response.data;
};

export const DataProvider = ({ children }) => {
  const { isFetched: clientsFetched, dataUpdatedAt: clientsDataUpdatedAt } =
    useQuery("clients", getClients, options);
  const { isFetched: invoicesFetched, dataUpdatedAt: invoiceDdataUpdatedAt } =
    useQuery("invoices", getInvoices, options);

  const fetched = useMemo(
    () => clientsFetched && invoicesFetched,
    [clientsDataUpdatedAt, invoiceDdataUpdatedAt]
  );

  return (
    <DataContext.Provider value={{ fetched }}>{children}</DataContext.Provider>
  );
};
