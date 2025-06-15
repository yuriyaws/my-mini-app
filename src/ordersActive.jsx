import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvouwwlqbuhlvixbpdha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s"; // Лучше вынести в env-переменные
const supabase = createClient(supabaseUrl, supabaseKey);

function OrdersActive({ tgUserId }) {
  const [orders, setOrders] = useState([]); // товары в корзине
  const [loading, setLoading] = useState(true); // статус загрузки

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const { data, error } = await supabase.from("order").select(
      `
            *,
            orderItem (
            *,
            item (*)
            )
        `,
    );
    ç.eq("tgUserId", tgUserId).neq("status", "доставлен");

    if (error) {
      console.error("Ошибка при загрузке корзины:", error.message);
    } else {
      setOrders(data); // сохраняем полученные товары
    }
    setLoading(false); // загрузка завершена
  };

  const payModal = () => {
    alert(
      "Для оплаты заказа напишите номер заказа в поддержку (команда /support в боте)",
    );
  };

  return (
    <>
      <div className="px-5 mt-7 mb-21">
        {/* Карточка заказа */}
        {loading ? (
          <p className="text-sm">Загрузка...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 mt-4">Нет заказов</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="mt-3 flex flex-col border border-gray-300 rounded-lg h-full px-2.5 py-2 gap-1.5"
            >
              <div className="flex flex-row justify-between items-start">
                <div>
                  <p>Заказ #{order.id}</p>
                  <p className="text-sm">
                    От {new Date(order.created_at).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <button className="text-xs">{order.status}</button>
              </div>
              {order.paid ? (
                <></>
              ) : (
                <div>
                  <button
                    onClick={payModal}
                    className="px-2 py-1 bg-blue-500 rounded-md text-xs text-white font-medium"
                  >
                    Оплатить заказ
                  </button>
                </div>
              )}

              {order.paid === true ? (
                <div>
                  <div className="flex flex-row justify-between px-1 mt-2 mb-1">
                    {/* Этап 1: Заказ принят */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-3xl flex items-center justify-center ${
                          [
                            "заказ принят",
                            "куплен в китае",
                            "передан в доставку",
                            "доставлен",
                          ].includes(order.status)
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <p className="text-white">1</p>
                      </div>
                      <p className="text-xs">Принят</p>
                    </div>

                    {/* Этап 2: Куплен в Китае */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-3xl flex items-center justify-center ${
                          [
                            "куплен в китае",
                            "передан в доставку",
                            "доставлен",
                          ].includes(order.status)
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <p className="text-white">2</p>
                      </div>
                      <p className="text-xs">Куплен</p>
                    </div>

                    {/* Этап 3: Передан в доставку */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-3xl flex items-center justify-center ${
                          ["передан в доставку", "доставлен"].includes(
                            order.status,
                          )
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <p className="text-white">3</p>
                      </div>
                      <p className="text-xs">В доставке</p>
                    </div>

                    {/* Этап 4: Доставлен */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-3xl flex items-center justify-center ${
                          order.status === "доставлен"
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <p className="text-white">4</p>
                      </div>
                      <p className="text-xs">Доставлен</p>
                    </div>
                  </div>

                  {/* Прогресс-линия */}
                  <div className="relative">
                    <div className="h-1 w-full bg-gray-200 rounded-xl mt-2 mb-1 absolute"></div>
                    <div
                      className="h-1 bg-blue-600 rounded-xl mt-2 mb-1 absolute"
                      style={{
                        width:
                          order.status === "заказ принят"
                            ? "25%"
                            : order.status === "куплен в китае"
                              ? "50%"
                              : order.status === "передан в доставку"
                                ? "75%"
                                : order.status === "доставлен"
                                  ? "100%"
                                  : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <span className="h-0.25 w-full bg-gray-300 my-1"></span>

              {order.orderItem?.map((oi) => (
                <div
                  key={oi.id}
                  className="flex items-center gap-2 border border-gray-300 p-2 rounded-md bg-gray-50"
                >
                  <img
                    src={oi.item?.screenshot_url}
                    alt={oi.item?.url}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{oi.item?.url}</p>
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-xs text-gray-500">
                        {oi.item?.category}
                      </p>
                      <span className="h-1 w-1 rounded-2xl bg-gray-500"></span>
                      <p className="text-xs text-gray-500">{oi.item?.size}</p>
                    </div>
                    <p className="text-xs">{oi.item?.price_cny} ¥</p>
                  </div>
                </div>
              ))}

              {/*  */}

              {order.status === "куплен в китае" ? (
                <div>
                  <span className="h-0.25 w-full bg-gray-300 my-1"></span>
                  <p>
                    Ваш заказ выкуплен, чтобы убедиться в качетсве товаров вы
                    можете связаться с поддержкой (/support).
                  </p>
                </div>
              ) : (
                <></>
              )}

              <span className="h-0.25 w-full bg-gray-300 my-1"></span>

              <div className="flex flex-row justify-between">
                <p className="text-sm">Количество товаров</p>
                <p className="text-sm">{order.orderItem?.length || 0}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-sm">Общая сумма</p>
                <p className="text-sm">{order.total}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default OrdersActive;
