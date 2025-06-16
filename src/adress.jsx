import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvouwwlqbuhlvixbpdha.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s";
const supabase = createClient(supabaseUrl, supabaseKey);

function Address({ setPage, tgUserId, yuanToRubRate }) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  let displayYuanRate = yuanToRubRate + 0.8;

  // Данные заказа
  const [orderData, setOrderData] = useState({
    fio_client: "",
    phone_number: "",
    city: "",
    adress: "",
    index: "",
  });

  // Стоимости
  const [prices, setPrices] = useState({
    items: 0,
    comission: 400,
    deliveryChina: 1000,
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      const { data, error } = await supabase
        .from("item")
        .select("*")
        .eq("status", "в корзине")
        .eq("tgUserId", tgUserId);

      if (error) {
        console.error("Ошибка загрузки корзины:", error);
      } else {
        setCartItems(data);

        // 1. Рассчитываем вес
        let weight = 0;

        data.forEach((item) => {
          const category = item.category?.toLowerCase();
          switch (category) {
            case "кроссовки":
            case "ботинки":
            case "кеды":
            case "туфли":
            case "бутсы":
              weight += 1.5;
              break;
            case "пуховик":
              weight += 1.3;
              break;
            case "жилетка":
              weight += 0.8;
              break;
            case "парка":
              weight += 1.2;
              break;
            case "легкая куртка":
            case "ветровка":
              weight += 0.7;
              break;
            case "пиджак":
              weight += 1.0;
              break;
            case "худи":
            case "толстовка":
              weight += 0.9;
              break;
            case "лонгслив":
            case "футболка":
            case "рубашка":
              weight += 0.3;
              break;
            case "джинсы":
              weight += 0.7;
              break;
            case "шорты":
              weight += 0.4;
              break;
            case "брюки":
              weight += 0.6;
              break;
            case "шапка":
            case "кепка":
            case "снуд":
            case "шарф":
              weight += 0.2;
              break;
            case "женская сумка маленькая":
              weight += 0.4;
              break;
            case "женская сумка большая":
              weight += 0.8;
              break;
            case "рюкзак":
              weight += 1.2;
              break;
            case "чемодан":
              weight += 2.5;
              break;
            case "дорожная сумка":
              weight += 1.5;
              break;
            case "сумка через плечо":
            case "бананка":
              weight += 0.5;
              break;
            case "очки":
            case "часы":
            case "украшения":
            case "ремни":
            case "перчатки":
              weight += 0.2;
              break;
            case "парфюм":
              weight += 0.5;
              break;
            case "крем":
            case "помада":
              weight += 0.3;
              break;
            default:
              weight += 0.5;
              break;
          }
        });

        // 2. Определяем международную доставку по весу
        const getDeliveryCost = (w) => {
          const prices = [
            613, 1017, 1422, 1804, 2187, 2569, 2952, 3335, 3717, 4100, 4483,
            4865, 5248, 5630, 6013, 6395, 6778, 7161, 7543, 7926,
          ];
          if (w <= 20) {
            return prices[Math.ceil(w) - 1] || 0;
          }
          return 7926 + Math.ceil(w - 20) * 400;
        };

        const deliveryToRussia = getDeliveryCost(weight);

        // 3. Рассчитываем финальную стоимость
        const itemsTotal = data.reduce(
          (sum, item) => sum + Number(item.price_cny),
          0,
        );

        const finalTotal =
          itemsTotal * displayYuanRate +
          prices.comission +
          prices.deliveryChina +
          deliveryToRussia;

        setPrices((prev) => ({
          ...prev,
          items: itemsTotal,
          total: finalTotal.toFixed(2),
          deliveryInternational: deliveryToRussia,
        }));
      }

      setLoading(false);
    };

    fetchCartItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async () => {
    if (processing) return; // защита от двойного клика

    // Валидации
    const isValidPhoneNumber = (phone) => {
      const digits = phone.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    };

    const isValidPostalCode = (code) => /^\d{5,10}$/.test(code); // только цифры, 5-10 символов

    const isValidFIO = (fio) => /^[А-Яа-яЁё\s]{3,}$/.test(fio.trim()); // только русские буквы и пробелы

    // Проверки
    if (!isValidFIO(orderData.fio_client)) {
      alert("Пожалуйста, введите корректное ФИО");
      return;
    }

    if (!isValidPhoneNumber(orderData.phone_number)) {
      alert("Пожалуйста, введите корректный номер телефона");
      return;
    }

    if (!orderData.city.trim() || orderData.city.length < 2) {
      alert("Пожалуйста, укажите город");
      return;
    }

    if (!orderData.adress.trim() || orderData.adress.length < 5) {
      alert("Пожалуйста, укажите полный адрес");
      return;
    }

    if (!isValidPostalCode(orderData.index)) {
      alert("Пожалуйста, введите корректный индекс");
      return;
    }

    if (cartItems.length === 0) {
      alert("Ваша корзина пуста");
      return;
    }

    setProcessing(true);

    try {
      const { data: newOrder, error: orderError } = await supabase
        .from("order")
        .insert([
          {
            created_at: new Date().toISOString(),
            paid: false,
            status: "ожидает оплаты",
            total: prices.total, /////////////////////////
            ...orderData,
            tgUserId: tgUserId,
            track_number: null,
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Ошибка создания заказа:", orderError);
        throw orderError;
      }

      const orderId = newOrder.id;
      if (!orderId) {
        throw new Error("Не удалось получить ID заказа");
      }

      const orderItemsData = cartItems.map((item) => ({
        order_id: orderId,
        item_id: item.id,
      }));

      const { error: orderItemsError } = await supabase
        .from("orderItem")
        .insert(orderItemsData);

      if (orderItemsError) {
        console.error("Ошибка создания связей:", orderItemsError);
        throw orderItemsError;
      }

      const itemIds = cartItems.map((item) => item.id);
      const { error: updateError } = await supabase
        .from("item")
        .update({ status: "оформлен" })
        .in("id", itemIds);

      if (updateError) {
        console.error("Ошибка обновления статуса:", updateError);
        throw updateError;
      }

      alert("Заказ успешно оформлен!");
      setPage("orders");
    } catch (error) {
      console.error("Полная ошибка оформления:", error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="px-5 mt-7 mb-21">
        <h1 className="text-xl font-bold text-black">Адрес доставки</h1>
        <p className="text-sm mt-4">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="px-5 mt-7 mb-21">
      <h1 className="text-xl font-bold text-black">Адрес доставки</h1>

      <div className="mt-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            ФИО получателя
          </span>
          <input
            name="fio_client"
            value={orderData.fio_client}
            onChange={handleInputChange}
            className="mt-0.5 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
            required
          />
        </label>
      </div>

      <div className="mt-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Телефон</span>
          <input
            name="phone_number"
            value={orderData.phone_number}
            onChange={handleInputChange}
            className="mt-0.5 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
            required
          />
        </label>
      </div>

      <div className="mt-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Город</span>
          <input
            name="city"
            value={orderData.city}
            onChange={handleInputChange}
            className="mt-0.5 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
            required
          />
        </label>
      </div>

      <div className="mt-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Адрес</span>
          <input
            name="adress"
            value={orderData.adress}
            onChange={handleInputChange}
            className="mt-0.5 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
            required
          />
        </label>
      </div>

      <div className="mt-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Индекс</span>
          <input
            name="index"
            value={orderData.index}
            onChange={handleInputChange}
            className="mt-0.5 w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
          />
        </label>
      </div>

      {/* Сводка заказа */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Ваш заказ</h2>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Товары ({cartItems.length})</span>
            <span>{prices.items} ¥</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Курс юаня</span>
            <span>{displayYuanRate.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Комиссия</span>
            <span>{prices.comission} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Доставка по Китаю</span>
            <span>{prices.deliveryChina} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Международная доставка</span>
            <span>{prices.deliveryInternational} ₽</span>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-3 pt-3">
          <div className="flex justify-between font-semibold">
            <span>Итого</span>
            <span>{prices.total} ₽</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmitOrder}
        disabled={processing}
        className={`mt-6 w-full py-3 rounded-lg text-white font-medium ${processing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {processing ? "Оформляем заказ..." : "Подтвердить заказ"}
      </button>
    </div>
  );
}

export default Address;
