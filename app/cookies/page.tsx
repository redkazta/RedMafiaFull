import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Política de Cookies
          </h1>
          <div className="bg-gray-800/50 rounded-xl p-8">
            <p className="text-gray-300 text-center">
              Página de política de cookies en construcción.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
