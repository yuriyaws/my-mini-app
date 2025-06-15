import { useState } from "react";
import OrdersActive from "./ordersActive";
import OrdersComplete from "./ordersComplete";

function Orders({ tgUserId }) {
  const [page, setPage] = useState("ordersActive");

  return (
    <>
      <div className="px-5 mt-7 mb-3">
        <h1 className="text-xl font-bold text-black">Заказы</h1>
        <div className="mt-3 bg-gray-100 rounded-lg px-2 py-1 flex flex-row gap-3">
          <button
            className={
              page === "ordersActive"
                ? "w-full py-1 bg-white rounded-lg text-sm"
                : "w-full py-1 text-sm"
            }
            onClick={() => setPage("ordersActive")}
          >
            Активные
          </button>
          <button
            className={
              page === "ordersComplete"
                ? "w-full py-1 bg-white rounded-lg text-sm"
                : "w-full py-1 text-sm"
            }
            onClick={() => setPage("ordersComplete")}
          >
            Завершенные
          </button>
        </div>
      </div>

      {/* Контент */}
      {page === "ordersActive" && <OrdersActive tgUserId={tgUserId} />}
      {page === "ordersComplete" && <OrdersComplete tgUserId={tgUserId} />}
    </>
  );
}

export default Orders;
