import React from 'react';

export default function Transaction(props) {
  const { transaction, editFunction, deleteFunction } = props;
  const {
    category,
    description,
    value,
    day,
    type,
    yearMonthDay,
    _id,
  } = transaction;
  let colorClass = 'row red lighten-3 card-panel';
  if (type === '+') {
    colorClass = 'row teal accent-2 card-panel';
  }
  const toMoney = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
      .format(value)
      .toString();

  const handleEdit = () => {
    editFunction(_id);
  };

  const handleDelete = () => {
    deleteFunction(_id);
  };

  return (
    <div className={colorClass}>
      <div className="col s2">
        {('0' + day).substr(-2, 2)} {yearMonthDay}
      </div>
      <div className="col s2">{category}</div>
      <div className="col s3"> {description}</div>
      <div className="col s3">{toMoney(value)}</div>
      <div className="col s2">
        <button class="btn-small btn-floating btn-flat" onClick={handleEdit}>
          <i class="material-icons black-text">edit</i>
        </button>
        &nbsp;
        <button class="btn-small btn-flat btn-floating" onClick={handleDelete}>
          <i class="material-icons red-text">delete</i>
        </button>
      </div>
    </div>
  );
}
