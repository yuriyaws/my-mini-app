import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvouwwlqbuhlvixbpdha.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s';
const supabase = createClient(supabaseUrl, supabaseKey);

function Address({ setPage }) {
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    
    // Данные заказа
    const [orderData, setOrderData] = useState({
        fio_client: '',
        phone_number: '',
        city: '',
        adress: '',
        index: '',
    });
    
    // Стоимости
    const [prices, setPrices] = useState({
        items: 0,
        comission: 400,
        deliveryChina: 1000,
        deliveryInternational: 1500,
        total: 0
    });

    // Загружаем товары из корзины при монтировании
    useEffect(() => {
        const fetchCartItems = async () => {
            const { data, error } = await supabase
                .from('item')
                .select('*')
                .eq('status', 'в корзине'); // Предполагаем, что есть статус у товаров
            
            if (error) {
                console.error('Ошибка загрузки корзины:', error);
            } else {
                setCartItems(data);
                
                // Рассчитываем суммы
                const itemsTotal = data.reduce((sum, item) => sum + Number(item.price_cny), 0);
                const total = itemsTotal + prices.comission + prices.deliveryChina + prices.deliveryInternational;
                
                setPrices(prev => ({
                    ...prev,
                    items: itemsTotal,
                    total: total
                }));
            }
            setLoading(false);
        };
        
        fetchCartItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrder = async () => {
        // Валидация
        if (!orderData.fio_client || !orderData.phone_number || !orderData.city || !orderData.adress) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
    
        if (cartItems.length === 0) {
            alert('Ваша корзина пуста');
            return;
        }
    
        setProcessing(true);
    
        try {
            // 1. Создаем заказ
            const { data: newOrder, error: orderError } = await supabase
                .from('order')
                .insert([{
                    created_at: new Date().toISOString(),
                    paid: false,
                    status: 'ожидает оплаты',
                    total: prices.total,
                    ...orderData
                }])
                .select()
                .single();
    
            if (orderError) {
                console.error('Ошибка создания заказа:', orderError);
                throw orderError;
            }
    
            // 2. Получаем ID только что созданного заказа
            const orderId = newOrder.id;
            if (!orderId) {
                throw new Error('Не удалось получить ID заказа');
            }
    
            // 3. Подготавливаем данные для orderItem
            const orderItemsData = cartItems.map(item => ({
                order_id: orderId,
                item_id: item.id
            }));
    
            console.log('Данные для orderItem:', orderItemsData); // Отладка
    
            // 4. Вставляем связи в orderItem
            const { error: orderItemsError } = await supabase
                .from('orderItem')
                .insert(orderItemsData);
    
            if (orderItemsError) {
                console.error('Ошибка создания связей:', orderItemsError);
                throw orderItemsError;
            }
    
            // 5. Обновляем статус товаров
            const itemIds = cartItems.map(item => item.id);
            const { error: updateError } = await supabase
                .from('item')
                .update({ status: 'оформлен' })
                .in('id', itemIds);
    
            if (updateError) {
                console.error('Ошибка обновления статуса:', updateError);
                throw updateError;
            }
    
            // Успешное завершение
            alert(`Заказ #${orderId} успешно оформлен!`);
            setPage('orders');
    
        } catch (error) {
            console.error('Полная ошибка оформления:', error);
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
                    <span className="text-sm font-medium text-gray-700">ФИО получателя*</span>
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
                    <span className="text-sm font-medium text-gray-700">Телефон*</span>
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
                    <span className="text-sm font-medium text-gray-700">Город*</span>
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
                    <span className="text-sm font-medium text-gray-700">Адрес*</span>
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
                        <span className="text-gray-600">Комиссия</span>
                        <span>{prices.comission} ¥</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Доставка по Китаю</span>
                        <span>{prices.deliveryChina} ¥</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Международная доставка</span>
                        <span>{prices.deliveryInternational} ¥</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between font-semibold">
                        <span>Итого</span>
                        <span>{prices.total} ¥</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmitOrder}
                disabled={processing}
                className={`mt-6 w-full py-3 rounded-lg text-white font-medium ${processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {processing ? 'Оформляем заказ...' : 'Подтвердить заказ'}
            </button>
        </div>
    );
}

export default Address;