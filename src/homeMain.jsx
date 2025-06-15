function HomeMain({ setPage }) {
  const supportModal = () => {
    alert(
      "Для обращения в поддержку воспользуйтесь командой /support в телеграм боте",
    );
  };

  return (
    <>
      {/* Содержание пункта Главная */}
      <div className="flex flex-col gap-10 mt-16 mb-21">
        {/* Информация о нас */}
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://tvouwwlqbuhlvixbpdha.supabase.co/storage/v1/object/public/screenshots//photo_2025-06-15%2003.55.20.jpeg"
            className="h-25 w-25 rounded-3xl"
          ></img>

          <h1 className="text-xl font-bold">AYCD</h1>
          <p className="text-sm text-gray-500">
            Быстрая доставка товаров из Китая в Россию
          </p>
        </div>
        {/* Call to action Кнопки */}
        <div className="flex flex-col px-10 gap-3">
          <button
            className="text-sm text-white px-3 py-3 bg-blue-600 border border-blue-500 rounded-lg"
            onClick={() => setPage("add")}
          >
            Заказать товар
          </button>
          <button
            className="text-sm text-black px-3 py-3 border border-gray-200 rounded-lg"
            onClick={() => setPage("orders")}
          >
            Мои заказы
          </button>
        </div>
        {/* Роудмап для заказа */}
        <div className="px-15">
          <ol className="relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200">
            <li className="relative -ms-1.5 flex items-start gap-4">
              <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

              <div className="-mt-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Выберите товар
                </h3>

                <p className="mt-0.5 text-sm text-gray-500">
                  Заполните форму для заказа товара
                </p>
              </div>
            </li>

            <li className="relative -ms-1.5 flex items-start gap-4">
              <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

              <div className="-mt-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Оплатите товар
                </h3>

                <p className="mt-0.5 text-sm text-gray-500">
                  Оплатите заказ и укажите адрес доставки
                </p>
              </div>
            </li>

            <li className="relative -ms-1.5 flex items-start gap-4">
              <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

              <div className="-mt-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Получите товар
                </h3>

                <p className="mt-0.5 text-sm text-gray-500">
                  Дождитесь доставки товара в Россию
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Ссылка на поддержку */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">
            Есть вопросы?{" "}
            <button onClick={supportModal} className="text-blue-500 underline">
              Свяжитесь с нами
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default HomeMain;
