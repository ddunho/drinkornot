import { useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';

interface DrinkItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CustomItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

type Language = 'ko' | 'en';

const translations = {
  ko: {
    title: '🍻 술값 계산기',
    totalPeople: '총 인원',
    nonDrinkers: '술 안마신 인원',
    totalAmount: '총 금액 (원)',
    drinkItems: '술 항목',
    soju: '소주',
    beer: '맥주',
    highball: '하이볼',
    quantity: '수량',
    unitPrice: '단가 (원)',
    subtotal: '소계',
    itemName: '항목명',
    itemPlaceholder: '예: 와인, 칵테일 등',
    addCustomItem: '기타 항목 추가',
    calculate: '계산하기',
    result: '💰 계산 결과',
    totalDrinkCost: '총 술 금액:',
    foodCost: '음식 금액:',
    drinkers: '🍺 술 마신 사람',
    nonDrinkersLabel: '🥤 술 안마신 사람',
    people: '명',
    won: '원',
    alertTotalPeople: '총 인원을 입력해주세요.',
    alertNonDrinkers: '술 안마신 인원은 총 인원보다 클 수 없습니다.',
  },
  en: {
    title: '🍻 Drink Bill Splitter',
    totalPeople: 'Total People',
    nonDrinkers: 'Non-Drinkers',
    totalAmount: 'Total Amount ($)',
    drinkItems: 'Drink Items',
    soju: 'Beer',
    beer: 'Wine',
    highball: 'Whiskey',
    quantity: 'Quantity',
    unitPrice: 'Unit Price ($)',
    subtotal: 'Subtotal',
    itemName: 'Item Name',
    itemPlaceholder: 'e.g., Wine, Cocktail, etc.',
    addCustomItem: 'Add Custom Item',
    calculate: 'Calculate',
    result: '💰 Calculation Result',
    totalDrinkCost: 'Total Drink Cost:',
    foodCost: 'Food Cost:',
    drinkers: '🍺 Drinkers',
    nonDrinkersLabel: '🥤 Non-Drinkers',
    people: 'people',
    won: ' dollars',
    alertTotalPeople: 'Please enter the total number of people.',
    alertNonDrinkers: 'Non-drinkers cannot exceed total people.',
  },
};

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const [totalPeople, setTotalPeople] = useState<number>(0);
  const [nonDrinkers, setNonDrinkers] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  
  const [drinks, setDrinks] = useState<DrinkItem[]>([
    { id: 'soju', name: 'soju', quantity: 0, price: 0 },
    { id: 'beer', name: 'beer', quantity: 0, price: 0 },
    { id: 'highball', name: 'highball', quantity: 0, price: 0 },
  ]);
  
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [showResult, setShowResult] = useState(false);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const addCustomItem = () => {
    const newItem: CustomItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      price: 0,
    };
    setCustomItems([...customItems, newItem]);
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(customItems.filter(item => item.id !== id));
  };

  const updateCustomItem = (id: string, field: keyof CustomItem, value: string | number) => {
    setCustomItems(customItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateDrink = (id: string, field: 'quantity' | 'price', value: number) => {
    setDrinks(drinks.map(drink => 
      drink.id === id ? { ...drink, [field]: value } : drink
    ));
  };

  const calculateTotal = () => {
    const drinkTotal = drinks.reduce((sum, drink) => sum + (drink.quantity * drink.price), 0);
    const customTotal = customItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalDrinkCost = drinkTotal + customTotal;

    const foodCost = totalAmount - totalDrinkCost;
    const drinkers = totalPeople - nonDrinkers;
    const foodPerPerson = totalPeople > 0 ? foodCost / totalPeople : 0;
    const drinkPerPerson = drinkers > 0 ? totalDrinkCost / drinkers : 0;
    const drinkerTotal = foodPerPerson + drinkPerPerson;
    const nonDrinkerTotal = foodPerPerson;

    return {
      totalDrinkCost,
      foodCost,
      drinkers,
      drinkerTotal: Math.round(drinkerTotal),
      nonDrinkerTotal: Math.round(nonDrinkerTotal),
    };
  };

  const handleCalculate = () => {
    if (totalPeople === 0) {
      alert(t.alertTotalPeople);
      return;
    }
    if (nonDrinkers > totalPeople) {
      alert(t.alertNonDrinkers);
      return;
    }
    setShowResult(true);
  };

  const result = showResult ? calculateTotal() : null;

  const getDrinkName = (drinkId: string): string => {
    const drinkNames: Record<string, keyof typeof translations.ko> = {
      soju: 'soju',
      beer: 'beer',
      highball: 'highball',
    };
    return t[drinkNames[drinkId]] || drinkId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs font-medium text-gray-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm cursor-pointer"
        >
          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
          {language === 'ko' ? 'EN' : '한국어'}
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-indigo-900 mt-10 sm:mt-0 leading-tight">
          {t.title}
        </h1>

        {/* Basic Info Input */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.totalPeople}
              </label>
              <input
                type="number"
                value={totalPeople || ''}
                onChange={(e) => setTotalPeople(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.nonDrinkers}
              </label>
              <input
                type="number"
                value={nonDrinkers || ''}
                onChange={(e) => setNonDrinkers(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.totalAmount}
            </label>
            <input
              type="number"
              value={totalAmount || ''}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Drink Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.drinkItems}</h2>
          <div className="space-y-4">
            {drinks.map((drink) => (
              <div key={drink.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">{getDrinkName(drink.id)}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.quantity}</label>
                    <input
                      type="number"
                      value={drink.quantity || ''}
                      onChange={(e) => updateDrink(drink.id, 'quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.unitPrice}</label>
                    <input
                      type="number"
                      value={drink.price || ''}
                      onChange={(e) => updateDrink(drink.id, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div className="text-right mt-2 text-sm text-gray-600">
                  {t.subtotal}: {(drink.quantity * drink.price).toLocaleString()}{t.won}
                </div>
              </div>
            ))}

            {/* Custom Items */}
            {customItems.map((item) => (
              <div key={item.id} className="bg-amber-50 p-4 rounded-lg relative">
                <button
                  onClick={() => removeCustomItem(item.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">{t.itemName}</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateCustomItem(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder={t.itemPlaceholder}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.quantity}</label>
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateCustomItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.unitPrice}</label>
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => updateCustomItem(item.id, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div className="text-right mt-2 text-sm text-gray-600">
                  {t.subtotal}: {(item.quantity * item.price).toLocaleString()}{t.won}
                </div>
              </div>
            ))}

            <button
              onClick={addCustomItem}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {t.addCustomItem}
            </button>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg cursor-pointer"
        >
          {t.calculate}
        </button>

        {/* Result Display */}
        {showResult && result && (
          <div className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">{t.result}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{t.totalDrinkCost}</span>
                  <span className="font-bold text-lg">{result.totalDrinkCost.toLocaleString()}{t.won}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t.foodCost}</span>
                  <span className="font-bold text-lg">{result.foodCost.toLocaleString()}{t.won}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50 border-2 border-rose-200 p-5 rounded-xl">
                <h3 className="font-semibold text-rose-900 mb-2">{t.drinkers}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ({result.drinkers} {t.people})
                </p>
                <p className="text-3xl font-bold text-rose-600">
                  {result.drinkerTotal.toLocaleString()}{t.won}
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 p-5 rounded-xl">
                <h3 className="font-semibold text-green-900 mb-2">{t.nonDrinkersLabel}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ({nonDrinkers} {t.people})
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {result.nonDrinkerTotal.toLocaleString()}{t.won}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}