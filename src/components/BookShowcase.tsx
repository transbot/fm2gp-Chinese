import { useLanguage } from '../context/LanguageContext';
import { CHINESE_BOOK_COVER, CHINESE_BOOK_STORE_URL, MOBILE_QR_IMAGE, WEB_APP_URL } from '../config/book';

export function BookShowcase() {
  const { lang } = useLanguage();
  const chinese = {
    id: 'zh',
    title: lang === 'zh' ? '中文版' : 'Chinese edition',
    subtitle: lang === 'zh' ? '清华大学出版社 · 2026 年 10 月' : 'Tsinghua University Press · October 2026',
    image: CHINESE_BOOK_COVER,
    alt: '数学与泛型编程：高效编程的奥秘',
    url: CHINESE_BOOK_STORE_URL.trim(),
  };
  const english = {
    id: 'en',
    title: lang === 'zh' ? '英文原版' : 'English edition',
    subtitle: 'Alexander A. Stepanov · Daniel E. Rose',
    image: '/images/EnglishEditionCover.png',
    alt: 'From Mathematics to Generic Programming',
    url: '',
  };

  return (
    <footer id="book-showcase" className="space-y-6">
      <section aria-labelledby="mobile-title" className="flex flex-col sm:flex-row items-center justify-center gap-5 rounded-xl border border-gray-100 bg-white p-6">
        <img src={MOBILE_QR_IMAGE} width={185} height={185} alt={lang === 'zh' ? '网页版应用二维码' : 'QR code for the web app'} className="shrink-0" />
        <div className="min-w-0 text-center sm:text-left">
          <h2 id="mobile-title" className="text-xl font-bold text-gray-800">{lang === 'zh' ? '手机版' : 'Mobile version'}</h2>
          <p className="mt-2 text-gray-600">{lang === 'zh' ? '用手机扫码打开网页版' : 'Scan with your phone to open the web app'}</p>
          <a href={WEB_APP_URL} className="mt-3 inline-block break-all text-blue-700 underline">{WEB_APP_URL}</a>
        </div>
      </section>
      <section aria-labelledby="books-title" className="rounded-xl border border-gray-100 bg-white p-6 sm:p-8">
        <h2 id="books-title" className="text-xl font-bold text-gray-800 mb-6">{lang === 'zh' ? '从书页到实践' : 'From the book to practice'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          {(lang === 'zh' ? [chinese, english] : [english, chinese]).map((book) => {
            const cover = <img src={book.image} alt={book.alt} className="block h-auto w-full max-w-xs mx-auto rounded shadow-md" />;
            return (
              <figure key={book.id} className="min-w-0 text-center" data-edition={book.id}>
                {book.url ? <a href={book.url} className="block rounded focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600" aria-label={lang === 'zh' ? '打开中文版购书页面' : 'Open the Chinese edition bookstore'}>{cover}</a> : cover}
                <figcaption className="mt-4">
                  <h3 className="font-semibold text-gray-800">{book.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{book.subtitle}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </footer>
  );
}
