import React from 'react';

import { setFilter } from '../reducers/filterReducer';
import { connect } from 'react-redux';

const Filter = props => {
  const filterChange = e => {
    props.setFilter(e.target.value.toLowerCase());
  };

  return (
    <div>
      <h2>Filter</h2>
      <input
        type='text'
        name='filter'
        onChange={filterChange}
        placeholder='filter'
      />
    </div>
  );
};

const mapDispatchToProps = { setFilter };

const connectedFilter = connect(null, mapDispatchToProps)(Filter);
export default connectedFilter;
