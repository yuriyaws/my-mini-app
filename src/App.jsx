import "./App.css";
import Home from "./home";
import Add from "./add";
import Cart from "./cart";
import Orders from "./orders";
import Adress from "./adress";
import Admin from "./admin";
import { useEffect, useState } from "react";

function App() {
  const [page, setPage] = useState("home");

  const [tgUserId, setTgUserId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromQuery = urlParams.get("userId");

    if (userIdFromQuery) {
      setTgUserId(userIdFromQuery);
      console.log("User ID from URL:", userIdFromQuery);
    } else {
      console.warn("userId не найден в URL");
    }
  }, []);

  const [yuanToRubRate, setYuanToRubRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYuanRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/CNY");
        const data = await response.json();

        if (data?.rates?.RUB) {
          setYuanToRubRate(data.rates.RUB);
          // console.log(`Курс юаня: ${data.rates.RUB}`);
        } else {
          console.error("Курс RUB не найден в ответе.");
          setError("Курс RUB не найден.");
        }
      } catch (err) {
        console.error("Ошибка загрузки курса:", err.message);
        setError("Ошибка загрузки курса.");
      }
    };

    fetchYuanRate(); // Вызывается один раз при монтировании компонента
  }, []);

  return (
    <>
      <div className="fixed bottom-0 bg-white border-t border-gray-300 w-full h-18 z-10 flex flex-row justify-between items-baseline px-10">
        <button
          className="flex flex-col justify-center items-center pt-2.5"
          onClick={() => setPage("home")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-5 ${page === "home" ? "text-blue-600" : "text-gray-500"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <p
            className={`text-xs ${page === "home" ? "text-blue-600" : "text-gray-500"}`}
          >
            Главная
          </p>
        </button>

        <button
          className="flex flex-col justify-center items-center"
          onClick={() => setPage("add")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-5 ${page === "add" ? "text-blue-600" : "text-gray-500"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p
            className={`text-xs ${page === "add" ? "text-blue-600" : "text-gray-500"}`}
          >
            Добавить
          </p>
        </button>

        {/* Остальные пункты можно сделать аналогично */}
        <button
          className="flex flex-col justify-center items-center"
          onClick={() => setPage("cart")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-5 ${page === "cart" ? "text-blue-600" : "text-gray-500"}`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <p
            className={`text-xs ${page === "cart" ? "text-blue-600" : "text-gray-500"}`}
          >
            Корзина
          </p>
        </button>

        <button
          className="flex flex-col justify-center items-center"
          onClick={() => setPage("orders")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-5 ${page === "orders" ? "text-blue-600" : "text-gray-500"}`}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
            />
          </svg>
          <p
            className={`text-xs ${page === "orders" ? "text-blue-600" : "text-gray-500"}`}
          >
            Заказы
          </p>
        </button>

        {tgUserId === 1919233418 ? (
          <button
            className="flex flex-col justify-center items-center"
            onClick={() => setPage("admin")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`size-5 ${page === "admin" ? "text-blue-600" : "text-gray-500"}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <p
              className={`text-xs ${page === "admin" ? "text-blue-600" : "text-gray-500"}`}
            >
              Админ
            </p>
          </button>
        ) : null}
      </div>

      {/* Контент */}
      {page === "home" && <Home setPage={setPage} tgUserId={tgUserId} />}
      {page === "add" && <Add tgUserId={tgUserId} />}
      {page === "cart" && <Cart setPage={setPage} tgUserId={tgUserId} />}
      {page === "orders" && <Orders tgUserId={tgUserId} />}
      {page === "adress" && (
        <Adress
          setPage={setPage}
          tgUserId={tgUserId}
          yuanToRubRate={yuanToRubRate}
        />
      )}
      {page === "admin" && <Admin />}
    </>
  );
}

export default App;
