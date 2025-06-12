import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvouwwlqbuhlvixbpdha.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b3V3d2xxYnVobHZpeGJwZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTE5MzMsImV4cCI6MjA2MzMyNzkzM30.LfFBbYTX2eMGGnEZK-JbMJZkVrrXKkU2ML9OBE8IK8s'; // Лучше вынести в env-переменные
const supabase = createClient(supabaseUrl, supabaseKey);

function Add() {
  const [imageUrl, setImageUrl] = useState('');
  const [screenshot_url, setscreenshot_url] = useState('');

  const [url, setUrl] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('');
  const [price_cny, setPrice_cny] = useState('');
  const [status, setStatus] = useState('в корзине'); // например, дефолтный статус
  const [created_at, setCreated_at] = useState(new Date().toISOString());

  const handleAddItem = async () => {
    const { data, error } = await supabase
      .from('item')
      .insert([{ url, screenshot_url, size, category, price_cny, status, created_at }]);

    if (error) {
      console.error('Ошибка при добавлении:', error.message);
      alert('Ошибка при добавлении');
    } else {
      console.log('Добавлено:', data);
      alert('Продукт добавлен!');
      // Очистка
      setUrl('');
      setscreenshot_url('');
      setSize('');
      setCategory('');
      setPrice_cny('');
      setImageUrl('');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('screenshots') // Замените на свой бакет
      .upload(filePath, file);

    if (uploadError) {
      console.error('Ошибка загрузки изображения:', uploadError.message);
      alert('Ошибка загрузки изображения');
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('screenshots')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (publicUrl) {
      setscreenshot_url(publicUrl);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="px-10 mt-7 mb-21">
      <h1 className="text-xl font-bold">Добавить товар</h1>

      {/* Ссылка на товар */}
      <div className="mt-3">
        <label htmlFor="Link">
          <span className="text-sm font-medium text-gray-700">Ссылка на товар</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
            id="Link"
            className="mt-0.5 w-full h-8 rounded-lg border border-gray-300 px-2 text-sm"
          />
        </label>
      </div>

      {/* Скриншот товара */}
      <div className="mt-3">
        <label htmlFor="image" className="text-sm font-medium text-gray-700">Скриншот товара</label>
        <div className="mt-1 flex items-center">
          {imageUrl ? (
            <div className="relative w-full">
              <img
                src={imageUrl}
                alt="Товар"
                className="h-48 w-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-gray-200 px-2 py-1 text-sm rounded hover:bg-gray-300"
                onClick={() => {
                  setImageUrl('');
                  setscreenshot_url('');
                }}
              >
                Изменить
              </button>
            </div>
          ) : (
            <div className="w-full">
              <label
                htmlFor="image-upload"
                className="flex justify-center items-center h-48 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500"
              >
                <div className="space-y-1 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">Нажмите для загрузки</p>
                </div>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Размер и цена */}
      <div className="mt-3 flex flex-row gap-5">
        <div className='w-full'>
          <span className="text-sm font-medium text-gray-700">Размер</span>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            type="text"
            id="Size"
            className="mt-0.5 w-full h-8 rounded-lg border border-gray-300 px-2 text-sm"
          />
        </div>
        <div className='w-full'>
          <span className="text-sm font-medium text-gray-700">Цена (¥)</span>
          <input
            value={price_cny}
            onChange={(e) => setPrice_cny(e.target.value)}
            id="Price"
            className="mt-0.5 w-full h-8 rounded-lg border border-gray-300 px-2 text-sm"
          />
        </div>
      </div>

      {/* Категория */}
      <div className="mt-3">
        <label htmlFor="Category">
          <span className="text-sm font-medium text-gray-700">Категория</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='mt-0.5 w-full h-8 rounded-lg border border-gray-300 px-2 appearance-none cursor-pointer text-sm'
          >
            <option value="" disabled>Выберите категорию</option>
            <optgroup label="Обувь">
              <option value="Кроссовки">Кроссовки</option>
              <option value="Ботинки">Ботинки</option>
              <option value="Кеды">Кеды</option>
              <option value="Туфли">Туфли</option>
              <option value="Бутсы">Бутсы</option>
            </optgroup>
            <optgroup label="Верхняя одежда">
              <option value="Пуховик">Пуховик</option>
              <option value="Жилетка">Жилетка</option>
              <option value="Парка">Парка</option>
              <option value="Легкая куртка">Легкая куртка</option>
              <option value="Ветровка">Ветровка</option>
              <option value="Пиджак">Пиджак</option>
              <option value="Худи">Худи</option>
              <option value="Толстовка">Толстовка</option>
              <option value="Лонгслив">Лонгслив</option>
              <option value="Футболка">Футболка</option>
              <option value="Рубашка">Рубашка</option>
            </optgroup>
            <optgroup label="Штаны">
              <option value="Джинсы">Джинсы</option>
              <option value="Шорты">Шорты</option>
              <option value="Брюки">Брюки</option>
            </optgroup>
            <optgroup label="Головные уборы">
              <option value="Шапка">Шапка</option>
              <option value="Кепка">Кепка</option>
              <option value="Снуд">Снуд</option>
              <option value="Шарф">Шарф</option>
            </optgroup>
            <optgroup label="Сумки/Рюкзаки">
              <option value="Женская сумка маленькая">Женская сумка маленькая</option>
              <option value="Женская сумка большая">Женская сумка большая</option>
              <option value="Рюкзак">Рюкзак</option>
              <option value="Чемодан">Чемодан</option>
              <option value="Дорожная сумка">Дорожная сумка</option>
              <option value="Сумка через плечо">Сумка через плечо</option>
              <option value="Бананка">Бананка</option>
            </optgroup>
            <optgroup label="Аксессуары">
              <option value="Очки">Очки</option>
              <option value="Часы">Часы</option>
              <option value="Украшения">Украшения</option>
              <option value="Ремни">Ремни</option>
              <option value="Перчатки">Перчатки</option>
            </optgroup>
            <optgroup label="Косметика">
              <option value="Парфюм">Парфюм</option>
              <option value="Крем">Крем</option>
              <option value="Помада">Помада</option>
            </optgroup>
            <option value="Прочее">Прочее</option>
          </select>
        </label>
      </div>

      {/* Кнопка */}
      <div className="mt-5">
        <button
          className="text-white text-sm font-semibold py-2.5 rounded-lg bg-blue-500 w-full"
          onClick={handleAddItem}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}

export default Add;