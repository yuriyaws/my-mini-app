import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvouwwlqbuhlvixbpdha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s";
const supabase = createClient(supabaseUrl, supabaseKey);

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, sortOption]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      let query = supabase.from("order").select(`
          *,
          orderItems: orderItem(*, item(*))
        `);

      // Улучшенный поиск
      if (searchTerm) {
        // Проверяем, является ли поисковый запрос числом (для ID)
        const isNumber = !isNaN(searchTerm) && !isNaN(parseInt(searchTerm));

        if (isNumber) {
          // Если число - ищем по ID (точное совпадение)
          query = query.eq("id", parseInt(searchTerm));
        } else {
          // Если строка - ищем по ФИО (частичное совпадение без учета регистра)
          query = query.ilike("fio_client", `%${searchTerm}%`);
        }
      }

      // Сортировка (оставляем без изменений)
      switch (sortOption) {
        case "asc":
          query = query.order("created_at", { ascending: true });
          break;
        case "desc":
          query = query.order("created_at", { ascending: false });
          break;
        default:
          query = query.order("id", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalItems = (order) => {
    return (
      order.orderItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) ||
      0
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className="px-5 mt-7 mb-21">
      <h1 className="text-xl font-bold text-black">Админ панель</h1>

      {/* Поиск и сортировка */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          placeholder="Поиск по ФИО или ID заказа"
          className="mt-2 w-full h-8 bg-gray-100 rounded-lg px-2 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full h-8 appearance-none bg-gray-100 px-2 rounded-lg"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default" selected disabled>
            По умолчанию
          </option>
          <optgroup label="По дате">
            <option value="asc">Сначала старые</option>
            <option value="desc">Сначала новые</option>
          </optgroup>
          <optgroup label="По статусу">
            <option value="">Ожидает оплаты</option>
            <option value="">Заказ принят</option>
            <option value="">Куплен в китае</option>
            <option value="">Передан в доставку</option>
            <option value="">Доставлен</option>
          </optgroup>
        </select>
      </div>

      {loading ? (
        <p>Загрузка заказов...</p>
      ) : orders.length === 0 ? (
        <p>Заказы не найдены</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="w-full h-max py-4 border-b border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-base font-semibold">Заказ #{order.id}</h1>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {order.status || "в обработке"}
              </span>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Клиент: {order.fio_client}
              </p>
              <p className="text-sm text-gray-500">
                Телефон: {order.phone_number}
              </p>
              <p className="text-sm text-gray-500">Город: {order.city}</p>
              <p className="text-sm text-gray-500">Адрес: {order.adress}</p>
              <p className="text-sm text-gray-500">Индекс: {order.index}</p>
              <p className="text-sm text-gray-500">
                Количество товаров: {calculateTotalItems(order)}
              </p>
              <p className="text-sm text-gray-500">Сумма: {order.total} ¥</p>
              <p className="text-sm text-gray-500">
                Дата создания: {formatDate(order.created_at)}
              </p>
              {order.track_number && (
                <p className="text-sm text-gray-500">
                  Трек-номер: {order.track_number}
                </p>
              )}

              {/* Детали заказа */}
              {/* <div className="mt-3">
                <h3 className="text-sm font-medium">Товары:</h3>
                {order.orderItems?.map((orderItem) => (
                  <div
                    key={orderItem.id}
                    className="ml-2 text-sm text-gray-500"
                  >
                    - {orderItem.item?.name || "Товар"} (x
                    {orderItem.quantity || 1}), {orderItem.item?.price_cny} ¥
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Admin;
