const AdminOrderInfo = ({ order, goBack }) => {
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
          {order.orderItems?.length > 0 ? (
            order.orderItems.map((orderItem) => (
              <div
                key={orderItem.id}
                className="border border-gray-200 rounded-lg p-3 flex flex-row gap-1"
              >
                {orderItem.item?.screenshot_url && (
                  <img
                    src={orderItem.item.screenshot_url}
                    alt="Товар"
                    className="w-24 h-auto mt-2 rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {orderItem.item?.category} — {orderItem.item?.size}
                  </p>
                  <a
                    href={orderItem.item?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm underline break-all"
                  >
                    {orderItem.item?.url}
                  </a>
                  <p className="text-sm">Цена: {orderItem.item?.price_cny} ¥</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Нет товаров в заказе</p>
          )}
        </div>
      </div>
    </div>

    // <div className="px-5 mt-36">
    //   <button onClick={goBack} className="mb-4 text-blue-500 underline">
    //     ← Назад
    //   </button>
    //   <h1 className="text-xl font-bold">Информация о заказе #{order.id}</h1>
    //   <p>Клиент: {order.fio_client}</p>
    //   <p>Телефон: {order.phone_number}</p>
    //   <p>Город: {order.city}</p>
    //   <p>Адрес: {order.adress}</p>
    //   <p>Индекс: {order.index}</p>
    //   <p>Сумма: {order.total} ¥</p>
    //   {/* и так далее */}
    // </div>
  );
};

export default AdminOrderInfo;
