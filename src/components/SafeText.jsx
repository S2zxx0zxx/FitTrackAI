import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeInput } from '../utils/validation';

const SafeText = ({ children, as: Component = 'div', ...props }) => {
  const sanitizedContent = sanitizeInput(children);
  
  return (
    <Component 
      {...props} 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

SafeText.propTypes = {
  children: PropTypes.string.isRequired,
  as: PropTypes.elementType
};

export default SafeText;