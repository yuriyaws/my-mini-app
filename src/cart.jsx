import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvouwwlqbuhlvixbpdha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s";
const supabase = createClient(supabaseUrl, supabaseKey);

function Cart({ setPage, tgUserId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    // Добавляем фильтр по статусу
    const { data, error } = await supabase
      .from("item")
      .select("*")
      .eq("tgUserId", tgUserId)
      .eq("status", "в корзине"); // Фильтруем только товары в корзине

    if (error) {
      console.error("Ошибка при загрузке корзины:", error.message);
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  const comission = 400;
  const deliveryInChina = 1000;
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price_cny),
    0,
  );
  const grandTotal = totalPrice + comission + deliveryInChina;

  return (
    <>
      <div className="px-5 mt-7 mb-21">
        <h1 className="text-xl font-bold text-black">Корзина</h1>

        {/* Карточка товара */}
        {loading ? (
          <p className="text-sm">Загрузка...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 mt-4">Корзина пуста</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="mt-3 flex flex-row justify-between border border-gray-300 rounded-lg h-22"
            >
              <div>
                <div className="flex flex-row items-center">
                  <img
                    src={item.screenshot_url}
                    className="h-22 w-22 rounded-2xl px-2 py-2"
                    alt={item.url}
                  />
                  <div className="flex-col ml-2.5">
                    <p className="text-sm truncate w-[160px] h-[1.2em] whitespace-nowrap overflow-hidden">
                      {item.url}
                    </p>
                    <div className="flex flex-row items-center gap-3 mb-2.5">
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <span className="h-1 w-1 rounded-2xl bg-gray-500"></span>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </div>
                    <p className="text-sm">{item.price_cny} ¥</p>
                  </div>
                </div>
              </div>
              <div className="px-2 py-2">
                <button
                  onClick={async () => {
                    // При удалении можно также обновлять статус вместо полного удаления
                    await supabase.from("item").delete().eq("id", item.id);
                    fetchCartItems();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}

        {/* Итоги корзины */}
        {items.length > 0 && (
          <div className="mt-3 flex flex-col border border-gray-300 rounded-lg h-full px-2.5 py-2 gap-1.5">
            <div className="flex flex-row justify-between ">
              <p className="text-sm text-gray-500">Товары ({items.length})</p>
              <p className="text-sm">{totalPrice} ¥</p>
            </div>
            <div className="flex flex-row justify-between ">
              <p className="text-sm text-gray-500">Комиссия</p>
              <p className="text-sm">{comission} ¥</p>
            </div>
            <div className="flex flex-row justify-between ">
              <p className="text-sm text-gray-500">Доставка по Китаю</p>
              <p className="text-sm">{deliveryInChina} ¥</p>
            </div>
            <span className="h-0.25 w-full bg-gray-300"></span>
            <div className="flex flex-row justify-between">
              <p>Итого</p>
              <div className="flex flex-col">
                <p>{grandTotal} ¥</p>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки очистки и заказа */}
        {items.length > 0 && (
          <div className="mt-5 flex flex-row gap-6">
            <button
              onClick={async () => {
                // Удаляем все товары в корзине
                await supabase.from("item").delete().eq("status", "в корзине");
                fetchCartItems();
              }}
              className="w-full py-2 rounded-lg border border-gray-300 text-sm font-base"
            >
              Очистить
            </button>
            <button
              className="w-full py-2 rounded-lg bg-blue-600 text-sm text-white font-semibold"
              onClick={() => setPage("adress")}
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
