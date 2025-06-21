import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvouwwlqbuhlvixbpdha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s";
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminOrderInfo = ({ order, goBack }) => {
  const [orderData, setOrderData] = useState(order);
  const [status, setStatus] = useState(order.status || "");
  const [trackNumber, setTrackNumber] = useState(order.track_number || "");
  const [previewUrl, setPreviewUrl] = useState(null);

  const showTrackInput =
    status.toLowerCase() === "передан в доставку" ||
    status.toLowerCase() === "доставлен";

  const loadOrder = async () => {
    const { data, error } = await supabase
      .from("order")
      .select("*, orderItem(id, item(*))") // 👈 исправлено здесь
      .eq("id", order.id)
      .single();

    if (error) {
      console.error("Ошибка при загрузке заказа:", error);
      alert("Не удалось обновить данные заказа");
      return;
    }

    setOrderData(data);
    setStatus(data.status || "");
    setTrackNumber(data.track_number || "");
  };

  const handleSave = async () => {
    const requiresTrack =
      status.toLowerCase() === "передан в доставку" ||
      status.toLowerCase() === "доставлен";

    if (requiresTrack && (!trackNumber || trackNumber.trim() === "")) {
      alert("Пожалуйста, введите трек номер для выбранного статуса.");
      return;
    }

    const { error } = await supabase
      .from("order")
      .update({
        status,
        track_number: trackNumber.trim() || null,
      })
      .eq("id", order.id);

    if (error) {
      alert("Ошибка при сохранении!");
      console.error(error);
    } else {
      alert("Заказ успешно обновлён!");
      await loadOrder(); // 🔁 перезагрузка данных
    }
  };

  const handleDelete = async () => {
    if (
      !confirm("Вы уверены, что хотите удалить заказ и все связанные данные?")
    )
      return;

    const { data: orderItems, error: loadError } = await supabase
      .from("orderItem")
      .select("id, item_id")
      .eq("order_id", order.id);

    if (loadError) {
      console.error(loadError);
      alert("Не удалось загрузить связанные товары");
      return;
    }

    const itemIds = orderItems.map((oi) => oi.item_id);
    const orderItemIds = orderItems.map((oi) => oi.id);

    const { error: deleteOrderItemsError } = await supabase
      .from("orderItem")
      .delete()
      .in("id", orderItemIds);

    if (deleteOrderItemsError) {
      console.error(deleteOrderItemsError);
      alert("Ошибка при удалении позиций заказа");
      return;
    }

    const { error: deleteItemsError } = await supabase
      .from("item")
      .delete()
      .in("id", itemIds);

    if (deleteItemsError) {
      console.error(deleteItemsError);
      alert("Ошибка при удалении товаров");
      return;
    }

    const { error: deleteOrderError } = await supabase
      .from("order")
      .delete()
      .eq("id", order.id);

    if (deleteOrderError) {
      console.error(deleteOrderError);
      alert("Ошибка при удалении заказа");
      return;
    }

    alert("Заказ полностью удалён");
    goBack();
  };

  return (
    <div className="px-5 mt-24 mb-21">
      <div className="fixed w-full top-0 left-0 px-5 pt-7 bg-white border-b border-gray-200 flex items-start">
        <button onClick={goBack} className="pt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-5 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-black grow text-center mb-5">
          Заказ #{orderData.id}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-medium pb-3">Информация о заказе</h1>
        <div className="flex justify-between">
          <p className="text-gray-500">Фио клиента</p>
          <p>{orderData.fio_client}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Дата заказа</p>
          <p>
            {new Date(orderData.created_at).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>{" "}
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Статус оплаты</p>
          <p>{orderData.paid ? "Оплачен" : "Ожидает оплаты"}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Номер телефона</p>
          <p>{orderData.phone_number}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Город</p>
          <p>{orderData.city}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Адрес</p>
          <p>{orderData.adress}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Индекс</p>
          <p>{orderData.index}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Сумма</p>
          <p>{orderData.total} ₽</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Статус заказа</p>
          <p>{orderData.status}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Трек номер</p>
          <p>{orderData.track_number}</p>
        </div>
      </div>

      <div className="mt-5 font-medium">
        <h1>Товары</h1>
        <div className="mt-2 space-y-3">
          {orderData.orderItems?.map((oi) => (
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

      <div className="mt-5 font-medium flex flex-col gap-2">
        <h1>Управление заказом</h1>

        <select
          className="w-full h-8 appearance-none bg-gray-100 px-2 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option disabled>Статус заказа</option>
          <option value="ожидает оплаты">Ожидает оплаты</option>
          <option value="заказ принят">Заказ принят</option>
          <option value="куплен в китае">Куплен в Китае</option>
          <option value="передан в доставку">Передан в доставку</option>
          <option value="доставлен">Доставлен</option>
        </select>

        {showTrackInput && (
          <input
            placeholder="Трек номер"
            value={trackNumber}
            onChange={(e) => setTrackNumber(e.target.value)}
            className="border border-gray-400 rounded-lg px-2 py-1 placeholder-gray-400"
          />
        )}

        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-xs text-white bg-blue-500 rounded-lg"
        >
          Сохранить изменения
        </button>

        <button
          onClick={handleDelete}
          className="mt-5 px-5 py-2 w-60 text-xs text-white bg-red-500 rounded-lg"
        >
          Удалить заказ
        </button>
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
