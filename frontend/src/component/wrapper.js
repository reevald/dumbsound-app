function CompWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-ds-400 w-full flex flex-col items-center">
      {children}
    </div>
  );
}

export default CompWrapper;