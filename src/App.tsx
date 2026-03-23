import { useState } from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

type Language = 'ko' | 'en';

const translations = {
  ko: {
    pageTitle: '술값 계산기',
    heroTitle: '술마신 사람만 더 내는 술값 계산기',
    heroDescription:
      '술자리, 회식, 모임에서 술 마신 사람과 안 마신 사람을 구분해 더 공평하게 정산할 수 있는 더치페이 계산기입니다.',
    heroDescription2:
      '전체 금액에서 술값을 먼저 계산하고, 음식값은 전체 인원에게 나눠 회식 정산이나 모임 정산을 빠르게 끝낼 수 있습니다.',
    feature1Title: '술값과 음식값 분리',
    feature1Body: '술값은 술을 마신 사람끼리만 나누고, 음식값은 전체 인원에게 균등하게 배분합니다.',
    feature2Title: '더치페이 계산기',
    feature2Body: '술자리 더치페이, 회식 정산, 친구 모임 정산에 바로 사용할 수 있습니다.',
    feature3Title: '모바일에서도 빠른 입력',
    feature3Body: '소주, 맥주, 하이볼과 같은 기본 주종과 추가 항목을 함께 입력할 수 있습니다.',
    totalPeople: '총 인원',
    nonDrinkers: '술 안 마신 인원',
    totalAmount: '총 금액 (원)',
    drinkItems: '주류 항목',
    soju: '소주',
    beer: '맥주',
    highball: '하이볼',
    quantity: '수량',
    unitPrice: '개당 가격 (원)',
    subtotal: '소계',
    itemName: '항목 이름',
    itemPlaceholder: '예) 칵테일, 와인, 안주 추가금',
    addCustomItem: '추가 항목 넣기',
    calculate: '계산하기',
    result: '계산 결과',
    totalDrinkCost: '총 술값',
    foodCost: '음식값',
    drinkers: '술 마신 사람',
    nonDrinkersLabel: '술 안 마신 사람',
    people: '명',
    won: '원',
    alertTotalPeople: '총 인원을 입력해주세요.',
    alertNonDrinkers: '술 안 마신 인원은 총 인원보다 많을 수 없습니다.',
    howTitle: '이 계산기를 이렇게 사용하세요',
    how1: '총 인원과 술을 안 마신 인원을 입력합니다.',
    how2: '총 금액과 술 종류별 수량, 가격을 입력합니다.',
    how3: '계산하기를 누르면 술 마신 사람과 안 마신 사람의 부담 금액이 따로 나옵니다.',
    faqTitle: '자주 묻는 질문',
    faq1Q: '술값 계산기는 어떻게 계산하나요?',
    faq1A:
      '전체 금액에서 술값을 먼저 구한 뒤, 음식값은 전체 인원에게 나누고 술값은 술을 마신 사람끼리만 나눠 계산합니다.',
    faq2Q: '더치페이 계산기와 무엇이 다른가요?',
    faq2A:
      '일반 더치페이는 모두 같은 금액을 내지만, 이 계산기는 술을 마신 사람과 안 마신 사람을 구분해 더 공평하게 정산합니다.',
    faq3Q: '회식 정산이나 모임 정산에도 쓸 수 있나요?',
    faq3A:
      '회식, 친구 모임, 동호회 모임, 술자리처럼 술값을 구분해야 하는 대부분의 상황에서 바로 사용할 수 있습니다.',
  },
  en: {
    pageTitle: 'Drink Bill Calculator',
    heroTitle: 'Drink Bill Calculator for Fair Split',
    heroDescription:
      'Split bills fairly between drinkers and non-drinkers for parties, team dinners, and casual gatherings.',
    heroDescription2:
      'Calculate drink costs first, then split the remaining food cost across everyone for a quick and fair result.',
    feature1Title: 'Separate drinks and food',
    feature1Body: 'Drink costs are shared only by drinkers, while food costs are split across the whole group.',
    feature2Title: 'Useful bill splitter',
    feature2Body: 'Use it for group dinners, parties, and any gathering where drink costs should be separated.',
    feature3Title: 'Quick mobile input',
    feature3Body: 'Add default drink types and custom items with quantity and unit price.',
    totalPeople: 'Total People',
    nonDrinkers: 'Non-Drinkers',
    totalAmount: 'Total Amount',
    drinkItems: 'Drink Items',
    soju: 'Soju',
    beer: 'Beer',
    highball: 'Highball',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    subtotal: 'Subtotal',
    itemName: 'Item Name',
    itemPlaceholder: 'ex) Cocktail, Wine',
    addCustomItem: 'Add Custom Item',
    calculate: 'Calculate',
    result: 'Result',
    totalDrinkCost: 'Total Drink Cost',
    foodCost: 'Food Cost',
    drinkers: 'Drinkers',
    nonDrinkersLabel: 'Non-Drinkers',
    people: 'people',
    won: '',
    alertTotalPeople: 'Please enter the total number of people.',
    alertNonDrinkers: 'Non-drinkers cannot exceed total people.',
    howTitle: 'How to use this calculator',
    how1: 'Enter the total number of people and non-drinkers.',
    how2: 'Enter the total amount, drink quantities, and prices.',
    how3: 'Press calculate to see separate totals for drinkers and non-drinkers.',
    faqTitle: 'FAQ',
    faq1Q: 'How does this calculator work?',
    faq1A:
      'It calculates the total drink cost first, splits food cost across everyone, and then shares drink cost only among drinkers.',
    faq2Q: 'How is it different from a normal split bill calculator?',
    faq2A:
      'A normal split divides everything equally, but this calculator separates drinkers and non-drinkers for a fairer result.',
    faq3Q: 'Can I use it for work dinners or group outings?',
    faq3A:
      'Yes. It works well for team dinners, parties, and any group outing where drink costs need to be separated.',
  },
} as const;

