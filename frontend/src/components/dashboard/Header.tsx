
const Header = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Dashboard Monitoring
        </h2>

        <p className="mt-1 hidden text-sm text-gray-500 sm:block">
          Monitoring kondisi tanaman krisan
        </p>
      </div>
    </header>
  );
};

export default Header;