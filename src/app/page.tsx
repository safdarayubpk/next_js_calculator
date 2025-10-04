import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="max-w-md w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Next.js Calculator</h1>
          <p className="text-gray-600">A beautiful and functional calculator built with React and TailwindCSS</p>
        </header>
        <Calculator />
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Use the keyboard for input: numbers, operators, Enter, and Escape</p>
        </footer>
      </div>
    </div>
  );
}
