import React from 'react';
import PropTypes from 'prop-types';

const variants = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-800',
};

export default function Badge({ text, variant = 'gray' }) {
  const cls = variants[variant] || variants.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{text}</span>;
}

Badge.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(['primary','success','warning','danger','gray']),
};
