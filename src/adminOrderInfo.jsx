import { useState } from "react";

const AdminOrderInfo = ({ order, goBack }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  return (
    <div className="px-5 mt-24 mb-21">
      <div className="fixed w-full top-0 left-0 px-5 pt-7 bg-white border-b border-gray-200 flex items-start">
        <button onClick={goBack} className="pt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="size-5 text-black"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-black grow text-center mb-5">
          Заказ #{order.id}
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-medium pb-3">Информация о заказе</h1>
        <div className="flex justify-between">
          <p className="text-gray-500">Фио клиента</p>
          <p>{order.fio_client}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Дата заказа</p>
          <p>{order.created_at}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Статус оплаты</p>
          <p>{order.paid ? "Оплачен" : "Ожидает оплаты"}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Номер телефона</p>
          <p>{order.phone_number}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Город</p>
          <p>{order.city}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Адрес</p>
          <p>{order.adress}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Индекс</p>
          <p>{order.index}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Сумма</p>
          <p>{order.total} ₽</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Статус заказа</p>
          <p>{order.status}</p>
        </div>
      </div>

      <div className="mt-5 font-medium">
        <h1>Товары</h1>
        <div className="mt-2 space-y-3">
          {order.orderItems?.map((oi) => (
            <div
              key={oi.id}
              className="flex items-center gap-2 border border-gray-300 p-2 rounded-md bg-gray-50"
            >
              <img
                src={oi.item?.screenshot_url}
                alt={oi.item?.url}
                className="w-12 h-12 object-cover rounded"
                onClick={() => setPreviewUrl(oi.item?.screenshot_url)}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{oi.item?.url}</p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xs text-gray-500">{oi.item?.category}</p>
                  <span className="h-1 w-1 rounded-2xl bg-gray-500"></span>
                  <p className="text-xs text-gray-500">{oi.item?.size}</p>
                </div>
                <p className="text-xs">{oi.item?.price_cny} ¥</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            className="max-w-full max-h-full object-contain rounded-lg"
            alt="preview"
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrderInfo;
