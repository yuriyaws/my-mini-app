import AdminOrdersList from "./adminOrdersList";
import AdminOrderInfo from "./adminOrderInfo";
import { useState } from "react";

const Admin = () => {
  const [adminPage, setAdminPage] = useState("adminOrders");
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <>
      {adminPage === "adminOrders" && (
        <AdminOrdersList
          setAdminPage={setAdminPage}
          setSelectedOrder={setSelectedOrder}
        />
      )}
      {adminPage === "adminOrderInfo" && selectedOrder && (
        <AdminOrderInfo
          order={selectedOrder}
          goBack={() => setAdminPage("adminOrders")}
        />
      )}
    </>
  );
};

export default Admin;
