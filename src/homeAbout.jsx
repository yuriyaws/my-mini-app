function HomeAbout() {
    return(
        <>
            <div className="px-10 mt-13 mb-21">
                <h1 className="text-xl font-bold">О нас</h1>
                <p className="px-3">Мы специализируемся на выкупе товаров с китайских маркетплейсов (Poizon, Taobao, 1688, Pinduoduo и др.) и доставке в РФ и СНГ.</p>
            
                <h1 className="text-lg font-semibold mt-2 mb-2">Почему именно мы?</h1>
                <ul className="px-3">
                    <li className="mb-2">👤 Поддержка 24/7 — в нашем чате оперативно отвечают специалисты, готовые помочь на каждом этапе работы — от оформления до получения заказа.</li>
                    <li className="mb-2">✅ Проверка товара перед отправкой — перед отправкой товара в Россию мы делаем фото товара чтобы вы могли убедиться в качестве посылки.</li>
                    <li className="mb-2">🚀 Выгодные цены – у нас одни из самых низких цен на рынке благодаря прямым поставкам из Китая. Оплачивайте в рублях или криптовалюте – без скрытых комиссий!</li>
                    <li className="mb-2">📦 Быстрая доставка – доставляем посылки из Китая за 7–14 дней (в зависимости от региона). Работаем с проверенными логистическими компаниями, чтобы ваш товар пришел вовремя.</li>
                    <li className="mb-2">🔒 Фиксация цены – стоимость закрепляется на момент заказа и не изменится, даже если курс или цены у поставщиков вырастут.</li>
                    <li className="mb-2">⚡ Нет ограничений – выкупаем товары в любых объемах: от мелких заказов до крупных оптовых партий.</li>
                </ul>

                <h1 className="text-lg font-semibold mt-2 mb-5">Как это работает?</h1>
                <div className='px-6'>
                <ol className="relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 mb-7">
                    <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

                    <div className="-mt-2">
                        <h3 className="text-lg font-bold text-gray-900">Клиент</h3>

                        <p className="mt-0.5 text-sm text-gray-500">
                        Заказывает товар
                        </p>
                    </div>
                    </li>

                    <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

                    <div className="-mt-2">
                        <h3 className="text-lg font-bold text-gray-900">AYCD</h3>

                        <p className="mt-0.5 text-sm text-gray-500">
                        Байер выкупает и отправляет фото товара
                        </p>
                    </div>
                    </li>

                    <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

                    <div className="-mt-2">
                        <h3 className="text-lg font-bold text-gray-900">Клиент</h3>

                        <p className="mt-0.5 text-sm text-gray-500">
                        Подтверждает доставку
                        </p>
                    </div>
                    </li>

                    <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

                    <div className="-mt-2">
                        <h3 className="text-lg font-bold text-gray-900">AYCD</h3>

                        <p className="mt-0.5 text-sm text-gray-500">
                        Отправляем посылку в Россию
                        </p>
                    </div>
                    </li>

                    <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-blue-500"></span>

                    <div className="-mt-2">
                        <h3 className="text-lg font-bold text-gray-900">Клиент</h3>

                        <p className="mt-0.5 text-sm text-gray-500">
                        Получает посылку
                        </p>
                    </div>
                    </li>
                </ol>
                </div>
            </div>
        </>
    )
}

export default HomeAbout