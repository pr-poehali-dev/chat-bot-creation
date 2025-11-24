import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Букет "Нежность"',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop',
    category: 'Розы',
    description: '15 розовых роз с зеленью',
  },
  {
    id: 2,
    name: 'Букет "Страсть"',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop',
    category: 'Розы',
    description: '25 красных роз премиум',
  },
  {
    id: 3,
    name: 'Букет "Весна"',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
    category: 'Тюльпаны',
    description: '21 разноцветный тюльпан',
  },
  {
    id: 4,
    name: 'Букет "Солнце"',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1597848212624-e24ce6e0bcf7?w=400&h=400&fit=crop',
    category: 'Подсолнухи',
    description: '7 ярких подсолнухов',
  },
  {
    id: 5,
    name: 'Букет "Элегантность"',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=400&fit=crop',
    category: 'Пионы',
    description: 'Белые и розовые пионы',
  },
  {
    id: 6,
    name: 'Букет "Романтика"',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&h=400&fit=crop',
    category: 'Розы',
    description: 'Микс из роз и эвкалипта',
  },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = ['Все', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'Все'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Icon name="Flower2" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Цветочный рай
                </h1>
                <p className="text-xs text-slate-500">Доставка свежих букетов</p>
              </div>
            </div>

            <Button
              onClick={() => setIsCartOpen(true)}
              variant="outline"
              className="relative gap-2"
            >
              <Icon name="ShoppingBag" size={20} />
              <span>Корзина</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-rose-500">{totalItems}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Наши букеты</h2>
            <p className="text-slate-600">Свежие цветы для любого повода</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  selectedCategory === cat &&
                    'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                )}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-white/90 text-pink-600">
                    {product.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-rose-600">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    >
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Flower2" size={24} className="text-pink-400" />
            <span className="text-xl font-bold">Цветочный рай</span>
          </div>
          <p className="text-slate-400 mb-4">Доставка цветов по всему городу</p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={16} />
              <span>+7 (999) 123-45-67</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={16} />
              <span>info@flowers.ru</span>
            </div>
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] flex flex-col animate-fade-in">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Корзина</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCartOpen(false)}
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="ShoppingBag" size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">Корзина пуста</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 border border-slate-200 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {item.price.toLocaleString()} ₽
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-600"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-slate-900">Итого:</span>
                  <span className="text-2xl font-bold text-rose-600">
                    {totalPrice.toLocaleString()} ₽
                  </span>
                </div>
                <Button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Оформить заказ
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Оформление заказа</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input id="name" placeholder="Ваше имя" required />
              </div>

              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
              </div>

              <div>
                <Label htmlFor="address">Адрес доставки</Label>
                <Input id="address" placeholder="Улица, дом, квартира" required />
              </div>

              <div>
                <Label htmlFor="date">Дата доставки</Label>
                <Input id="date" type="date" required />
              </div>

              <div>
                <Label htmlFor="time">Время доставки</Label>
                <Input id="time" type="time" required />
              </div>

              <div>
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Input id="comment" placeholder="Пожелания к заказу" />
              </div>

              <Separator />

              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Товары ({totalItems} шт.)</span>
                  <span className="font-semibold">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Доставка</span>
                  <span className="font-semibold">300 ₽</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Итого:</span>
                  <span className="text-lg font-bold text-rose-600">
                    {(totalPrice + 300).toLocaleString()} ₽
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                Подтвердить заказ
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