const defaultDrinks: Item[] = [
  { id: 'soju', name: 'soju', quantity: 0, price: 0 },
  { id: 'beer', name: 'beer', quantity: 0, price: 0 },
  { id: 'highball', name: 'highball', quantity: 0, price: 0 },
];

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const [totalPeople, setTotalPeople] = useState(0);
  const [nonDrinkers, setNonDrinkers] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [drinks, setDrinks] = useState<Item[]>(defaultDrinks);
  const [customItems, setCustomItems] = useState<Item[]>([]);
  const [showResult, setShowResult] = useState(false);

  const t = translations[language];
  const formatter = new Intl.NumberFormat(language === 'ko' ? 'ko-KR' : 'en-US');

  const formatCurrency = (value: number) => {
    if (language === 'ko') {
      return `${formatter.format(value)}${t.won}`;
    }

    return `$${formatter.format(value)}`;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  const addCustomItem = () => {
    setCustomItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', quantity: 0, price: 0 },
    ]);
  };

  const removeCustomItem = (id: string) => {
    setCustomItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCustomItem = (id: string, field: keyof Item, value: string | number) => {
    setCustomItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateDrink = (id: string, field: 'quantity' | 'price', value: number) => {
    setDrinks((prev) =>
      prev.map((drink) => (drink.id === id ? { ...drink, [field]: value } : drink)),
    );
  };

  const calculateTotal = () => {
    const drinkTotal = drinks.reduce((sum, drink) => sum + drink.quantity * drink.price, 0);
    const customTotal = customItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const totalDrinkCost = drinkTotal + customTotal;
    const foodCost = totalAmount - totalDrinkCost;
    const drinkers = totalPeople - nonDrinkers;
    const foodPerPerson = totalPeople > 0 ? foodCost / totalPeople : 0;
    const drinkPerPerson = drinkers > 0 ? totalDrinkCost / drinkers : 0;

    return {
      totalDrinkCost,
      foodCost,
      drinkers,
      drinkerTotal: Math.round(foodPerPerson + drinkPerPerson),
      nonDrinkerTotal: Math.round(foodPerPerson),
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

  const getDrinkName = (drinkId: string) => {
    const drinkNames: Record<string, 'soju' | 'beer' | 'highball'> = {
      soju: 'soju',
      beer: 'beer',
      highball: 'highball',
    };

    return t[drinkNames[drinkId]];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <main className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
        <button
          type="button"
          onClick={toggleLanguage}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs font-medium text-gray-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm cursor-pointer"
          aria-label="Toggle language"
        >
          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
          {language === 'ko' ? 'EN' : 'KO'}
        </button>

        <section className="mt-10 sm:mt-0 mb-8">
          <p className="text-sm font-semibold text-indigo-600 mb-2">{t.pageTitle}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-900 leading-tight mb-4">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-7 mb-3">{t.heroDescription}</p>
          <p className="text-sm sm:text-base text-gray-700 leading-7">{t.heroDescription2}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <article className="bg-gray-50 rounded-xl p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">{t.feature1Title}</h2>
            <p className="text-sm text-gray-600 leading-6">{t.feature1Body}</p>
          </article>
          <article className="bg-gray-50 rounded-xl p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">{t.feature2Title}</h2>
            <p className="text-sm text-gray-600 leading-6">{t.feature2Body}</p>
          </article>
          <article className="bg-gray-50 rounded-xl p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">{t.feature3Title}</h2>
            <p className="text-sm text-gray-600 leading-6">{t.feature3Body}</p>
          </article>
        </section>

        <section className="space-y-6 mb-8" aria-label="Calculator input">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.totalPeople}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.nonDrinkers}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.totalAmount}</label>
            <input
              type="number"
              value={totalAmount || ''}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>
        </section>

        <section className="mb-8">
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
                  {t.subtotal}: {formatCurrency(drink.quantity * drink.price)}
                </div>
              </div>
            ))}

            {customItems.map((item) => (
              <div key={item.id} className="bg-amber-50 p-4 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeCustomItem(item.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  aria-label="Remove custom item"
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
                  {t.subtotal}: {formatCurrency(item.quantity * item.price)}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCustomItem}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {t.addCustomItem}
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg cursor-pointer"
        >
          {t.calculate}
        </button>

        {showResult && result && (
          <section className="mt-8 space-y-4" aria-live="polite">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">{t.result}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{t.totalDrinkCost}</span>
                  <span className="font-bold text-lg">{formatCurrency(result.totalDrinkCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t.foodCost}</span>
                  <span className="font-bold text-lg">{formatCurrency(result.foodCost)}</span>
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
                  {formatCurrency(result.drinkerTotal)}
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 p-5 rounded-xl">
                <h3 className="font-semibold text-green-900 mb-2">{t.nonDrinkersLabel}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ({nonDrinkers} {t.people})
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(result.nonDrinkerTotal)}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 bg-indigo-50 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-indigo-900 mb-3">{t.howTitle}</h2>
          <ol className="space-y-3 text-sm text-gray-700 leading-6">
            <li>1. {t.how1}</li>
            <li>2. {t.how2}</li>
            <li>3. {t.how3}</li>
          </ol>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">{t.faqTitle}</h2>

          <article className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-2">{t.faq1Q}</h3>
            <p className="text-sm text-gray-600 leading-6">{t.faq1A}</p>
          </article>

          <article className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-2">{t.faq2Q}</h3>
            <p className="text-sm text-gray-600 leading-6">{t.faq2A}</p>
          </article>

          <article className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-2">{t.faq3Q}</h3>
            <p className="text-sm text-gray-600 leading-6">{t.faq3A}</p>
          </article>
        </section>
      </main>
    </div>
  );
}
