const Filter = ({ filter, setFilter }) => {
  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
